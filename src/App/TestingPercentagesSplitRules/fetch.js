import capitalize from '@ziro/capitalize'
import { db } from '../../Firebase/index'

function translateFeesToFirebase(text) {
  const d30 = 'financed30'
  const d14 = 'financed14'
  const fluxo = 'standard'
  if (text === 'd+30') return d30
  if (text === 'd+14') return d14
  if (text === 'fluxo') return fluxo
  return 'Taxa sem nome cadastrado'
}

const fetch = (setIsLoading, setErrorLoading, setSuppliers, setSellerZoopPlan2, setFees, selectedPlan, supplier) => {
  const run = async () => {
    try {
      const fantasyList = []
      const suppliers = []
      let fetchedPlan = {}
      const query = await db.collection('suppliers').orderBy('sellerZoopPlan', 'asc').get()

      if (supplier.docId) {
        fetchedPlan = await db.collection('suppliers').doc(supplier.docId).get()
        setSellerZoopPlan2(fetchedPlan.data().sellerZoopPlan)
        if (!selectedPlan) selectedPlan = Object.keys(fetchedPlan.data().sellerZoopPlan)[0]
        const whichPlan = translateFeesToFirebase(selectedPlan) || 'standard'
        const sellerZoopPlanObjectForIteration = fetchedPlan.data().sellerZoopPlan[whichPlan]
        sellerZoopPlanObjectForIteration ? setFees(Object.entries(sellerZoopPlanObjectForIteration)) : null
      }
      if (!query.empty) {
        query.forEach(sup => {
          const docId = sup.id
          const { fantasia, razao, nome, sobrenome, sellerZoopPlan } = sup.data()
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
            sellerZoopPlan: sellerZoopPlan || null,
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
