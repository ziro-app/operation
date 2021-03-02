import currencyFormat from '@ziro/currency-format'
import { db } from '../../../Firebase/index'

const sendToBackend = (state, newPlan) => {
  const { nickname, setMessageToast, setOpenToast, setTypeOfToast } = state
  const allowedUsers = ['Uiller', 'Vitor', 'Alessandro', 'Wermeson', 'Ale', 'Antonio', 'Russi']
  const nome = nickname ? nickname.trim() : ''
  return new Promise(async (resolve, reject) => {
    try {
      if (process.env.HOMOLOG ? true : allowedUsers.includes(nome)) {
        const standardPlans = newPlan
        await db.collection('utilities').doc(process.env.DOCUMENT_ID_FOR_UTILITIES_MAIN).update({
          'main.standardPlans': standardPlans,
        })
        // setSellerZoopPlanForFirebase({})
        setTypeOfToast('success')
        setMessageToast('Taxa atualizada!')
        setOpenToast(true)
        resolve('Plano atualizado')
        // } else throw { msg: 'Atualize ao menos um campo', customError: true }
      } else {
        throw { msg: 'Permissão insuficiente', customError: true }
      }
    } catch (error) {
      console.log(error)

      setTypeOfToast('alert')
      if (error.customError) {
        setMessageToast(error.msg)
        reject(error)
      } else if (error.response && error.response.data) {
        const { erro, message } = error.response.data
        console.log(message)

        setMessageToast('Ocorreu um erro ao modificar o plano no firebase!')
        reject({ msg: erro, customError: true })
      } else {
        setMessageToast('Ocorreu um erro genérico, entre em contato com os devs!')
        reject(error)
      }

      setOpenToast(true)
    }
  })
}

export default sendToBackend
