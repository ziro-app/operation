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
            const { currentZoopFee } = sup.data().main
            setSellerZoopPlan(currentZoopFee)
            const selectedPlan = selectedPlanForFirebase || false
            const entries = currentZoopFee[selectedPlan] ? Object.entries(currentZoopFee[selectedPlan]) : null
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
