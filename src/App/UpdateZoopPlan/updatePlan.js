import { db } from '../../Firebase/index'

const updatePlan = (sellerZoopPlanForFirebase, nickname, sellerId) => {
  const allowedUsers = ['Uiller', 'Vitor', 'Fernanda', 'Wermeson', 'Ale', 'Antonio', 'Russi']
  const nome = nickname ? nickname.trim() : ''
  return new Promise(async (resolve, reject) => {
    try {
      if (process.env.HOMOLOG ? true : allowedUsers.includes(nome)) {
        await db.collection('suppliers').doc(sellerId).update({
          sellerZoopPlan: sellerZoopPlanForFirebase, // newPlan, // sellerActualZoopPlanForFirebase,
        })
        resolve('Plano atualizado')

        localStorage.removeItem('selectedPlan')
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

export default updatePlan
