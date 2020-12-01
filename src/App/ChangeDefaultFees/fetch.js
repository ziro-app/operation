import capitalize from '@ziro/capitalize'
import { db } from '../../Firebase/index'
import { translateFeesToFirebase, translateFirebaseToFees } from './functions'

const fetch = (setIsLoading, setErrorLoading, setSuppliers, setSellerZoopPlan2, setFees, selectedPlan, supplier, suppliers) => {
  const run = async () => {
    try {
      let fetchedPlan = {}
      const fantasyList = []
      const suppliersFetch = []
      fetchedPlan = db.collection('utilities').doc(process.env.DOCUMENT_ID_FOR_UTILITIES_MAIN)
      fetchedPlan.get().then(sup => {
        if (Object.prototype.hasOwnProperty.call(sup.data(), 'main')) {
          setSellerZoopPlan2(sup.data().main.standardPlans)
        }
      })
      const query = db.collection('suppliers').where('tipoCadastro', '==', 'Completo')

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
