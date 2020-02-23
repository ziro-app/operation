import { storage } from '../../Firebase/index'

const sendToBackend = files => new Promise(async (resolve, reject) => {
	try {
		console.log(files)
		const [file] = files
		console.log(file)
		const imgRef = storage.child('screenshot.png')
		const result = await imgRef.put(file)
		console.log(result)
		resolve('ok')
	} catch (error) {
		if (error.response) console.log(error.response)
		reject(error)
	}
})

export default sendToBackend