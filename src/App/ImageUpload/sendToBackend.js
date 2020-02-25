import { readAndCompressImage } from 'browser-image-resizer'
import { storage } from '../../Firebase/index'

const sendToBackend = (setIsSubmitting, setBrand) => async files => {
	setIsSubmitting(true)
	const result = await Promise.all(files.map(async file => {
		try {
			if (file.size === 0) throw 'Empty sized image'
			const [brand,index] = file.name.split('-')
			const compressed = await readAndCompressImage(file, { quality: 0.65 })
			const image = storage.child(`${brand}/${brand}-${Date.now()}-${index}`)
			await image.put(compressed)
			return 'Done'
		} catch (error) {
			return error
		}
	}))
	console.log(result)
	setIsSubmitting(false)
	setBrand('')
}

export default sendToBackend