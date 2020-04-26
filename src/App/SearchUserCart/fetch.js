import { db } from '../../Firebase'

const fetch = setIsLoading => {
	try {
		// return db.collection('catalog-user-data').where('cart','==',true).onSnapshot(snap =>
		// 	snap.forEach(async users => {
		// 		const items = await db.collection('catalog-user-data').doc(users.id).collection('cart').get()
		// 		items.forEach(doc => console.log(doc.data()))
		// 	})
		// )
		// return db.collectionGroup('cart').where('status','==','open')
		const run = async () => {
			const orders = await db.collectionGroup('cart').where('status','==','open').get()
			const customerRefs = []
			orders.forEach(doc => customerRefs.push(doc.ref.parent.parent.id))
			console.log(customerRefs)
			const customers = await Promise.all(customerRefs.map(async ref => {
				const customer = await db.collection('storeowners').doc(ref).get()
				console.log(customer)
				console.log(customer.data())
				return customer.data()
			}))
			console.log(customers)
		}
		run()
	} catch (error) {
		console.log(error)
	} finally {
		setIsLoading(false)
	}	
}

export default fetch

// import axios from 'axios'

// const fetch = (setIsLoading, setIsError, setStoreowners) => {
// 	const source = axios.CancelToken.source()
// 	const run = async () => {
// 		const config = {
// 			method: 'POST',
// 			url: process.env.SHEET_URL,
// 			data: {
// 				apiResource: 'values',
// 				apiMethod: 'get',
// 				spreadsheetId: process.env.SHEET_STOREOWNERS_ID,
// 				range: 'Base!K2:K'
// 			},
// 			headers: {
// 				'Authorization': process.env.SHEET_TOKEN,
// 				'Content-Type': 'application/json'
// 			},
// 			cancelToken: source.token
// 		}
// 		try {
// 			const { data: { values } } = await axios(config)
// 			const storeowners = values.flat().sort((a,b) => a < b ? -1 : 1)
// 			setStoreowners(storeowners)
// 		} catch (error) {
// 			if (error.response) console.log(error.response)
// 			else console.log(error)
// 			setIsError(true)
// 		} finally {
// 			setIsLoading(false)
// 		}
// 	}
// 	run()
// 	return () => source.cancel('Canceled fetch request. Component unmounted')
// }

// export default fetch