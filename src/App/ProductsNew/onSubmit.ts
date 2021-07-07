import { fs, db, storage } from '../../Firebase/index'
import { readAndCompressImage } from 'browser-image-resizer'
import clearForm from './clearForm'
import validateImages from './validateImages'
import { stateType, setStateType } from './types'

const onSubmit = async (state: stateType, setState: setStateType) => {
  const { images, title, description, price, discount, reference, colors, sizes, uid, fantasy } = state
  try {
    validateImages(images)
    const now = fs.FieldValue.serverTimestamp()
    const imagesUrls = await Promise.all(
      images.map(async (image: File) => {
        try {
          const compressed = await readAndCompressImage(image, { quality: 0.65 })
          const imageRef = storage.child(`${fantasy}/${fantasy}-${Date.now()}-${image.name}`)
          const uploadTask = await imageRef.put(compressed)
          const url = await uploadTask.ref.getDownloadURL()
          return url
        } catch (error) {
          throw new Error('Não foi possível enviar as imagens do produto')
        }
      }),
    )
    await db
      .collection('suppliers')
      .doc(uid)
      .collection('products')
      .add({
        dateCreated: now,
        dateUpdated: now,
        information: {
          description,
          discount,
          images: imagesUrls,
          price,
          reference,
          title,
        },
        variations: {
          colors,
          sizes,
        },
      })
    /** update suppliers collection with the timestamp of the updated gallery */
    await db.collection('suppliers').doc(uid).update({
      lastGalleryUpdate: now,
    })
    clearForm(setState)
  } catch (error) {
    if (error.response) console.log(error.response)
    console.log(error)
    throw error
  }
}

export default onSubmit
