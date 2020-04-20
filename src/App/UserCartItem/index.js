import React, { useState, useEffect, useCallback } from 'react'
import { useRoute, useLocation } from 'wouter'
import { db } from '../../Firebase'
import Header from '@bit/vitorbarbosa19.ziro.header'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import Button from '@bit/vitorbarbosa19.ziro.button'
import Input from '@bit/vitorbarbosa19.ziro.input-text'
import DropDown from '@bit/vitorbarbosa19.ziro.dropdown'
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import RImg from 'react-image'
import { brandCart, brandName, cardBlock, image, cardText, icon, orderStatus, order, orderTitle, orderGrid, orderQty, available, button, card, content, qtyLabel, qtyContainer } from './styles'
import parsePrice from './parsePrice'
import EditCard from './editCard'
import ObjectAssignDeep from 'object-assign-deep'
import { containerWithPadding } from '@ziro/theme'

const PTstatus = {
    'available': 'Aberto',
    'unavailable': 'Indisponível',
    'closed': 'Fechado',
}


export default () => {

    const { userId, requestId } = useRoute('/pedidos/:userId/:requestId')[1]
    const [isQuering, setIsQuering] = useState(true)
    const [untouchedRequest, setUntouchedRequest] = useState()
    const [request, setRequest] = useState()
    const [editing, setEditing] = useState()

    useEffect(() => {
        return db.collection('catalog-user-data')
        .doc(userId)
        .collection('cart')
        .doc(requestId)
        .onSnapshot(snap => {
            const data = snap.data()
            data.products = Object.entries(data.products).reduce((prev,[productId,product]) => {
                const newProduct = product
                if(typeof(product.availableQuantities) === 'object') {
                    const sizes = []
                    const colors = []
                    Object.keys(product.availableQuantities).forEach((key) => {
                        const [size,color] = key.split('-')
                        if(size && !sizes.includes(size)) sizes.push(size)
                        if(color && !colors.includes(color)) colors.push(color)
                    })
                    newProduct.sizes = sizes
                    newProduct.colors = colors
                }
                return { ...prev, [productId]: newProduct }
            },{})

            setRequest(ObjectAssignDeep({},data))
            setUntouchedRequest(ObjectAssignDeep({},data))
            setIsQuering(false)
        })
    },[userId, requestId])

    const setValue = useCallback((key, value, productId) => {
        setRequest(old => {
            const products = old.products;
            products[productId][key] = value;
            return { ...old, products }
        })
    },[])

    const setQuantity = useCallback((size, color, qty, productId) => {
        setRequest(old => {
            const products = old.products;
            if(size && color) {
                if(!products[productId]['availableQuantities']) products[productId]['availableQuantities'] = {}
                if(!qty) delete products[productId]['availableQuantities'][`${size}-${color}`]
                else products[productId]['availableQuantities'][`${size}-${color}`] = qty;
                if(!Object.keys(products[productId]['availableQuantities']).length)
                    delete products[productId]['availableQuantities']
            }
            else products[productId]['availableQuantities'] = qty;
            return {...old, products }
        })
    })

    const update = useCallback(async (productId) => {
        const newProduct = Object.assign({},request.products[productId])
        delete newProduct['sizes']
        delete newProduct['colors']
        newProduct.requestedQuantities = {}
        if(newProduct.status === 'closed') newProduct.status = 'available' 
        console.log({ newProduct })
        try {
            await db.collection('catalog-user-data')
            .doc(userId)
            .collection('cart')
            .doc(requestId)
            .set({ products: { ...untouchedRequest.products, [productId]: newProduct } },{ merge: true })
            if(editing===productId) setEditing()
            return 'Atualizado'
        }
        catch(error) {
            console.log({ error })
            throw 'Error'
        }
    },[userId,request,editing])

    if(isQuering) return <Spinner />

    if(!request) throw "REQUEST_NOT_FOUND"

    return (
        <div style={containerWithPadding}>
            <Header type='icon-link' title={userId} navigateTo={`/pedidos/${userId}`} icon='back' />
            <div style={brandCart}>
                <label style={brandName}>{request.brandName}</label>
                {
                    Object.entries(request.products).map(([productId,product]) => (
                        <RImg
                            key={productId}
                            src={product.url}
                            style={image}
                            container={children => 
                                untouchedRequest.products[productId].status === 'waitingInfo' || editing === productId ?
                                <EditCard
                                    image={children}
                                    setValue={setValue}
                                    setQuantity={setQuantity}
                                    update={update}
                                    product={{ ...product, productId }}
                                />
                                :
                                <div style={cardBlock}>
                                    {children}
                                    <div style={cardText}>
                                        <label style={orderStatus(product.status === 'unavailable')}>{PTstatus[product.status]}</label>
                                        {
                                            product.status === 'available' &&
                                            <div style={order}>
                                                <label style={orderTitle}>Disponível</label>
                                                {
                                                    Object.entries(product.availableQuantities).map(([key,value]) => (
                                                        <div key={key} style={orderGrid}>
                                                            <label style={orderQty}>{`${key}:`}</label>
                                                            <label style={orderQty}>{value}</label>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        }
                                        {
                                            product.status === 'closed' &&
                                            <div style={order}>
                                            <label style={orderTitle}>Pedido</label>
                                                {
                                                    Object.keys(product.requestedQuantities).length ?
                                                    Object.entries(product.requestedQuantities).map(([key,value]) => (
                                                        <div key={key} style={orderGrid}>
                                                            <label style={orderQty}>{`${key}:`}</label>
                                                            <label style={orderQty}>{value}</label>
                                                        </div>
                                                    )) : (
                                                        <label style={{ fontSize: 10, color: 'grey' }}>Nenhum pedido</label>
                                                    )
                                                }
                                            </div>
                                        }
                                            {/*<Icon type='pen' size={18} strokeWidth={3} onClick={() => setEditing(productId)} />*/}
                                            <Button style={button} type='button' cta='Editar' click={() => setEditing(productId)} />
                                    </div>
                                </div>
                            }
                            loaderContainer={() => null}
                        />
                    ))
                }
            </div>
        </div>
    )
}