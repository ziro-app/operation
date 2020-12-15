import capitalize from '@ziro/capitalize'
import { db } from '../../Firebase/index'

const fetch = (
  setIsLoading,
  setErrorLoading,
  setSuppliers,
  setSellerZoopPlan2,
  setFees,
  selectedPlan,
  supplier,
  suppliers,
  currentZoopFee,
  setCurrentZoopFee,
  setPlansFromCurrentZoopFee,
  sellerId,
) => {
  const run = async () => {
    try {
      let fetchedPlan = {}
      let fetchedStandardPlans = {}
      if (supplier.docId || sellerId) {
        fetchedPlan = db.collection('suppliers').doc(supplier.docId || sellerId)
        fetchedPlan.get().then(sup => {
          if (Object.prototype.hasOwnProperty.call(sup.data(), 'sellerZoopPlan')) {
            setSellerZoopPlan2(sup.data().sellerZoopPlan)
            if (selectedPlan) {
              const sellerZoopPlanObjectForIteration = sup.data().sellerZoopPlan[selectedPlan]

              const feesFiltered = sellerZoopPlanObjectForIteration ? Object.entries(sellerZoopPlanObjectForIteration) : null // .filter()

              setFees(feesFiltered)
            }
          }
        })
        fetchedStandardPlans = db.collection('utilities').doc(process.env.DOCUMENT_ID_FOR_UTILITIES_MAIN)
        fetchedStandardPlans.get().then(currentFee => {
          if (selectedPlan) {
            const sellerZoopPlanObjectForIteration = currentFee.data().main.standardPlans[selectedPlan]
            setCurrentZoopFee(sellerZoopPlanObjectForIteration)
          }
          setPlansFromCurrentZoopFee(currentFee.data().main.standardPlans)
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
