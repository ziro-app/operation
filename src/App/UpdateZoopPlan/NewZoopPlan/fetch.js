import capitalize from '@ziro/capitalize'
import { db } from '../../../Firebase/index'

const fetch = (setIsLoading, setErrorLoading, setSellerZoopPlan2, selectedPlan) => {
  const run = async () => {
    try {
      const query = await db.collection('suppliers').get()
      if (!query.empty) {
        query.forEach(sup => {
          const docId = sup.id
          const { sellerZoopPlan2 } = sup.data()

          sellerZoopPlan2 ? setSellerZoopPlan2(sellerZoopPlan2) : setSellerZoopPlan2(null)
        })
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
