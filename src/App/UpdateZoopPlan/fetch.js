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
) => {
  const run = async () => {
    /* console.log('selectedPlan', selectedPlan)
    console.log('supplier', supplier)
    console.log('suppliers', suppliers) */
    try {
      let fetchedPlan = {}
      let fetchedStandardPlans = {}
      const fantasyList = []
      const suppliersFetch = []
      if (supplier.docId) {
        fetchedPlan = db.collection('suppliers').doc(supplier.docId)
        fetchedPlan.get().then(sup => {
          if (Object.prototype.hasOwnProperty.call(sup.data(), 'sellerZoopPlan2')) {
            setSellerZoopPlan2(sup.data().sellerZoopPlan2)
            if (selectedPlan) {
              const sellerZoopPlanObjectForIteration = sup.data().sellerZoopPlan2[selectedPlan]
              // console.log('sellerZoopPlanObjectForIteration', sellerZoopPlanObjectForIteration)
              // console.log('sellerZoopPlanObjectForIteration entries', Object.entries(sellerZoopPlanObjectForIteration))

              const feesFiltered = sellerZoopPlanObjectForIteration ? Object.entries(sellerZoopPlanObjectForIteration) : null // .filter()
              // console.log('feesFiltered', feesFiltered)
              setFees(feesFiltered)
            }
          }
        })
        fetchedStandardPlans = db.collection('utilities').doc(process.env.DOCUMENT_ID_FOR_UTILITIES_MAIN)
        fetchedStandardPlans.get().then(currentFee => {
          if (selectedPlan) {
            const sellerZoopPlanObjectForIteration = currentFee.data().main.currentZoopFee[selectedPlan]
            // console.log('sellerZoopPlanObjectForIteration', sellerZoopPlanObjectForIteration)
            // console.log('sellerZoopPlanObjectForIteration entries', Object.entries(sellerZoopPlanObjectForIteration))
            setCurrentZoopFee(sellerZoopPlanObjectForIteration)
            // console.log(currentFee.data().main.currentZoopFee)
          }
          setPlansFromCurrentZoopFee(currentFee.data().main.currentZoopFee)
        })
      }
      const query = db.collection('suppliers').where('tipoCadastro', '==', 'Completo')

      if (!query.empty && suppliers.length === 0) {
        query.onSnapshot(snapshot => {
          snapshot.forEach(sup => {
            const docId = sup.id
            const { fantasia, razao, sellerZoopPlan, nome, sobrenome, sellerZoopPlan2 } = sup.data()
            const name = fantasia
              ? fantasyList.includes(fantasia)
                ? capitalize(`${fantasia} - ${nome}`)
                : capitalize(fantasia)
              : `${nome} ${sobrenome}`
            fantasyList.push(fantasia)
            suppliersFetch.push({
              docId,
              name,
              reason: razao ? capitalize(razao) : '-',
              sellerZoopPlan: sellerZoopPlan2 || null,
            })
          })
          setSuppliers(suppliersFetch)
        }) // até aqui
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
