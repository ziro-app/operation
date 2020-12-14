import { db } from '../../../Firebase/index'

const fetch = (setSellerZoopPlan, setFees, sellerId, selectedPlanForFirebase, fees) => {
  const run = async () => {
    try {
      if (selectedPlanForFirebase !== '' && fees === null) {
        const query = await db.collection('suppliers').doc(sellerId)
        if (!query.empty) {
          await query.onSnapshot(sup => {
            const docId = sup.id
            const { sellerZoopPlan } = sup.data()
            setSellerZoopPlan(sellerZoopPlan)
            // if (sellerZoopPlan2) {
            const whichPlan = sellerZoopPlan.activePlan
            const selectedPlan = selectedPlanForFirebase
            const sellerZoopPlanObjectForIteration = sellerZoopPlan[selectedPlan]
            const entries = Object.entries(sellerZoopPlan[selectedPlan])
            const entries2 = Object.entries(sellerZoopPlan[whichPlan])
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
