import React, { useState, useEffect, useCallback } from 'react'
import { useRoute, useLocation } from 'wouter'
import { db } from '../../Firebase'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import Button from '@bit/vitorbarbosa19.ziro.button'
import Input from '@bit/vitorbarbosa19.ziro.input-text'
import DropDown from '@bit/vitorbarbosa19.ziro.dropdown'
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import RImg from 'react-image'
import { imageStyle, card, content, qtyLabel, qtyContainer } from './styles'
import parsePrice from './parsePrice'
import EditCard from './editCard'
import ObjectAssignDeep from 'object-assign-deep'

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
        <div style={{ display: 'grid', alignItems: 'center', gridGap: '10px' }}>
            <label style={{ padding: '10px', fontSize: '20px' }}>{request.brandName}</label>
            {
                Object.entries(request.products).map(([productId,product]) => (
                    <RImg
                        key={productId}
                        src={product.url}
                        style={{ objectFit: 'cover', width: '100%' }}
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
                            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', boxShadow: card.boxShadow, minHeight: '100px', alignItems: 'center', gridGap: '10px' }}>
                                {children}
                                <div style={{ display: 'grid', padding: '10px', alignContent: 'space-between', height: '100%', boxSizing: 'border-box' }}>
                                    <label>{PTstatus[product.status]}</label>
                                    {
                                        product.status === 'available' &&
                                        <div style={{ display: 'grid', padding: '10px' }}>
                                            <label style={{ fontSize: 13 }}>Disponível:</label>
                                            {
                                                Object.entries(product.availableQuantities).map(([key,value]) => (
                                                    <div key={key} style={{ display: 'grid', gridTemplateColumns: '1fr auto' }}>
                                                        <label style={{ fontSize: 10 }}>{`${key}:`}</label>
                                                        <label style={{ fontSize: 10 }}>{value}</label>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    }
                                    {
                                        product.status === 'closed' &&
                                        <div style={{ display: 'grid', padding: '10px' }}>
                                        <label style={{ fontSize: 13 }}>Pedido:</label>
                                            {
                                                Object.entries(product.requestedQuantities).map(([key,value]) => (
                                                    <div key={key} style={{ display: 'grid', gridTemplateColumns: '1fr auto' }}>
                                                        <label style={{ fontSize: 10 }}>{`${key}:`}</label>
                                                        <label style={{ fontSize: 10 }}>{value}</label>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    }
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr'}}>
                                        <div/>
                                        <Button
                                            type='button'
                                            cta='Editar'
                                            click={() => product.status!=='closed' && setEditing(productId)}
                                            submitting={product.status==='closed'}
                                        />
                                    </div>
                                </div>
                            </div>
                        }
                        loaderContainer={() => null}
                    />
                ))
            }
            {/* <label style={{ padding: '10px', fontSize: '20px' }}>{request.brand}</label>
                {request.products.map(({ image, price, sizes, colors, availableQuantities }, index) => 
                <RImg
                    key={image}
                    src={image}
                    style={imageStyle}
                    container={(children) =>
                        <div style={card}>
                            <label style={{ padding: '0px 10px' }}>{`Peça ${index+1}`}</label>
                            <div style={content}>
                                {children}
                                <div style={{ display: 'grid', alignContent: 'start' }}>
                                    <label style={{ fontSize: 15, padding: '5px 10px' }}>Preço</label>
                                    <Input
                                        placeholder='00,00'
                                        value={price||''}
                                        onChange={({ target: { value }}) => parsePrice(value,setValue,index)}
                                    />
                                    <label style={{ fontSize: 15, padding: '5px 10px' }}>Tamanhos</label>
                                    <Input
                                        placeholder='P,M,G'
                                        value={sizes && sizes.join(',')||''}
                                        onChange={({ target: { value }}) => setValue('sizes', value ? value.split(',') : '', index)}
                                    />
                                    <label style={{ fontSize: 15, padding: '5px 10px' }}>Cores</label>
                                    <Input
                                        placeholder='Azul,Amarelo'
                                        value={colors && colors.join(',')||''}
                                        onChange={({ target: { value }}) => setValue('colors', value ? value.split(',') : '', index)}
                                    />
                                </div>
                            </div>
                            {
                                sizes && colors && 
                                [
                                    <label key='qtyLabel' style={qtyLabel}>Quantidades</label>,
                                    sizes.map((size) => colors.map((color) => size && color ? (
                                        <div key={`${size}-${color}`} style={qtyContainer}>
                                            <label>{size}</label>
                                            <label>{color}</label>
                                            <Input
                                                placeholder='1'
                                                value={availableQuantities&&availableQuantities[`${size}-${color}`]||''}
                                                onChange={({ target: { value }}) => /^[0-9]*$/gm.test(value)&&setQuantity(size,color,value,index)}
                                            />
                                        </div>
                                        ): null))
                                ]
                            }
                        </div>
                    }
                    loaderContainer={() => null}
                />)}
                <Button
                    type='button'
                    cta='Atualizar'
                    click={send}
                /> */}
        </div>
    )
}