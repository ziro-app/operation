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
            const { sellerZoopPlan2 } = sup.data()
            setSupplier(sup.data())
            setSellerZoopPlan(sellerZoopPlan2)
            // if (sellerZoopPlan2) {
            const whichPlan = sellerZoopPlan2.activePlan
            const selectedPlan = selectedPlanForFirebase || false
            // const sellerZoopPlanObjectForIteration = sellerZoopPlan2[selectedPlan]
            const entries = sellerZoopPlan2[selectedPlan] ? Object.entries(sellerZoopPlan2[selectedPlan]) : null
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
