/* eslint-disable no-useless-escape */
/* eslint-disable prefer-object-spread */
/* eslint-disable no-else-return */
import React, { useMemo, useState, useCallback, useEffect } from 'react'
import currencyFormat from '@ziro/currency-format'
import maskInput from '@ziro/mask-input'
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import InputText from '@bit/vitorbarbosa19.ziro.input-text'
import DropDown from '@bit/vitorbarbosa19.ziro.dropdown'
import { card } from './styles'
import ToastNotification from '../../ToastNotification'
import { cartItemFinder, idReducer, parseTotal, rqReducer, statusReducer } from './utils'
import EditCardCatalog from './EditCardCatalog'
import { cartItemProductAdder, cartItemProductSubtracter, updateProductStock } from './transactions'
import { useLocation } from 'wouter'
import { db } from '../../../Firebase'

const PTstatus = {
  available: 'Disponível',
  unavailable: 'Indisponível',
  closed: 'Disponível',
  waitingInfo: '',
  soldOut: 'Indisponível',
}

const INstatus = {
  Disponível: 'available',
  Indisponível: 'soldOut',
}

export default ({
  image,
  editing,
  setEditing,
  product,
  setProduct,
  sizes,
  setSizes,
  colors,
  setColors,
  update,
  buyerStoreownerId,
  productId,
  brandName,
}) => {
  const [cart, setCart] = useState({})
  const [openToast, setOpenToast] = useState(false)
  const [typeOfToast, setTypeOfToast] = useState('alert')
  const [messageToast, setMessageToast] = useState('')
  useEffect(() => {
    const cartObserver = db
      .collection('catalog-user-data')
      .doc(buyerStoreownerId)
      .collection('cart')
      .orderBy('added', 'desc')
      .onSnapshot(
        cartSnap => {
          const cart = cartSnap.docs.reduce((prev, cur) => ({ ...prev, [cur.id]: cur.data() }), {})
          setCart(cart)
        },
        cartError => {
          console.log({ cartError })
        },
      )
  }, [])
  const [location, setLocation] = useLocation()
  const cartId = useMemo(() => {
    console.log('location')
    return location.split('/')[2]
  }, [location])
  const findCartItem = useCallback(cartItemFinder(Object.entries(cart)), [cart])
  const cartRef = useMemo(() => buyerStoreownerId && db.collection('catalog-user-data').doc(buyerStoreownerId).collection('cart'), [
    buyerStoreownerId,
  ])
  const updateRequestedQuantities = useCallback(
    async (brandName, productId, newRequestedQuantities) => {
      if (!buyerStoreownerId) return
      try {
        console.log('brandName', brandName)
        //const [id] = findCartItem(brandName);
        console.log(Object.entries(cart))
        if (!cartId) throw 'NO_CART_FOUND'
        await db.runTransaction(async transaction => {
          const cartItemRef = cartRef.doc(cartId)
          const cartItemSnapshot = await transaction.get(cartItemRef)
          const productRef = db.collection('catalog-images').doc(productId)
          const productSnapshot = await transaction.get(productRef)
          await updateProductStock(productSnapshot, cartItemSnapshot, newRequestedQuantities)(transaction)
        })
        console.log('updated')

        setTypeOfToast('success')
        setMessageToast('Enviado com sucesso')
        setOpenToast(true)
        setTimeout(() => setEditing(false), 2000)
      } catch (error) {
        setTypeOfToast('warning')
        setMessageToast('Erro na atualização')
        setOpenToast(true)
        console.log({ error })
      }
    },
    [buyerStoreownerId, findCartItem, cartRef],
  )
  const setRequestedQuantities = useCallback(async (productId, rq) => updateRequestedQuantities(brandName, productId, rq.reduce(rqReducer, {})), [
    brandName,
    updateRequestedQuantities,
  ])
  const availabilityInput = useMemo(
    () => (
      <FormInput
        name="availability"
        label="Disponibilidade"
        input={
          <DropDown
            list={['Disponível', 'Indisponível']}
            value={PTstatus[product.status] || ''}
            onChange={({ target: { value } }) =>
              setProduct(old => ({
                ...old,
                status: INstatus[value] || 'waitingInfo',
              }))
            }
            onChangeKeyboard={element =>
              element &&
              setProduct(old => ({
                ...old,
                status: INstatus[element.value] || 'waitingInfo',
              }))
            }
            placeholder="Está disponível em estoque?"
          />
        }
      />
    ),
    [product.status],
  )

  const priceInput = useMemo(
    () =>
      product.status === 'available' && (
        <FormInput
          name="price"
          label="Preço"
          input={
            <InputText
              value={currencyFormat(product.price || '')}
              onChange={({ target: { value } }) => {
                const toInteger = parseInt(value.replace(/[R$\.,]/g, ''), 10)
                setProduct(old => ({ ...old, price: maskInput(toInteger, '#######', true) }))
              }}
              placeholder="R$ 100,00"
              inputMode="numeric"
            />
          }
        />
      ),
    [product.status, product.price],
  )

  const referenceIdInput = useMemo(
    () =>
      product.status === 'available' && (
        <FormInput
          name="referenceId"
          label="Referência"
          input={
            <InputText
              value={product.referenceId || ''}
              onChange={({ target: { value } }) => setProduct(old => ({ ...old, referenceId: value }))}
              placeholder="Referência da loja"
            />
          }
        />
      ),
    [product.status, product.referenceId],
  )

  const descriptionInput = useMemo(
    () =>
      product.status === 'available' && (
        <FormInput
          name="description"
          label="Descrição"
          input={
            <InputText
              value={product.description || ''}
              onChange={({ target: { value } }) => setProduct(old => ({ ...old, description: value }))}
              placeholder="Descrição"
            />
          }
        />
      ),
    [product.status, product.description],
  )

  const sizesInput = useMemo(
    () =>
      product.status === 'available' && (
        <FormInput
          name="sizes"
          label="Tamanhos"
          input={
            <InputText
              placeholder="P,M,G"
              value={(sizes && sizes.join(',')) || ''}
              onChange={({ target: { value } }) => setSizes(value ? value.split(',') : '')}
            />
          }
        />
      ),
    [product.status, sizes],
  )

  const colorsInput = useMemo(
    () =>
      product.status === 'available' && (
        <FormInput
          name="colors"
          label="Cores"
          input={
            <InputText
              placeholder="Azul,Amarelo"
              value={(colors && colors.join(',')) || ''}
              onChange={({ target: { value } }) => {
                const newColors = value.split(',')
                setProduct(old => {
                  const newQuantities = Object.entries(old.availableQuantities || {}).reduce((prev, [key, value]) => {
                    if (newColors.some(color => key.endsWith(color))) return { ...prev, [key]: value }
                    else return prev
                  }, {})
                  return { ...old, availableQuantities: newQuantities }
                })
                setColors(value ? newColors : '')
              }}
            />
          }
        />
      ),
    [product.status, colors],
  )

  const quantitiesInput = useMemo(
    () =>
      product.status === 'available' &&
      sizes.length && (
        <FormInput
          name="quantities"
          label="Quantidades"
          input={
            <div style={{ display: 'grid', gridGap: '10px', padding: '10px' }}>
              {sizes.map(size =>
                (colors.length ? colors : ['']).map(color => (
                  <div
                    key={`${size}-${color}`}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 2fr 2fr',
                      alignItems: 'center',
                    }}
                  >
                    <label>{size}</label>
                    <label>{color}</label>
                    <InputText
                      placeholder="1"
                      value={(product.availableQuantities && product.availableQuantities[`${size}-${color}`]) || ''}
                      onChange={({ target: { value } }) =>
                        /^[0-9]*$/gm.test(value) &&
                        setProduct(old => {
                          const newQuantities = Object.assign({}, old.availableQuantities || {})
                          newQuantities[`${size}-${color}`] = value
                          return { ...old, availableQuantities: newQuantities }
                        })
                      }
                    />
                  </div>
                )),
              )}
            </div>
          }
        />
      ),
    [product.status, sizes, colors, product.availableQuantities],
  )

  const _inputs = [availabilityInput, priceInput, referenceIdInput, descriptionInput, sizesInput, colorsInput, quantitiesInput]
  const inputs = useMemo(() => _inputs.filter(input => !!input), _inputs)

  const validations = useMemo(
    () => [
      {
        name: 'availability',
        validation: value => value !== 'waitingInfo',
        value: product.status,
        message: 'Campo obrigatório',
      },
      ...(product.status !== 'available'
        ? []
        : [
            {
              name: 'price',
              validation: ([price, totalQty]) => (totalQty > 0 ? !!price : true),
              value: [product.price, Object.values(product.availableQuantities || {}).reduce((acc, prev) => acc + parseInt(prev), 0)],
              message: 'Campo obrigatório',
            },
          ]),
    ],
    [product],
  )
  console.log('product', product)
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', boxShadow: card.boxShadow }}>
      {image}
      <ToastNotification openToastRoot={openToast} setOpenToastRoot={setOpenToast} messageToastRoot={messageToast} type={typeOfToast} />
      <div style={{ padding: '10px 10px 30px' }}>
        <Form buttonName="Atualizar" validations={validations} sendToBackend={update} inputs={inputs} />

        {((!product.status && product.status === 'available') || editing) && (
          <EditCardCatalog product={{ ...product }} update={r => setRequestedQuantities(productId, r)} setEditing={setEditing} />
        )}
      </div>
    </div>
  )
}
