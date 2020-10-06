import currencyFormat from '@ziro/currency-format'
import { db } from '../../Firebase/index'

const sendToBackend = state => {
  const { docId, selectedPlan, nickname, sellerZoopPlan2 } = state
  const nome = nickname ? nickname.trim() : ''
  const allowedUsers = ['Uiller', 'Vitor', 'Alessandro', 'Wermeson', 'Ale']

  return new Promise(async (resolve, reject) => {
    try {
      if (process.env.HOMOLOG ? true : allowedUsers.includes(nome)) {
        const sellerPlanWithNewActivePlan = sellerZoopPlan2
        sellerPlanWithNewActivePlan.activePlan = selectedPlan
        console.log('sellerPlanWithNewActivePlan', sellerPlanWithNewActivePlan)
        await db.collection('suppliers').doc(docId).update({
          sellerZoopPlan2: sellerPlanWithNewActivePlan,
        })
        resolve('Plano atualizado')
      } else throw { msg: 'Permissão insuficiente', customError: true }
    } catch (error) {
      console.log(error)
      if (error.customError) reject(error)
      else if (error.response && error.response.data && error.response.data.erro) {
        const { erro, message } = error.response.data
        console.log(message)
        reject({ msg: erro, customError: true })
      } else reject(error)
    }
  })
}

export default sendToBackend
