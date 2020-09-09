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
    const currentMarkup = parseFloat(supplier.markupPercentage.replace(/[\s\%]/g, ''))
    const currentAntifraud = parseFloat(supplier.antifraudPercentage.replace(/[\s\%]/g, ''))
    const percentMarkup = markupPercentage !== '' ? markupPercentage / 100 : currentMarkup
    const percentAntifraud = antifraudPercentage !== '' ? antifraudPercentage / 100 : currentAntifraud
    const allowedUsers = ['Uiller', 'Vitor', 'Alessandro', 'Wermeson']

    return new Promise(async (resolve, reject) => {
        try {
            if (process.env.HOMOLOG ? true : allowedUsers.includes(nome)) {
                if (markupPercentage || antifraudPercentage) {
                    await db
                        .collection('suppliers')
                        .doc(docId)
                        .update({
                            sellerZoopPlan: {
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
                    const updatedMarkup = currencyFormat(percentMarkup * 100).replace('R$', '% ')
                    const updatedAntifraud = currencyFormat(percentAntifraud * 100).replace('R$', '% ')
                    setMarkupPercentage('')
                    setAntifraudPercentage('')
                    setSupplier({ ...supplier, markupPercentage: updatedMarkup, antifraudPercentage: updatedAntifraud })
                    setBlocks(mountBlock(supplier.name, supplier.reason, updatedMarkup, updatedAntifraud))
                    resolve('Plano atualizado')
                } else throw { msg: 'Atualize ao menos um campo', customError: true }
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
