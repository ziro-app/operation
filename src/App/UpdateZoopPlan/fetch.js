import capitalize from '@ziro/capitalize'
import { db } from '../../Firebase/index'

const fetch = (setIsLoading, setErrorLoading, setSuppliers, setBlocks, mountBlock, setSellerZoopPlan2, setFees, selectedPlan) => {
  const run = async () => {
    try {
      const fantasyList = []
      const suppliers = []
      const query = await db.collection('suppliers').get()
      if (!query.empty) {
        query.forEach(sup => {
          const docId = sup.id
          const { fantasia, razao, sellerZoopPlan, nome, sobrenome, sellerZoopPlan2 } = sup.data()

          setSellerZoopPlan2(sellerZoopPlan2)
          if (sellerZoopPlan2) {
            const whichPlan = selectedPlan || 'standard'
            const sellerZoopPlanObjectForIteration = sellerZoopPlan2[whichPlan]
            setFees(Object.entries(sellerZoopPlanObjectForIteration))
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
