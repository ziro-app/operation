import capitalize from '@ziro/capitalize'
import { db } from '../../Firebase/index'

const fetch = (setIsLoading, setErrorLoading, setSuppliers, setSellerZoopPlan2, setFees, selectedPlan, supplier, suppliers) => {
  const run = async () => {
    try {
      let fetchedPlan = {}
      const fantasyList = []
      const suppliersFetch = []
      const query = await db.collection('suppliers').get()
      if (supplier.docId) {
        fetchedPlan = await db.collection('suppliers').doc(supplier.docId).get()
        if (Object.prototype.hasOwnProperty.call(fetchedPlan.data(), 'sellerZoopPlan2')) {
          setSellerZoopPlan2(fetchedPlan.data().sellerZoopPlan2)
          if (!selectedPlan) selectedPlan = Object.keys(fetchedPlan.data().sellerZoopPlan2)[0]
          const whichPlan = selectedPlan || 'standard'
          const sellerZoopPlanObjectForIteration = fetchedPlan.data().sellerZoopPlan2[whichPlan]
          setFees(Object.entries(sellerZoopPlanObjectForIteration))
        }
      }
      if (!query.empty && suppliers.length === 0) {
        query.forEach(sup => {
          const docId = sup.id
          const { fantasia, razao, sellerZoopPlan, nome, sobrenome, sellerZoopPlan2 } = sup.data()

          if (sellerZoopPlan2 && supplier.id) {
            // const fetchedPlan = db.collection('suppliers').doc(supplier.id).get()
          }
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
