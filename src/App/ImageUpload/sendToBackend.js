import { readAndCompressImage } from 'browser-image-resizer'
import { storage } from '../../Firebase/index'

const sendToBackend = (setIsSubmitting, setIsSubmitted, setBrand, brand) => async files => {
	setIsSubmitting(true)
	const result = await Promise.all(files.map(async file => {
		try {
			if (file.size === 0) throw 'Empty sized image'
			const compressed = await readAndCompressImage(file, { quality: 0.65 })
			if (brand === 'Bot') {
				const [brandName,index] = file.name.split('-')
				const image = storage.child(`${brandName}/${brandName}-${Date.now()}-${index}`)
				await image.put(compressed)
			} else {
				const image = storage.child(`${brand}/${brand}-${Date.now()}-${file.name}`)
				await image.put(compressed)
			}
			return 'Done'
		} catch (error) {
			return error
		}
	}))
	console.log(result)
	setIsSubmitting(false)
	setIsSubmitted(true)
	setBrand('')
}

export default sendToBackend