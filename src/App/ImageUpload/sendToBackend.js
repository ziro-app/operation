import { readAndCompressImage } from 'browser-image-resizer'
import { storage, db } from '../../Firebase/index'

const sendToBackend = (setIsSubmitting, setIsSubmitted, setBrand, brand) => async files => {
	setIsSubmitting(true)
	const result = await Promise.all(files.map(async file => {
		try {
			if (file.size === 0) throw 'Empty sized image'
			const timestamp = Date.now()
			const compressed = await readAndCompressImage(file, { quality: 0.65 })
			if (brand === 'Bot') {
				const [brandName,index] = file.name.split('-')
				const image = storage.child(`${brandName}/${brandName}-${timestamp}-${index}`)
				const uploadTask = await image.put(compressed)
				const url = await uploadTask.ref.getDownloadURL()
				await db.collection('catalog-images').add({
					brandName,
					url,
					timestamp
				})
				return [brandName,url,timestamp]
			} else {
				const image = storage.child(`${brand}/${brand}-${timestamp}-${file.name}`)
				const uploadTask = await image.put(compressed)
				const url = await uploadTask.ref.getDownloadURL()
				await db.collection('catalog-images').add({
					brand,
					url,
					timestamp
				})
				return [url,timestamp]
			}
		} catch (error) {
			return error
		}
	}))
	console.log(result)
	try {
		await db.collection('catalog-brands').doc(brand).set({
			updatedAt: Date.now()
		})
	} catch (error) {
		console.log(error)
	}
	setIsSubmitting(false)
	setIsSubmitted(true)
	setBrand('')
}

export default sendToBackend