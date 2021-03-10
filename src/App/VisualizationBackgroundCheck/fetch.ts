//// @ts-nocheck
//const snapRefSuppliers = db.collection('suppliers')
import { db } from '../../Firebase/index'

const fetch = state => {
  const run = () => {
    const { setIsLoading, setError, setSuppliers } = state
    setIsLoading(true)
    const query = db.collection('suppliers').orderBy('fantasia', 'asc')
    try {
      const arraySuppliers = []
       query.onSnapshot(snapshot => {
        snapshot.forEach(doc => {
          if (doc.exists) {
            const { fantasia, backgroundCheckRequestsAvailablePaid, backgroundCheckRequestsAvailable } = doc.data()
            arraySuppliers.push({
              fantasia,
              backgroundCheckRequestsAvailablePaid,
              backgroundCheckRequestsAvailable,
            })
            //console.log(arraySuppliers)
            //setNothing(false)
            setIsLoading(false)
          } else {
            setError(true)
            setIsLoading(false)
          }
        })
        setIsLoading(false)
        setSuppliers(arraySuppliers)
      })
    } catch (error) {
      console.log(error)
      setError(true)
    }
  }
  run()
}

export default fetch
