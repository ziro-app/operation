import { db } from '../../Firebase/index'
import { translateFirebaseToFees } from '../UpdateZoopPlan/functions'

const fetch = state => {
  const allSellersPlans = []
  const { setIsLoading, setErrorLoading, setData, setLocation } = state
  const run = async () => {
    try {
      await db
        .collection('suppliers')
        .where('tipoCadastro', '==', 'Completo')
        .get()
        .then(doc =>
          doc.docs.map(doc => {
            if (doc.exists) {
              const { fantasia, sellerZoopPlan, uid } = doc.data()
              const objForDataTable = {
                title: fantasia.toUpperCase(),
                header: [
                  'Plano Ativo:',
                  typeof sellerZoopPlan !== 'undefined' && sellerZoopPlan && sellerZoopPlan.activePlan
                    ? translateFirebaseToFees(sellerZoopPlan.activePlan)
                    : ['-'],
                ],
                rows: [['Ver tarifas']],
                rowsClicks: [
                  () => {
                    localStorage.setItem('voltar', '/planos-fabricantes')
                    localStorage.setItem('sellerName', fantasia)
                    localStorage.removeItem('selectedPlan')
                    localStorage.removeItem('sellerObject')
                    setLocation(`/atualizar-plano-venda/${uid}`)
                  },
                ],
                totals: [null],
              }
              allSellersPlans.push(objForDataTable)
            } else {
              console.log('No such document!')
            }
          }),
        )
        .catch(function (error) {
          console.log('Error getting document:', error)
          setErrorLoading(true)
          setIsLoading(false)
        })
      const sortedAllSellersPlans = allSellersPlans.sort(function (a, b) {
        const textA = a.title.toUpperCase()
        const textB = b.title.toUpperCase()
        return textA < textB ? -1 : textA > textB ? 1 : 0
      })
      setData(sortedAllSellersPlans)
      setErrorLoading(false)
      setIsLoading(false)
    } catch (error) {
      setErrorLoading(true)
      setIsLoading(false)
    }
  }
  run()
}

export default fetch
