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
              const { fantasia, sellerZoopPlan2, uid } = doc.data()
              const objForDataTable = {
                title: fantasia.toUpperCase(),
                header: ['Plano Ativo:'],
                rows: [['Ir para plano de venda']],
                rowsClicks: [
                  () => {
                    localStorage.setItem('voltar', '/planos-fabricantes')
                    localStorage.setItem('sellerName', fantasia)
                    localStorage.removeItem('selectedPlan')
                    localStorage.removeItem('sellerObject')
                    setLocation(`/atualizar-plano-venda/${uid}`)
                  },
                ],
                totals: [
                  typeof sellerZoopPlan2 !== 'undefined' && sellerZoopPlan2 && sellerZoopPlan2.activePlan
                    ? translateFirebaseToFees(sellerZoopPlan2.activePlan)
                    : ['-'],
                ],
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
      setData(allSellersPlans)
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
