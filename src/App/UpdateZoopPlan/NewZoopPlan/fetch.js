import capitalize from '@ziro/capitalize'
import { db } from '../../../Firebase/index'

const fetch = (setIsLoading, setErrorLoading, setSellerZoopPlan2, selectedPlan, sellerId) => {
  const run = async () => {
    try {
      const supplier = await db.collection('suppliers').doc(sellerId).get()
      if (!supplier.empty) {
        const docId = supplier.id
        const { sellerZoopPlan2 } = supplier.data()
        console.log(sellerZoopPlan2)
        sellerZoopPlan2 ? setSellerZoopPlan2(sellerZoopPlan2) : setSellerZoopPlan2(null)
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
