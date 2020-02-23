import { storage } from '../../Firebase/index'

const sendToBackend = files => new Promise(async (resolve, reject) => {
	try {
		console.log(files)
		// const imgRef = storage.child('screenshot.jpg')
		// const result = await imgRef.put()
		resolve('ok')
	} catch (error) {
		if (error.response) console.log(error.response)
		reject(error)
	}
})

export default sendToBackend