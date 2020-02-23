import { readAndCompressImage } from 'browser-image-resizer'
import { storage } from '../../Firebase/index'

const sendToBackend = files => new Promise(async (resolve, reject) => {
	try {
		console.log(files)
		const [file] = files
		console.log(file)
		const { name } = file
		const [brand,index] = name.split('-')
		const compressed = await readAndCompressImage(file, { quality: 0.65 })
		console.log(compressed)
		const imgRef = storage.child(`${brand}/${brand}-${index}`)
		const result = await imgRef.put(compressed)
		console.log(result)
		resolve('ok')
	} catch (error) {
		console.log(error)
		if (error.response) console.log(error.response)
		reject(error)
	}
})

export default sendToBackend