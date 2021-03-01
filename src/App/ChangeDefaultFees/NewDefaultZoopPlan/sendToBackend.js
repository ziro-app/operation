import { db } from '../../../Firebase/index'

const sendToBackend = (sellerZoopPlanForFirebase, nickname, setPlanName) => {
  const allowedUsers = ['Uiller', 'Vitor', 'Alessandro', 'Wermeson', 'Ale', 'Antonio']
  const nome = nickname ? nickname.trim() : ''
  return new Promise(async (resolve, reject) => {
    try {
      if (process.env.HOMOLOG ? true : allowedUsers.includes(nome)) {
        await db.collection('utilities').doc(process.env.DOCUMENT_ID_FOR_UTILITIES_MAIN).update({
          'main.standardPlans': sellerZoopPlanForFirebase,
        })
        setPlanName('')
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
