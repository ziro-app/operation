import { db } from '../../Firebase'

const sendToBackend = state => () => {
    const { razao, setLocation } = state
    return new Promise(async (resolve, reject) => {
        try {
            setSearching(true)
            const snap = await db.collection('storeowners').where('razao','==',razao).get()
            console.log(snap)
            if (!snap.empty) setLocation(`/pedidos/${snap.docs[0].id}`)
            else reject('Nenhum pedido aberto encontrado')
        } catch (error) {
            if (error.customError) reject(error)
            else {
                console.log(error)
                if (error.response) console.log(error.response)
                reject(error)
            }
        } finally {
            setSearching(false)
        }
    })
}

export default sendToBackend
