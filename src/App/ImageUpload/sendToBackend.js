import { readAndCompressImage } from 'browser-image-resizer'
import { db, storage } from '../../Firebase/index'
import getMostRecentImage from './getMostRecentImage'

const sendToBackend = (
  setIsSubmitting,
  setIsSubmitted,
  setBrand,
  brand,
  brandsAndTrends,
  pricetag,
  setPriceTag,
  photoPeriod,
  setPhotoPeriod,
) => async files => {
  setIsSubmitting(true)
  const uploadImages = await Promise.all(
    files.map(async file => {
      try {
        if (file.size === 0) throw 'Empty sized image'
        const timestamp = Date.now()
        const compressed = await readAndCompressImage(file, { quality: 0.65 })
        if (brand === 'Bot') {
          const [brandName, index] = file.name.split('-')
          const image = storage.child(`${brandName}/${brandName}-${timestamp}-${index}`)
          const uploadTask = await image.put(compressed)
          const url = await uploadTask.ref.getDownloadURL()
          await db.collection('catalog-images').add({
            brandName,
            url,
            timestamp,
            pricetag,
            photoPeriod,
            bucket: `${Math.floor(Math.random() * (300 - Number.MIN_VALUE))}`, // will be used to fetch random images on front-end
          })
          return [url, timestamp, brandName]
        }
        const image = storage.child(`${brand}/${brand}-${timestamp}-${file.name}`)
        const uploadTask = await image.put(compressed)
        const url = await uploadTask.ref.getDownloadURL()
        await db.collection('catalog-images').add({
          brandName: brand,
          url,
          timestamp,
          pricetag,
          photoPeriod,
          bucket: `${Math.floor(Math.random() * (300 - Number.MIN_VALUE))}`, // will be used to fetch random images on front-end
        })
        return [url, timestamp]
      } catch (error) {
        return error
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
          if (pricetag === 'Sim') {
            await db
              .collection('catalog-brands')
              .doc(brand)
              .set(
                {
                  brand,
                  updatedLoggedThumb: url,
                  updatedAt: timestamp,
                  trends: trends || [],
                },
                { merge: true },
              )
          } else {
            await db
              .collection('catalog-brands')
              .doc(brand)
              .set(
                {
                  brand,
                  updatedThumb: url,
                  updatedLoggedThumb: url,
                  updatedAt: timestamp,
                  trends: trends || [],
                },
                { merge: true },
              )
          }
          return 'ok'
        }),
      )
    } else {
      const [url, timestamp] = getMostRecentImage(uploadImages)
      const [, trends] = brandsAndTrends.filter(([brandName]) => brandName === brand).flat()

      if (pricetag === 'Sim') {
        await db
          .collection('catalog-brands')
          .doc(brand)
          .set(
            {
              brand,
              updatedAt: timestamp,
              updatedLoggedThumb: url,
              trends: trends || [],
            },
            { merge: true },
          )
      } else {
        await db
          .collection('catalog-brands')
          .doc(brand)
          .set(
            {
              brand,
              updatedThumb: url,
              updatedAt: timestamp,
              updatedLoggedThumb: url,
              trends: trends || [],
            },
            { merge: true },
          )
      }
    }
  } catch (error) {
    console.log(error)
  }
  setIsSubmitting(false)
  setIsSubmitted(true)
  setBrand('')
  setPriceTag('')
  setPhotoPeriod('')
}

export default sendToBackend
