import React, { useState } from "react"
import { useRoute } from "wouter"
import Form from "../Componentsv2/Form"
import Title from "../Componentsv2/Title"
import { InputFile, InputText, InputMoney, InputPercentage } from "../Componentsv2/Input"
import Button from "../Componentsv2/Button"
import validations from "./validations"
import onSubmit from "./onSubmit"
import { TextSuccess, TextError } from "./Modals"

const ProductsNew = () => {
  const [, params] = useRoute("/produtos/:fantasia/:supplierUid/novo")
  const [images, setImages] = useState<File[]>()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [discount, setDiscount] = useState("")
  const [reference, setReference] = useState("")
  const [colors, setColors] = useState("")
  const [sizes, setSizes] = useState("")
  const uid = params && params.supplierUid
  const fantasy = params && params.fantasia
  const state = { images, title, description, price, discount, reference, colors, sizes, uid, fantasy }
  const setState = { setImages, setTitle, setDescription, setPrice, setDiscount, setReference, setColors, setSizes }
  return (
    <Form
      validations={validations(state)}
      onSubmit={() => onSubmit(state, setState)}
      TextSuccess={<TextSuccess />}
      TextError={<TextError />}
    >
      <Title size="smallMedium">Imagens</Title>
      <InputFile inputName="images" value={images} setValue={setImages} />
      <Title size="smallMedium">Título</Title>
      <InputText inputName="title" value={title} setValue={setTitle} placeholder="Blusa com alça" />
      <Title size="smallMedium">Descrição</Title>
      <InputText inputName="description" value={description} setValue={setDescription} placeholder="Algodão" />
      <Title size="smallMedium">Preço</Title>
      <InputMoney inputName="price" value={price} setValue={setPrice} placeholder="R$100,00" />
      <Title size="smallMedium">Desconto</Title>
      <InputPercentage inputName="discount" value={discount} setValue={setDiscount} placeholder="%5,00" />
      <Title size="smallMedium">Referência</Title>
      <InputText inputName="reference" value={reference} setValue={setReference} placeholder="123ABC" />
      <Title size="smallMedium">Cores</Title>
      <InputText inputName="colors" value={colors} setValue={setColors} placeholder="Amarelo,azul" />
      <Title size="smallMedium">Tamanhos</Title>
      <InputText inputName="sizes" value={sizes} setValue={setSizes} placeholder="P,M,G" />
      <Button type="submit" style={{ marginTop: "5px" }}>
        Enviar produto
      </Button>
    </Form>
  )
}

export default ProductsNew
