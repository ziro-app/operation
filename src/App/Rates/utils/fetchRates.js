import { db } from '../../../Firebase'
import { FailureMessage } from './promptMessages'
import getDataFees from './getDataFees'
import planName from './planName'

const fetch = async (sellerId, setLoading, setError, setDataRows, brands, setMessage, setActivePlan) => {
  try {
    console.log('sellerId', sellerId)
    setLoading(true)
    db.collection('suppliers')
      .doc(sellerId)
      .onSnapshot(doc => {
        if (doc.exists) {
          const data = doc.data().sellerZoopPlan
          if (data && data.activePlan) {
            const { activePlan } = data
            const dataPlan = data[activePlan]
            const arrayDatas = getDataFees(dataPlan, brands, activePlan)
            setActivePlan(planName(activePlan).name)
            setDataRows(arrayDatas)
          } else {
            setError(true)
          }
        }
      })
    setLoading(false)
  } catch (error) {
    setMessage(FailureMessage('Ocorreu um erro inesperado.'))
    setError(true)
    setLoading(false)
  }
}

export default fetch
