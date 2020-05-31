import { db } from '../../Firebase/index'

const sendToBackend = state => () => {
    const { nickname, seller, sellerId, charge, maxInstallments, setFantasy, setCharge, setMaxInstallments } = state
    const nome = nickname ? nickname.trim() : ''
    const baseUrl = 'https://ziro.app/transacao?doc='
    return new Promise(async (resolve, reject) => {
        try {
            if (nome === 'Uiller' || nome === 'Vitor') {
                if (seller && sellerId) {
                    const docRef = await db.collection('credit-card-payments').add({
                        dateLinkCreated: new Date(),
                        seller,
                        sellerZoopId: sellerId,
                        charge,
                        maxInstallments,
                        status: 'Aguardando Pagamento'
                    })
                    try {
                        const doc = await docRef.get()
                        if (doc) await navigator.clipboard.writeText(`${baseUrl}${doc.id}`)
                    } catch (error) {
                        throw { msg: 'Erro ao realizar a cópia', copyError: true }
                    }
                    resolve('Link copiado')
                    setFantasy('')
                    setCharge('')
                    setMaxInstallments('')
                } else {
                    throw { msg: 'Vendedor não encontrado', customError: true }
                }
            } else throw { msg: 'Permissão insuficiente', customError: true }
        } catch (error) {
            if (error.copyError) {
                resolve('Link criado')
                setCharge('')
                setMaxInstallments('')
            }
            if (error.customError) reject(error)
            else {
                console.log(error)
                if (error.response) console.log(error.response)
                reject('Erro ao criar cobrança')
            }
        }
    })

}

export default sendToBackend
