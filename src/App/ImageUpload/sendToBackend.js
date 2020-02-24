import { readAndCompressImage } from 'browser-image-resizer'
import { storage } from '../../Firebase/index'

const sendToBackend = setIsSubmitting => files => new Promise(async (resolve, reject) => {
	try {
		console.log(files)
		setIsSubmitting(true)
		const result = await Promise.all(files.map(file =>
			new Promise(async (resolve, reject) => {
				try {
					if (file.size === 0) throw 'Empty sized image'
					const [brand,index] = file.name.split('-')
					const compressed = await readAndCompressImage(file, { quality: 0.65 })
					const image = storage.child(`${brand}/${brand}-${Date.now()}-${index}`)
					await image.put(compressed)
					resolve('Done')
				} catch (error) { reject(error) }
			})
		))
		console.log(`${result.length} images uploaded`)
		resolve('ok')
	} catch (error) {
		if (error.response) console.log(error.response)
		reject(error)
	} finally {
		setIsSubmitting(false)
	}
})

export default sendToBackend