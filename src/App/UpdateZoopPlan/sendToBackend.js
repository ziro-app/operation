import axios from 'axios'
import currencyFormat from '@ziro/currency-format'
import Error from '@bit/vitorbarbosa19.ziro.error'
import { db } from '../../Firebase/index'
import { translateFeesToFirebase, translateFirebaseToFees, translateFeesToZoop } from './functions'

const sendToBackend = async state => {
  const { docId, selectedPlan, nickname, sellerZoopPlan2, setSettingActivePlan, sellerId } = state
  const nome = nickname ? nickname.trim() : ''
  const allowedUsers = ['Uiller', 'Vitor', 'Alessandro', 'Wermeson', 'Ale']
  return new Promise(async (resolve, reject) => {
    try {
      if (translateFeesToZoop(selectedPlan) != null) {
        if (process.env.HOMOLOG ? true : allowedUsers.includes(nome)) {
          const sellerPlanWithNewActivePlan = sellerZoopPlan2
          sellerPlanWithNewActivePlan.activePlan = translateFeesToFirebase(selectedPlan)
          if(nome === 'Ale') {
          const url = 'https://api.zoop.ws/v1/marketplaces/d3efdd7939974e0dbec700624a741cf6/subscriptions'
          const config = {
            method: 'POST',
            url,
            data: {
                plan: translateFeesToZoop(selectedPlan), customer: sellerId
            },
            headers: {
              Authorization: process.env.ZOOP_TOKEN,
              'Content-Type': 'application/json',
            },
          }
          await axios(config)
          }
          setSettingActivePlan(translateFirebaseToFees(selectedPlan))
          await db.collection('suppliers').doc(docId).update({
            sellerZoopPlan: sellerPlanWithNewActivePlan,
          })
          resolve('Plano atualizado')
        } else throw { msg: 'Permissão insuficiente', customError: true }
      } else throw { msg: 'ID do plano é inválido!', customError: true }
    } catch (error) {
      console.log(error)
      if (error.customError) reject(error)
      else if (error.response && error.response.data && error.response.data.erro) {
        const { erro, message } = error.response.data
        // console.log(message)
        reject({ msg: erro, customError: true })
      } else reject(error)
    }
  })
}

export default sendToBackend
