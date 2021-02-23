import axios from 'axios'
import currencyFormat from '@ziro/currency-format'
import Error from '@bit/vitorbarbosa19.ziro.error'
import { db } from '../../Firebase/index'
import { translateFeesToFirebase, translateFirebaseToFees, translateFeesToZoop } from './functions'

const sendToBackend = async state => {
  const { docId, selectedPlan, nickname, sellerZoopPlan2, setSettingActivePlan, existSupplierId, supplier } = state
  const nome = nickname ? nickname.trim() : ''
  const allowedUsers = ['Uiller', 'Vitor', 'Wermeson', 'Ale', 'Russi']
  return new Promise(async (resolve, reject) => {
    try {
      if (translateFeesToZoop(selectedPlan) != null) {
        if (process.env.HOMOLOG ? true : allowedUsers.includes(nome)) {
          const oldActivePlan = sellerZoopPlan2.activePlan
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
              };
              if(dataOldPlan.items.length > 0){
              const urlDisassociate = `${process.env.PAY}/plan-subscription-disassociate?plan=${dataOldPlan.items[0].id}`;
              const methodDisassociate = "DELETE";
              await axios({ url:urlDisassociate, method:methodDisassociate, headers });
              }
              const url = `${process.env.PAY}/plan-subscription-update`;
              const method = "POST";
              const data = {
                              customer: supplier.zoopId, 
                              quantity: 1,
                              plan: translateFeesToZoop(selectedPlan), 
                            }
              await axios({ url, method, headers, data });
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
        reject({ msg: erro, customError: true })
      } else reject(error)
    }
  })
}

export default sendToBackend
