import capitalize from '@ziro/capitalize'
import { db } from '../../Firebase/index'

const fetch = (setIsLoading, setErrorLoading, setSuppliers, setSellerZoopPlan2, setFees, selectedPlan, supplier) => {
  const run = async () => {
    try {
      const fantasyList = []
      const suppliers = []
      let fetchedPlan = {}
      const query = await db.collection('suppliers').get()

      if (supplier.docId) {
        fetchedPlan = await db.collection('suppliers').doc(supplier.docId).get()
        console.log('fetchedPlan', fetchedPlan)
        setSellerZoopPlan2(fetchedPlan.data().sellerZoopPlan2)
        console.log('keys', Object.keys(fetchedPlan.data().sellerZoopPlan2)[0])
        console.log('sellerZoopPlan2', fetchedPlan.data().sellerZoopPlan2)
        if (!selectedPlan) selectedPlan = Object.keys(fetchedPlan.data().sellerZoopPlan2)[0]
        const whichPlan = selectedPlan || 'standard'
        const sellerZoopPlanObjectForIteration = fetchedPlan.data().sellerZoopPlan2[whichPlan]
        setFees(Object.entries(sellerZoopPlanObjectForIteration))
      }
      if (!query.empty) {
        query.forEach(sup => {
          const docId = sup.id
          const { fantasia, razao, sellerZoopPlan, nome, sobrenome, sellerZoopPlan2 } = sup.data()
          const name = fantasia
            ? fantasyList.includes(fantasia)
              ? capitalize(`${fantasia} - ${nome}`)
              : capitalize(fantasia)
            : `${nome} ${sobrenome}`
          fantasyList.push(fantasia)
          suppliers.push({
            docId,
            name,
            reason: razao ? capitalize(razao) : '-',
            sellerZoopPlan: sellerZoopPlan2 || null,
          })
        })
      }
      setSuppliers(suppliers)
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
