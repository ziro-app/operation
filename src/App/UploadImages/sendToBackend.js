import { readAndCompressImage } from 'browser-image-resizer'
import { db, storage } from '../../Firebase/index'
import { getMostRecentImage } from './functionsUploadImages'

const sendToBackend = async ({
  setIsSubmitting,
  setIsSubmitted,
  setBrand,
  states,
  brand,
  brandsAndTrends,
  filesList,
  setPictures,
  setFiles,
  dispatch,
  thumbPhoto,
  setThumbPhoto,
  priceTag = 'Não',
  setOpenToast,
  setMessageToast,
  setTypeOfToast,
}) => {
  setIsSubmitting(true)
  const uploadImages = await Promise.all(
    filesList.map(async file => {
      try {
        if (file.size === 0) throw 'Empty sized image'
        const timestamp = Date.now()
        //const compressed = await readAndCompressImage(file, { quality: 0.65 })
        if (brand === 'Bot') {
          const [brandName, index] = file.name.split('-')
          const image = storage.child(`${brandName}/${brandName}-${timestamp}-${index}`)
          const uploadTask = await image.put(file)
          const url = await uploadTask.ref.getDownloadURL()
          await db.collection('catalog-images').add({
            brandName,
            url,
            timestamp,
            pricetag: 'Não',
            photoPeriod: 'Nova',
            bucket: `${Math.floor(Math.random() * (20 - Number.MIN_VALUE))}`, // will be used to fetch random images on front-end
          })
          return [url, timestamp, brandName]
        }
        const image = storage.child(`${brand}/${brand}-${timestamp}-${file.name}`)
        const uploadTask = await image.put(file)
        const url = await uploadTask.ref.getDownloadURL()
        await db.collection('catalog-images').add({
          availableQuantities: states[`availableQuantities${file.identifierOfPicture}`]
            ? states[`availableQuantities${file.identifierOfPicture}`]
            : '',
          price: states[`price${file.identifierOfPicture}`] ? states[`price${file.identifierOfPicture}`] : '',
          description: states[`description${file.identifierOfPicture}`] ? states[`description${file.identifierOfPicture}`] : '',
          referenceId: states[`referenceId${file.identifierOfPicture}`] ? states[`referenceId${file.identifierOfPicture}`] : '',
          brandName: brand,
          discount: states[`discount${file.identifierOfPicture}`] ? states[`discount${file.identifierOfPicture}`] : '',
          status: 'available',
          url,
          timestamp,
          pricetag: 'Não',
          photoPeriod: 'Nova',
          bucket: `${Math.floor(Math.random() * (20 - Number.MIN_VALUE))}`, // will be used to fetch random images on front-end
        })
        return [url, timestamp, file.identifierOfPicture]
      } catch (error) {
        console.log(error)
        setIsSubmitting(false)
      }
    }),
  )
  try {
    if (brand === 'Bot') {
      const slicedByBrand = []
      for (let i = 0; i < uploadImages.length; i++) {
        const [url, timestamp, brandName] = uploadImages[i]
        if (slicedByBrand.filter(object => object.brand === brandName).length === 0) {
          slicedByBrand.push({
            brand: brandName,
            images: [[url, timestamp]],
          })
        } else {
          slicedByBrand
            .filter(object => object.brand === brandName)
            .pop()
            .images.push([url, timestamp])
        }
      }
      const uploadBrands = await Promise.all(
        slicedByBrand.map(async ({ brand, images }) => {
          const [url, timestamp] = getMostRecentImage(images)
          const [, trends] = brandsAndTrends.filter(([brandName]) => brandName === brand).flat()
          if (priceTag === 'Sim') {
            await db.collection('catalog-brands').doc(brand).set(
              {
                brand,
                updatedLoggedThumb: url,
                updatedAt: timestamp,
                trends,
              },
              { merge: true },
            )
          } else {
            await db.collection('catalog-brands').doc(brand).set(
              {
                brand,
                updatedThumb: url,
                updatedLoggedThumb: url,
                updatedAt: timestamp,
                trends,
              },
              { merge: true },
            )
          }
          return 'ok'
        }),
      )
    } else {
      const [url, timestamp] = thumbPhoto ? uploadImages.find(([, , uid]) => uid === thumbPhoto.identifierOfPicture) : uploadImages[0]
      if (priceTag === 'Sim') {
        await db.collection('catalog-brands').doc(brand).set(
          {
            brand,
            updatedAt: timestamp,
            updatedLoggedThumb: url,
            trends: [],
          },
          { merge: true },
        )
      } else if (url && timestamp) {
        await db.collection('catalog-brands').doc(brand).set(
          {
            brand,
            updatedThumb: url,
            updatedAt: timestamp,
            updatedLoggedThumb: url,
            trends: [],
          },
          { merge: true },
        )
      }
    }
  } catch (error) {
    console.log(error)
    setIsSubmitting(false)
    setTypeOfToast('warning')
    setMessageToast('Erro no envio das fotos')
    setOpenToast(true)
  }
  setIsSubmitting(false)
  setIsSubmitted(true)
  setBrand('')
  setPictures([])
  setFiles([])
  setThumbPhoto('')
  const payload = { userValue: '', identifierOfPicture: '', inputType: 'clear' }
  dispatch(payload)
  setTypeOfToast('alert')
  setMessageToast('Enviado com sucesso')
  setOpenToast(true)
}

export default sendToBackend
