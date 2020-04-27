import { db } from '../../Firebase'
import removeDuplicates from '@ziro/remove-duplicates'

const fetch = (setIsLoading, setIsError, setStoreowners) => {
	try {
		return db.collectionGroup('cart').where('status','==','open').onSnapshot(async orders => {
			try {
				const customerRefs = []
				orders.forEach(doc => customerRefs.push(doc.ref.parent.parent.id))
				const dedupedCustomerRefs = removeDuplicates(customerRefs)
				const customers = await Promise.all(dedupedCustomerRefs.map(async ref => {
					const customer = await db.collection('storeowners').doc(ref).get()
					return customer.data()
				}))
				const storeowners = customers && customers.map(customer => customer?.razao).sort((a,b) => a < b ? -1 : 1)
				setStoreowners(storeowners)
			} catch (error) {
				console.log(error)
				setIsError(true)
			}
		})
	} catch (error) {
		console.log(error)
		setIsError(true)
	} finally {
		setIsLoading(false)
	}
}

export default fetch