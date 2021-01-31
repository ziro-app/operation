import { db, fs } from '../../../Firebase'
import { FailureMessage } from './promptMessages'
import { useFirestore, useFirestoreCollection } from 'reactfire'

const fetchFirebaseCatalogUserData = async (setLoading, setError, setMessage, setCardIds, setCards, setDataRows) => {
    setLoading(true)
  const cardsNotApproved = []
  try {
    var allCards = fs().collectionGroup('cards').where('status', '==', 'pendingManualApproval')
    await allCards
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(async function (doc) {
          const dataFirebase = doc.data()
          const { id } = doc
          const idParent = doc.ref.parent.parent.id
          const refParent = doc.ref.parent.parent
          const data = await refParent.get()
          const { razao, cnpj } = data.data()
          const allData = await fs().collection('storeowners').doc(idParent).get()
          //console.log('allData.data()',allData.data())
          const {fname, lname} = allData.data()
          const fullName = `${fname} ${lname}`
          const newAntifraudObject = { ...dataFirebase, id, idParent, razao, cnpj, fullName }
          cardsNotApproved.push(newAntifraudObject)

          setDataRows(cardsNotApproved.sort((a, b) => a.added - b.added))
          setCards(cardsNotApproved)
          setLoading(true)
          setLoading(false)
        })

      })
      .finally(() => {setLoading(false)
      })
  } catch (error) {
    setMessage(FailureMessage('Ocorreu um erro inesperado.'))
    setError(true)
    setLoading(false)
  }
}

export default fetchFirebaseCatalogUserData
