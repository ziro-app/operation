import { db } from '../../Firebase'

const removeDuplicates = arrayWithDuplicates => {
	return arrayWithDuplicates.reduce((accumulated, current) => {
		if (accumulated.includes(current)) return accumulated
		return [...accumulated, current]
	}, [])
}

const fetch = (setIsLoading, setIsError, setStoreowners) => {
		// return db.collection('catalog-user-data').where('cart','==',true).onSnapshot(snap =>
		// 	snap.forEach(async users => {
		// 		const items = await db.collection('catalog-user-data').doc(users.id).collection('cart').get()
		// 		items.forEach(doc => console.log(doc.data()))
		// 	})
		// )
		// return db.collectionGroup('cart').where('status','==','open')
	const run = async () => {
		try {
			const orders = await db.collectionGroup('cart').where('status','==','open').get()
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
		} finally {
			setIsLoading(false)		
		}
	}
	run()
}

export default fetch