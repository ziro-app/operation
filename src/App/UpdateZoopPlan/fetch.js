import capitalize from '@ziro/capitalize'
import { db } from '../../Firebase/index'

const fetch = (setIsLoading, setErrorLoading, setSuppliers, setSellerZoopPlan2, setFees, selectedPlan, supplier, suppliers) => {
  const run = async () => {
    /* console.log('selectedPlan', selectedPlan)
    console.log('supplier', supplier)
    console.log('suppliers', suppliers) */
    try {
      let fetchedPlan = {}
      const fantasyList = []
      const suppliersFetch = []
      if (supplier.docId) {
        fetchedPlan = db.collection('suppliers').doc(supplier.docId)
        await fetchedPlan.onSnapshot(sup => {
          if (Object.prototype.hasOwnProperty.call(sup.data(), 'sellerZoopPlan2')) {
            setSellerZoopPlan2(sup.data().sellerZoopPlan2)
            if (selectedPlan) {
              const sellerZoopPlanObjectForIteration = sup.data().sellerZoopPlan2[selectedPlan]
              // console.log('sellerZoopPlanObjectForIteration', sellerZoopPlanObjectForIteration)
              // console.log('sellerZoopPlanObjectForIteration entries', Object.entries(sellerZoopPlanObjectForIteration))
              const feesFiltered = Object.entries(sellerZoopPlanObjectForIteration) // .filter()
              // console.log('feesFiltered', feesFiltered)
              setFees(feesFiltered)
            }
          }
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
