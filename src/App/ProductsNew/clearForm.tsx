import { setStateType } from './types'

const clearForm = (setState: setStateType) => {
  const { setImages, setTitle, setDescription, setPrice, setDiscount, setReference, setColors, setSizes } = setState
  setImages(undefined)
  setTitle('')
  setDescription('')
  setPrice('')
  setDiscount('')
  setReference('')
  setColors('')
  setSizes('')
}

export default clearForm
