import { useState, useEffect } from 'react'
import { db } from '../../Firebase'

const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState([])
  useEffect(() => {
    const fetch = async () => {
      const _suppliers = []
      const querySnapshot = await db.collection('suppliers').orderBy('fantasia').get()
      querySnapshot.forEach(doc => _suppliers.push(doc.data()))
      setSuppliers(_suppliers)
    }
    fetch()
  }, [])
  return suppliers
}

export default useSuppliers
