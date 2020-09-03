import currencyFormat from '@ziro/currency-format'
import { db } from '../../Firebase/index'

const sendToBackend = state => () => {
  const {
    supplier,
    markupPercentage,
    antifraudPercentage,
    nickname,
    setSupplier,
    setBlocks,
    setMarkupPercentage,
    setAntifraudPercentage,
    mountBlock,
  } = state
  const { docId } = supplier
  const nome = nickname ? nickname.trim() : ''
  const percentMarkup = markupPercentage ? markupPercentage / 100 : -1
  const percentAntifraud = antifraudPercentage ? antifraudPercentage / 100 : -1
  const allowedUsers = ['Uiller']

  return new Promise(async (resolve, reject) => {
    try {
      if (process.env.HOMOLOG ? true : allowedUsers.includes(nome)) {
        if (percentMarkup !== -1 || percentAntifraud !== -1) {
          await db
            .collection('suppliers')
            .doc(docId)
            .update({
              splitPaymentPlan: {
                antiFraud: {
                  amount: 0,
                  percentage: percentAntifraud,
                },
                markup: {
                  amount: 0,
                  percentage: percentMarkup,
                },
              },
            })
          const updatedMarkup = currencyFormat(markupPercentage).replace('R$', '% ')
          const updatedAntifraud = currencyFormat(antifraudPercentage).replace('R$', '% ')
          setMarkupPercentage('')
          setAntifraudPercentage('')
          setSupplier({ ...supplier, markupPercentage: updatedMarkup, antifraudPercentage: updatedAntifraud })
          setBlocks(mountBlock(supplier.name, supplier.reason, updatedMarkup, updatedAntifraud))
          resolve('Plano atualizado')
        } else throw { msg: 'Valores inválidos, tente novamente', customError: true }
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
