import { db } from '../../../Firebase/index'

const fetch = (setSellerZoopPlan, setFees, sellerId, selectedPlanForFirebase, fees, setSupplier, setIsLoading) => {
  const run = async () => {
    try {
      setIsLoading(true)
      if (selectedPlanForFirebase !== '' && fees === null) {
        const query = await db.collection('suppliers').doc(sellerId)
        if (!query.empty) {
          await query.onSnapshot(sup => {
            const docId = sup.id
            const { sellerZoopPlan } = sup.data()
            setSupplier(sup.data())
            setSellerZoopPlan(sellerZoopPlan)
            // if (sellerZoopPlan2) {
            const whichPlan = sellerZoopPlan.activePlan
            const selectedPlan = selectedPlanForFirebase || false
            // const sellerZoopPlanObjectForIteration = sellerZoopPlan2[selectedPlan]
            const entries = sellerZoopPlan[selectedPlan] ? Object.entries(sellerZoopPlan[selectedPlan]) : null
            // const entries2 = Object.entries(sellerZoopPlan2[whichPlan])
            setFees(entries)

            // }
          })
        }

        setIsLoading(false)
        /* setErrorLoading(false)
            setIsLoading(false) */
      }
    } catch (error) {
      setIsLoading(false)
      console.log(error)
      /* setErrorLoading(true)
      setIsLoading(false) */
    }
  }
  run()
}

export default fetch
