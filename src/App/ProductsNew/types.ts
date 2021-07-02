import { Dispatch, SetStateAction } from "react"

export type stateType = {
  images: File[]
  description: string
  title: string
  price: string
  discount: string
  reference: string
  colors: string
  sizes: string
  uid: string
  fantasy: string
}

export type setStateType = {
  setImages: Dispatch<SetStateAction<File[]>>
  setTitle: Dispatch<SetStateAction<string>>
  setDescription: Dispatch<SetStateAction<string>>
  setPrice: Dispatch<SetStateAction<string>>
  setDiscount: Dispatch<SetStateAction<string>>
  setReference: Dispatch<SetStateAction<string>>
  setColors: Dispatch<SetStateAction<string>>
  setSizes: Dispatch<SetStateAction<string>>
}
