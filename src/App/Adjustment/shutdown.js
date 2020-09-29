import updateSheet from './utils/updateSheet'
import {db} from '../../Firebase'

const shutdown = async state => {
    const {apelido, inputDate, setApelido, setIsOpen} = state
    const query = db.collection('team').where('apelido', '==', apelido)
    try {
        await updateSheet(process.env.SHEET_ID, 'Base!A:AD','Apelido', apelido, {'Data Fim': inputDate})
        try {
            const result = await query.get()
            const arrayId = []
            result.forEach(doc => arrayId.push(doc.id))
            await db.collection('team').doc(arrayId[0]).update({dataFim:inputDate})
            setIsOpen(false)
            setApelido('')
        } catch (error) {
            console.log('erro no firebase')
            console.log(error)
        }
    } catch (error) {
        console.log('erro no google sheets')
        console.log(error)
    }
}

export default shutdown