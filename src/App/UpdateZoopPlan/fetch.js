import capitalize from '@ziro/capitalize'
import { db } from '../../Firebase/index'

const fetch = (setIsLoading, setErrorLoading, setSuppliers, setBlocks, mountBlock, setSellerZoopPlan2, setFees, selectedPlan, supplier) => {
  const run = async () => {
    try {
      let fetchedPlan = {}
      const fantasyList = []
      const suppliers = []
      const query = await db.collection('suppliers').get()
      console.log('supplier', supplier)
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

          if (sellerZoopPlan2 && supplier.id) {
            // const fetchedPlan = db.collection('suppliers').doc(supplier.id).get()
          }
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
      setBlocks(mountBlock('', '', '', ''))
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
