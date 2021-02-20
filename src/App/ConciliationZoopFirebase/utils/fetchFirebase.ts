import { db, fs } from '../../../Firebase'
import { FailureMessage } from './promptMessages'

const fetchFirebase = async (setFirebaseData, setLoading, setError, setMessage, setLoadingMore, setFirebaseListId, quantityItems) => {
  //setLoading(true)
  setLoadingMore(true)
  const listTransactions = []
  try {
    const newDate = new Date(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`)
    const last7days = new Date(new Date(newDate).setDate(newDate.getDate() - 10))
    //console.log('entrou',quantityItems)
    var transactions = db.collection('credit-card-payments').limit(quantityItems + 400).orderBy('dateLastUpdate', 'desc')
    transactions.get().then(function (querySnapshot) {
      querySnapshot.forEach(async function (doc) {
        const dataFirebase = doc.data()
        const { id } = doc
        const idFirebaseDocument = id
        const newItem = { ...dataFirebase, id}
        listTransactions.push(newItem)
        setLoading(false)
      })
      setFirebaseData(listTransactions)
      setFirebaseListId(listTransactions.map(element => (element.transactionZoopId ? element.transactionZoopId : null)).filter(element => element))
    })
  } catch (error) {
    setMessage(FailureMessage('Ocorreu um erro inesperado.'))
    setError(true)
    setLoading(false)
  }
}

export default fetchFirebase
