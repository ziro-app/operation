import { readAndCompressImage } from 'browser-image-resizer'
import { storage, db } from '../../Firebase/index'

const sendToBackend = (setIsSubmitting, setIsSubmitted, setBrand, brand) => async files => {
	setIsSubmitting(true)
	const result = await Promise.all(files.map(async file => {
		try {
			if (file.size === 0) throw 'Empty sized image'
			const compressed = await readAndCompressImage(file, { quality: 0.65 })
			if (brand === 'Bot') {
				const [brandName,index] = file.name.split('-')
				const image = storage.child(`${brandName}/${brandName}-${Date.now()}-${index}`)
				const uploadTask = await image.put(compressed)
				const url = await uploadTask.ref.getDownloadURL()
				await db.collection('catalog-images').add({
					brandName,
					url,
					timestamp: Date.now()
				})
			} else {
				const image = storage.child(`${brand}/${brand}-${Date.now()}-${file.name}`)
				const uploadTask = await image.put(compressed)
				const url = await uploadTask.ref.getDownloadURL()
				await db.collection('catalog-images').add({
					brand,
					url,
					timestamp: Date.now()
				})
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