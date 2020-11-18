import { db } from '../../../Firebase/index'

const fetch = (setSellerZoopPlan, setFees, selectedPlanForFirebase, fees, setIsLoading) => {
  const run = async () => {
    try {
      setIsLoading(true)
      if (selectedPlanForFirebase !== '' && fees === null) {
        const query = await db.collection('utilities').doc(process.env.DOCUMENT_ID_FOR_UTILITIES_MAIN)
        if (!query.empty) {
          await query.onSnapshot(sup => {
            const docId = sup.id
            const { standardPlans } = sup.data().main
            setSellerZoopPlan(standardPlans)
            const selectedPlan = selectedPlanForFirebase || false
            const entries = standardPlans[selectedPlan] ? Object.entries(standardPlans[selectedPlan]) : null
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
