import currencyFormat from '@ziro/currency-format'
import { db } from '../../../Firebase/index'

const sendToBackend = (state, newPlan) => {
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
        const currentZoopFee = newPlan
        const main = { currentZoopFee }
        await db.collection('utilities').doc(process.env.DOCUMENT_ID_FOR_UTILITIES_MAIN).update({
          main,
        })
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
