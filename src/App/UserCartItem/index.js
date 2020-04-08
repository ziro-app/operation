import React, { useState, useEffect, useCallback } from 'react'
import { useRoute, useLocation } from 'wouter'
import { db } from '../../Firebase'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import Button from '@bit/vitorbarbosa19.ziro.button'
import Input from '@bit/vitorbarbosa19.ziro.input-text'
import RImg from 'react-image'
import { imageStyle, card, content, qtyLabel, qtyContainer } from './styles'
import parsePrice from './parsePrice'

export default () => {

    const { userId, requestId } = useRoute('/pedidos/:userId/:requestId')[1]
    const setLocation = useLocation()[1]
    const [isQuering, setIsQuering] = useState(true)
    const [request, setRequest] = useState()

    useEffect(() => {
        return db.collection('catalog-user-data')
        .doc(userId)
        .collection('cart')
        .doc(requestId)
        .onSnapshot(snap => {
            const data = snap.data()
            setRequest(data)
            setIsQuering(false)
        })
    },[userId, requestId])

    const setValue = useCallback((key, value, index) => {
        setRequest(old => {
            const products = old.products;
            products[index][key] = value;
            return { ...old, products }
        })
    },[])

    const setQuantity = useCallback((size, color, qty, index) => {
        setRequest(old => {
            const products = old.products;
            if(!products[index]['availableQuantities']) products[index]['availableQuantities'] = {}
            products[index]['availableQuantities'][`${size}-${color}`] = qty;
            return {...old, products }
        })
    })

    const send = useCallback(() => {
        const newRequest = request
        newRequest.products = request.products.map(({ sizes, colors, ...product }) => {
            const newProduct = product
            if(sizes) newProduct.sizes = sizes
            if(colors) newProduct.colors = colors
            return newProduct
        })
        newRequest.status = 'waitingCheckout'
        db.collection('catalog-user-data')
        .doc(userId)
        .collection('cart')
        .doc(requestId).set(newRequest)
        .then(() => setLocation(`/pedidos/${userId}`))
        .catch((error) => console.log({ error }))
    },[userId,request])

    if(isQuering) return <Spinner />

    if(!request) throw "REQUEST_NOT_FOUND"

    return (
        <div style={{ display: 'grid', alignItems: 'center', gridGap: '10px' }}>
            <label style={{ padding: '10px', fontSize: '20px' }}>{request.brand}</label>
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
                />
        </div>
    )
}