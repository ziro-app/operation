import axios from 'axios'
import currencyFormat from '@ziro/currency-format'
import Error from '@bit/vitorbarbosa19.ziro.error'
import { db } from '../../Firebase/index'
import { translateFeesToFirebase, translateFirebaseToFees, translateFeesToZoop } from './functions'
import { IApiData, IFirebaseData } from '../utils/useRollback/IRollbackData'

const sendToBackend = async state => {
  const {
    docId,
    selectedPlan,
    nickname,
    sellerZoopPlan2,
    setActivePlan,
    createRollbackItem,
    startRollback,
    cleanRollback,
    supplier,
    setIsLoadingFunction,
  } = state
  const nome = nickname ? nickname.trim() : ''
  const allowedUsers = ['Uiller', 'Vitor', 'Wermeson', 'Ale', 'Russi', 'Fernanda']
  return new Promise(async (resolve, reject) => {
    try {
      if (translateFeesToZoop(selectedPlan) != null) {
        if (process.env.HOMOLOG ? true : allowedUsers.includes(nome)) {
          const sellerPlanWithNewActivePlan = sellerZoopPlan2
          sellerPlanWithNewActivePlan.activePlan = translateFeesToFirebase(selectedPlan)

          const urlGetPlan = `https://api.zoop.ws/v1/marketplaces/${process.env.ZIRO_MARKETPLACE}/sellers/${supplier.zoopId}/subscriptions`
          const { data: dataOldPlan } = await axios(urlGetPlan, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: process.env.ZOOP_TOKEN,
            },
          })
          const headers = {
            Authorization: `Basic ${process.env.PAY_TOKEN}`,
          }
          if (dataOldPlan.items.length > 0) {
            const urlDisassociate = `${process.env.PAY}/plan-subscription-disassociate?plan=${dataOldPlan.items[0].id}`
            const methodDisassociate = 'DELETE'
            await axios({ url: urlDisassociate, method: methodDisassociate, headers })
          }
          const url = `${process.env.PAY}/plan-subscription-update`
          const method = 'POST'
          const data = {
            customer: supplier.zoopId,
            quantity: 1,
            plan: translateFeesToZoop(selectedPlan),
          }
          if (dataOldPlan.items.length > 0) {
            const zoopData: IApiData = {
              origin: 'api',
              url: `${process.env.PAY}/plan-subscription-update`,
              headers,
              method: 'POST',
              data: {
                customer: supplier.zoopId,
                quantity: 1,
                plan: dataOldPlan.items[0].plan.id,
              },
            }
            createRollbackItem(zoopData)
          }
          await axios({ url, method, headers, data })
          const firebaseData: IFirebaseData = {
            method: 'update',
            collection: 'suppliers',
            field: 'sellerZoopPlan',
            identifier: docId,
            origin: 'firebase',
            fieldUpdated: 'sellerZoopPlan',
            valueUpdated: sellerZoopPlan2,
          }
          createRollbackItem(firebaseData)
          await db.collection('suppliers').doc(docId).update({
            sellerZoopPlan: sellerPlanWithNewActivePlan,
          })
          cleanRollback()
          setActivePlan(translateFirebaseToFees(selectedPlan))
          resolve('Plano atualizado')
        } else throw { msg: 'Permissão insuficiente', customError: true }
      } else throw { msg: 'ID do plano é inválido!', customError: true }
    } catch (error) {
      startRollback()
      setIsLoadingFunction(false)
      if (error.customError) {
        const { msg } = error
        reject({ msg, customError: true })
      } else {
        reject({ msg: 'Erro na troca do plano! Nada mudou!', customError: true })
      }
      console.log(error)
    }
  })
}

export default sendToBackend
