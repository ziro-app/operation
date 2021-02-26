import capitalize from '@ziro/capitalize'
import { db } from '../../../Firebase/index'

const fetch = (setIsLoading, setErrorLoading, setSellerZoopPlan2) => {
  const run = async () => {
    try {
      let sellerZoopPlan = {}
      const fetchedStandardPlan = db.collection('utilities').doc(process.env.DOCUMENT_ID_FOR_UTILITIES_MAIN)
      const doc = await fetchedStandardPlan.get()
      sellerZoopPlan = doc.data().main.standardPlans
      if (!sellerZoopPlan.empty) {
        console.log(sellerZoopPlan)
        sellerZoopPlan ? setSellerZoopPlan2(sellerZoopPlan) : setSellerZoopPlan2(null)
      }
      setErrorLoading(false)
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      setErrorLoading(true)
      setIsLoading(false)
    }
  }
  run()
}

export default fetch
