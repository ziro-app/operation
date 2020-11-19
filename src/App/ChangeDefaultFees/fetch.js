import capitalize from '@ziro/capitalize'
import { db } from '../../Firebase/index'
import { translateFeesToFirebase, translateFirebaseToFees } from './functions'

const fetch = (setIsLoading, setErrorLoading, setSuppliers, setSellerZoopPlan2, setFees, selectedPlan, supplier, suppliers) => {
  const run = async () => {
    try {
      let fetchedPlan = {}
      const fantasyList = []
      const suppliersFetch = []
      if (supplier.docId) {
        fetchedPlan = db.collection('utilities').doc(process.env.DOCUMENT_ID_FOR_UTILITIES_MAIN)
        fetchedPlan.get().then(sup => {
          if (Object.prototype.hasOwnProperty.call(sup.data(), 'main')) {
            setSellerZoopPlan2(sup.data().main.standardPlans)
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
