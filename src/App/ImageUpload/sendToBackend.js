import { readAndCompressImage } from 'browser-image-resizer'
import { storage, db } from '../../Firebase/index'
import getMostRecentImage from './getMostRecentImage'

const sendToBackend = (setIsSubmitting, setIsSubmitted, setBrand, brand) => async files => {
	setIsSubmitting(true)
	const uploadImages = await Promise.all(files.map(async file => {
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
				return [url,timestamp,brandName]
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
	console.log(uploadImages)
	try {
		if (brand === 'Bot') {
			let slicedByBrand = []
			for (let i = 0; i < uploadImages.length; i++) {
				const [url,timestamp,brandName] = uploadImages[i]
				if (slicedByBrand.filter(object => object.brand === brandName).length === 0) {
					slicedByBrand.push({
						brand: brandName,
						images: [[url,timestamp]]
					})
				} else {
					slicedByBrand.filter(object => object.brand === brandName).pop().images.push([url,timestamp])
				}
			}
			const uploadBrands = await Promise.all(slicedByBrand.map(async ({ brand, images }) => {
				const [url,timestamp] = getMostRecentImage(images)
				await db.collection('catalog-brands').doc(brand).set({
					brand,
					updatedThumb: url,
					updatedAt: timestamp,
				})
				return 'ok'
			}))
			console.log(uploadBrands)
		} else {
			const [url,timestamp] = getMostRecentImage(uploadImages)
			await db.collection('catalog-brands').doc(brand).set({
				brand,
				updatedThumb: url,
				updatedAt: timestamp,
			})
		}
	} catch (error) {
		console.log(error)
	}
	setIsSubmitting(false)
	setIsSubmitted(true)
	setBrand('')
}

export default sendToBackend