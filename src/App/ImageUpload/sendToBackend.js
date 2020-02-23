import { storage } from '../../Firebase/index'

const sendToBackend = state => () => new Promise(async (resolve, reject) => {
	try {
		const imgRef = storage.child('screenshot.jpg')
		const result = await imgRef.put()
	} catch (error) {
		if (error.response) console.log(error.response)
		reject(error)
	}
})

export default sendToBackend