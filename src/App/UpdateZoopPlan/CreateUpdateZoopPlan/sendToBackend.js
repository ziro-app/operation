import currencyFormat from '@ziro/currency-format'
import { db } from '../../../Firebase/index'

const sendToBackend = (state, newPlan) => {
  console.log('entrou sendToBackend')
  const {
    sellerId,
    sellerZoopPlanForFirebase,
    fee,
    setSellerZoopPlanForFirebase,
    nickname,
    defaultValues,
    selectedPlan,
    activePlan,
    sellerZoopPlan,
    otherPlansForFirebase,
    sellerActualZoopPlanForFirebase,
  } = state
  const allowedUsers = ['Uiller', 'Vitor', 'Alessandro', 'Wermeson', 'Ale']
  const nome = nickname ? nickname.trim() : ''
  return new Promise(async (resolve, reject) => {
    try {
      if (process.env.HOMOLOG ? true : allowedUsers.includes(nome)) {
        console.log('entrou 1')
        // if (Object.keys(sellerZoopPlanForFirebase).length !== 0) {
        console.log('newPlan dentro do backend', newPlan)
        console.log(sellerActualZoopPlanForFirebase)
        await db.collection('suppliers').doc(sellerId).update({
          sellerZoopPlan2: newPlan, // newPlan, // sellerActualZoopPlanForFirebase,
        })
        console.log('entrou 3')
        // setSellerZoopPlanForFirebase({})
        resolve('Plano atualizado')
        // } else throw { msg: 'Atualize ao menos um campo', customError: true }
      } else throw { msg: 'Permissão insuficiente', customError: true }
    } catch (error) {
      console.log(error)
      if (error.customError) reject(error)
      else if (error.response && error.response.data) {
        const { erro, message } = error.response.data
        console.log(message)
        reject({ msg: erro, customError: true })
      } else reject(error)
    }
  })
}

export default sendToBackend
