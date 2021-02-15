import { db, fs } from '../../../Firebase'
import { FailureMessage } from './promptMessages'

const fetchFirebase = async (setFirebaseData, setLoading, setError, setMessage) => {
  setLoading(true)
  const listTransactions = []
  try {
    const newDate = new Date(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`)
    const last7days = new Date(new Date(newDate).setDate(newDate.getDate() - 10))
    var transactions = db.collection('credit-card-payments').where('dateLastUpdate', '>=', last7days).orderBy('dateLastUpdate', 'desc')
    transactions.onSnapshot(function (querySnapshot) {
      querySnapshot.forEach(async function (doc) {
        const dataFirebase = doc.data()
        const { id } = doc
        const idFirebaseDocument = id
        const newItem = { ...dataFirebase, id}
        listTransactions.push(newItem)
        setLoading(false)
      })
      setFirebaseData(listTransactions)
    })
  } catch (error) {
    setMessage(FailureMessage('Ocorreu um erro inesperado.'))
    setError(true)
    setLoading(false)
  }
}

export default fetchFirebase
