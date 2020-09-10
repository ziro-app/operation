/* eslint-disable spaced-comment */
/* eslint-disable no-nested-ternary */
import React, { useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import RImg from 'react-image'
import SpinnerWithDiv from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import _ from 'lodash'
import { v4 as uuid } from 'uuid'
import { cartItemFinder, idReducer, parseTotal, rqReducer, statusReducer } from './utils'
import { cartItemProductAdder, cartItemProductSubtracter, updateProductStock } from './transactions'
import { db, fs } from '../../../Firebase'

import Card from '../../CardForm'
import InfoCard from './infoCard'
import SummaryCard from './summaryCard'
import { image } from './styles'
import { inputStateControl } from './functionsUserCartItem'
import inputs from './inputs'
import inputsTest from './inputsTest'
import { userContext } from '../../appContext'

export default ({ productId, cartProduct, setURL, setPrice, buyerStoreownerId, brandName }) => {
  const [identifierOfPicture, setIdentifierOfPicture] = useState(uuid())
  const [productRef] = useState(db.collection('catalog-images').doc(productId))
  const [fetchingProduct, setFetchingProduct] = useState(true)
  const [editing, setEditing] = useState(false)
  const [product, setProduct] = useState({ discount: '' })
  const [oldProduct, setOldProduct] = useState({ discount: '' })
  const [cartProductUpdate, setCartProductUpdate] = useState({ status: 'available', identifierOfPicture })
  const [initialStatus, setInitialStatus] = useState()
  const [sizes, setSizes] = useState([])
  const [colors, setColors] = useState([])
  const [typeSize, setTypeSize] = useState('')
  const [sizesUpdate, setSizesUpdate] = useState([])
  const [colorsUpdate, setColorsUpdate] = useState([])
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState({})
  const { device } = useContext(userContext)
  const defaultQuantityValue = 2
  const [states, dispatch] = useReducer((state, payload) => inputStateControl(state, payload), {})
  const updateCart = true
  console.log('products', products)
  /*console.log('sizes', sizes)
  console.log('colors', colors)
  console.log('storeownerId', storeownerId)*/
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
  useEffect(() => {
    async function test() {
      console.log('productId', productId)
      const cartsWithThisProduct = await db
        .collectionGroup('cart')
        .where('productIds', 'array-contains', productId)
        .where('status', '>', 'closed')
        .get()
      cartsWithThisProduct.docs.forEach(doc => {
        console.log('doc', doc.data())
        setProducts(state => [doc.data().products])
      })
    }
    test()
  }, [])
  const findCartItem = useCallback(cartItemFinder(Object.entries(cart)), [cart])
  const cartRef = useMemo(() => buyerStoreownerId && db.collection('catalog-user-data').doc(buyerStoreownerId).collection('cart'), [buyerStoreownerId])
  const cartIds = useMemo(() => Object.values(cart).reduce(idReducer, []), [cart])
  const cartByStatus = useMemo(() => {
    const { paid, ...restOfCarts } = Object.entries(cart).reduce(statusReducer, {})
    return restOfCarts
  }, [cart])
  useEffect(() => {
    console.log('console de teste', product, oldProduct)
    if (_.isEqual(product, oldProduct)) {
      const productObserver = productRef.onSnapshot(snap => {
        const data = snap.data()
        console.log('data', data)

        const payload = {
          userValue: '',
          identifierOfPicture,
          inputType: 'initial',
        }
        dispatch(payload)
        if (data.availableQuantities) {
          Object.keys(data.availableQuantities).forEach(key => {
            //console.log('key', key)

            const [color, size] = key.split('-')
            //console.log('color, size', color, size)

            if (size) {
              setSizes(old => (old.includes(size) ? old : [...old, size]))
              setSizesUpdate(old => (old.includes(size) ? old : [...old, size]))
            }
            if (color) {
              setColors(old => (old.includes(color) ? old : [...old, color]))
              setColorsUpdate(old => (old.includes(color) ? old : [...old, color]))
            }
          })

          const payload = {
            userValue: {
              availableQuantities: data.availableQuantities,
              colors,
              sizes,
              discount: data.discount,
              price: data.price,
              description: data.description,
            },
            identifierOfPicture,
            inputType: 'fetchedItem',
          }
          dispatch(payload)
          /*const payload = {
          userValue: data.availableQuantities,
          identifierOfPicture,
          inputType: 'availableQuantities',
        }
        dispatch(payload)*/
        }

        console.log('entrou no primeiro')
        //console.log('at end products[0][productId]', products[0][productId])
        if (Object.prototype.hasOwnProperty.call(products[0][productId], 'requestedQuantities')) {
          const { requestedQuantities } = products[0][productId]
          if (requestedQuantities) {
            const newData = Object.assign(data, { requestedQuantities })
            console.log('entrou no segundo')
            console.log('newData', newData)
            setProduct(newData)
          }
          console.log('teste', requestedQuantities)
        } else setProduct(data)
        setPrice(data.price)
        setURL(data.url)

        //setProduct(data => data, { requestedQuantities })
        //setProduct(...data, products[0][productId].requestedQuantities)
        setInitialStatus(data.status)
        setFetchingProduct(false)
        setOldProduct(product)
      })
    }
  }, [products, product, cart])
  console.log('product', product)
  const updateRequestedQuantities = useCallback(
    async (brandName, productId, newRequestedQuantities) => {
      if (!buyerStoreownerId) return
      try {
        const [id] = findCartItem(brandName)
        if (!id) throw 'NO_CART_FOUND'
        await db.runTransaction(async transaction => {
          const cartItemRef = cartRef.doc(id)
          const cartItemSnapshot = await transaction.get(cartItemRef)
          const productRef = db.collection('catalog-images').doc(productId)
          const productSnapshot = await transaction.get(productRef)
          await updateProductStock(productSnapshot, cartItemSnapshot, newRequestedQuantities)(transaction)
        })
        console.log('updated')
      } catch (error) {
        console.log({ error })
      }
    },
    [buyerStoreownerId, findCartItem, cartRef],
  )
  const setRequestedQuantities = useCallback(async (productId, rq) => updateRequestedQuantities(brandName, productId, rq.reduce(rqReducer, {})), [
    brandName,
    updateRequestedQuantities,
  ])

  const update = useCallback(async () => {
    try {
      const cartsWithThisProduct = await db
        .collectionGroup('cart')
        .where('productIds', 'array-contains', productId)
        .where('status', '>', 'closed')
        .get()
      console.log('entrou 1')
      console.log('antes do setState', product)
      console.log('states do card', states)
      console.log('availableQuantities do card', states[`availableQuantities${identifierOfPicture}`])
      await db.runTransaction(async transaction => {
        setProduct(prevState => ({
          product: {
            ...prevState.product,
            availableQuantities: states[`availableQuantities${identifierOfPicture}`]
              ? states[`availableQuantities${identifierOfPicture}`]
              : product.availableQuantities,
            price: states[`price${identifierOfPicture}`] ? states[`price${identifierOfPicture}`] : product.price,
            description: states[`description${identifierOfPicture}`] ? states[`description${identifierOfPicture}`] : product.description,
            referenceId: states[`referenceId${identifierOfPicture}`] ? states[`referenceId${identifierOfPicture}`] : product.referenceId,
            discount: states[`discount${identifierOfPicture}`] ? states[`discount${identifierOfPicture}`] : product.discount,
          },
        }))
        console.log('entrou 2')
        console.log('depois do setState', product)
        if (product.status === 'available' && !Object.keys(product.availableQuantities || {}).length) {
          console.log('entrou 3')
          transaction.update(productRef, { ...product, status: 'waitingStock' })
        } else if (
          product.status === 'available' &&
          Object.values(product.availableQuantities || {}).reduce((acc, cur) => acc + parseInt(cur), 0) === 0
        ) {
          console.log('entrou 4')
          transaction.update(productRef, { ...product, status: 'soldOut' })
        } else if (product.status === 'waitingInfo' || product.status === 'unavailable') {
          console.log('entrou 5')
          transaction.update(productRef, {
            status: product.status,
            price: fs.FieldValue.delete(),
            referenceId: fs.FieldValue.delete(),
            description: fs.FieldValue.delete(),
            availableQuantities: fs.FieldValue.delete(),
          })
        } else {
          console.log('entrou 6')
          transaction.update(productRef, product)
        }
        console.log('entrou 7')
        cartsWithThisProduct.docs.forEach(doc =>
          transaction.set(
            doc.ref,
            {
              products: {
                [productId]: {
                  requestedQuantities: fs.FieldValue.delete(),
                  status: fs.FieldValue.delete(),
                },
              },
              status: 'open',
              total: fs.FieldValue.delete(),
              lastUpdate: fs.FieldValue.serverTimestamp(),
              updatedBy: 'seller',
            },
            { merge: true },
          ),
        )
      })
      console.log('entrou 8')
      setEditing(false)
    } catch (error) {
      console.log({ error })
      throw error
    }
  }, [productRef, product])
  const updateAllCarts = useCallback(async () => {
    try {
      const cartsWithThisProduct = await db
        .collectionGroup('cart')
        .where('productIds', 'array-contains', productId)
        .where('status', '>', 'closed')
        .get()
      await db.runTransaction(async transaction => {
        if (product.status === 'available' && !Object.keys(product.availableQuantities || {}).length)
          transaction.update(productRef, { ...product, status: 'waitingStock' })
        else if (
          product.status === 'available' &&
          Object.values(product.availableQuantities || {}).reduce((acc, cur) => acc + parseInt(cur), 0) === 0
        )
          transaction.update(productRef, { ...product, status: 'soldOut' })
        else if (product.status === 'waitingInfo' || product.status === 'unavailable')
          transaction.update(productRef, {
            status: product.status,
            price: fs.FieldValue.delete(),
            referenceId: fs.FieldValue.delete(),
            description: fs.FieldValue.delete(),
            availableQuantities: fs.FieldValue.delete(),
          })
        else transaction.update(productRef, product)

        cartsWithThisProduct.docs.forEach(doc =>
          transaction.set(
            doc.ref,
            {
              products: {
                [productId]: {
                  requestedQuantities: fs.FieldValue.delete(),
                  status: fs.FieldValue.delete(),
                },
              },
              status: 'open',
              total: fs.FieldValue.delete(),
              lastUpdate: fs.FieldValue.serverTimestamp(),
              updatedBy: 'seller',
            },
            { merge: true },
          ),
        )
      })
      setEditing(false)
    } catch (error) {
      console.log({ error })
      throw error
    }
  }, [productRef, product])

  if (fetchingProduct) return <SpinnerWithDiv />
  return (
    <RImg
      src={product.url}
      style={image}
      container={children =>
        !initialStatus || initialStatus === 'waitingInfo' || editing ? (
          /* <Card
                                    key={index}
                                    identifierOfPicture={picture.identifier}
                                    states={states}
                                    filesList={filesList}
                                    setFiles={setFiles}
                                    index={index}
                                    picture={picture.urlImage}
                                    removeImage={removeImage}
                                    duplicateImage={duplicateImage}
                                    arrayOfInputs={inputs(states, picture.identifier, dispatch, defaultQuantityValue, device, isSubmitting)}
                                    pictures={pictures}
                                    setPictures={setPictures}
                                    dispatch={dispatch}
                                    uuid={uuid}
                                    thumbPhoto={thumbPhoto}
                                    setThumbPhoto={setThumbPhoto}
                                /> */
          <Card
            image={children}
            product={product}
            productRef={productRef}
            setProduct={setProduct}
            setColors={setColors}
            setSizes={setSizes}
            colors={colors}
            sizes={sizes}
            update={update}
            updateCarts={r => setRequestedQuantities(productId, r)}
            typeSize={typeSize}
            setTypeSize={setTypeSize}
            arrayOfInputs={inputsTest(
              {
                product,
                setProduct,
                sizes,
                setSizes,
                colors,
                setColors,
                update,
                defaultQuantityValue,
                device,
                states,
                dispatch,
                identifierOfPicture,
              },
              //updateCart,
            )}
            states={states}
            dispatch={dispatch}
            secondArrayOfInputs={inputs(
              cartProductUpdate,
              setCartProductUpdate,
              sizesUpdate,
              setSizesUpdate,
              colorsUpdate,
              setColorsUpdate,
              updateCart,
              defaultQuantityValue,
              device,
              states,
              dispatch,
              identifierOfPicture,
              updateCart,
            ).filter(
              input =>
                input !== 0 &&
                input !== false &&
                input.props.name !== 'referenceId' &&
                input.props.name !== 'availability' &&
                input.props.name !== 'price' &&
                input.props.name !== 'description',
            )}
            cardInfo
            setEditing={setEditing}
            editing={editing}
          />
        ) : initialStatus === 'unavailable' && cartProduct.status !== 'closed' ? (
          <InfoCard product={{ requestedQuantities: {}, ...product, ...cartProduct }} image={children} setEditing={setEditing} />
        ) : (
          <SummaryCard product={{ requestedQuantities: {}, ...product, ...cartProduct }} image={children} setEditing={setEditing} />
        )
      }
      loaderContainer={() => <SpinnerWithDiv />}
    />
  )
}
