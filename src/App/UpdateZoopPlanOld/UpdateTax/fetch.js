import { db } from '../../../Firebase/index'

const fetch = (setSellerZoopPlan, setFees, sellerId, defaultValues, selectedPlanForFirebase, fees) => {
  const run = async () => {
    try {
      if (selectedPlanForFirebase !== '' && fees === null) {
        const query = await db.collection('suppliers').doc(sellerId)
        if (!query.empty) {
          await query.onSnapshot(sup => {
            const docId = sup.id
            const { sellerZoopPlan2 } = sup.data()
            setSellerZoopPlan(sellerZoopPlan2)
            // if (sellerZoopPlan2) {
            const whichPlan = sellerZoopPlan2.activePlan
            const selectedPlan = selectedPlanForFirebase
            const sellerZoopPlanObjectForIteration = sellerZoopPlan2[selectedPlan]
            const entries = Object.entries(sellerZoopPlan2[selectedPlan])
            const entries2 = Object.entries(sellerZoopPlan2[whichPlan])
            setFees(entries)

            // }
          })
        }
        /* setErrorLoading(false)
            setIsLoading(false) */
      }
    } catch (error) {
      console.log(error)
      /* setErrorLoading(true)
      setIsLoading(false) */
    }
  }
  run()
}

export default fetch
