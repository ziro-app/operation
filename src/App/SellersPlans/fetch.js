import React from 'react'
import { db } from '../../Firebase/index'
import { translateFirebaseToFees } from '../UpdateZoopPlan/functions'

const fetch = state => {
  const { setIsLoading, setErrorLoading, setData, setLocation } = state

  const allSellersPlans = [
    {
        title: 'Planos dos Fabricantes',
        header: ['Fabricante', 'Plano Ativo', 'Tarifas'],
        rows: [],
        totals: [],
        align: ['left', 'center', 'center']
    }
  ]

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

              allSellersPlans[0].rows.push([
                      fantasia,
                      typeof sellerZoopPlan !== 'undefined' && sellerZoopPlan && sellerZoopPlan.activePlan
                        ? translateFirebaseToFees(sellerZoopPlan.activePlan)
                        : ['-'],
                        (<label
                            style={{cursor: 'pointer', fontSize: '1.4rem'}}
                            onClick={
                                () => {
                                    localStorage.setItem('voltar', '/planos-fabricantes')
                                    localStorage.setItem('sellerName', fantasia)
                                    localStorage.removeItem('selectedPlan')
                                    localStorage.removeItem('sellerObject')
                                    setLocation(`/atualizar-plano-venda/${uid}`)
                                }
                            }
                        >
                            Ver
                        </label>)
                    ])
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
      allSellersPlans[0].rows.sort((a, b) => {
        const textA = a[0].toUpperCase()
        const textB = b[0].toUpperCase()
        return textA < textB ? -1 : textA > textB ? 1 : 0
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
