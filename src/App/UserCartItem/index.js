import React, { useState, useEffect, useCallback } from 'react'
import { useRoute, useLocation } from 'wouter'
import { db } from '../../Firebase'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import Button from '@bit/vitorbarbosa19.ziro.button'
import Input from '@bit/vitorbarbosa19.ziro.input-text'
import RImg from 'react-image'

export default () => {

    const [m,{ userId, requestId }] = useRoute('/pedidos/:userId/:requestId')
    const [l, setLocation] = useLocation()
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
            const oldProducts = old.products;
            oldProducts[index][key] = value;
            return { ...old, products: oldProducts }
        })
    },[])

    const send = useCallback(() => {
        const newRequest = request
        newRequest.products = request.products.map(({ sizes, colors, ...product }) => {
            const newProduct = product
            if(sizes) newProduct.sizes = sizes instanceof Array ? sizes : sizes.split(',')
            if(colors) newProduct.colors = colors instanceof Array ? colors : colors.split(',')
            return newProduct
        })
        newRequest.status = 'waitingCheckout'
        db.collection('catalog-user-data')
        .doc(userId)
        .collection('cart')
        .doc(requestId).set(newRequest)
        .then(() => setLocation(`/pedidos/${userId}`))
        .catch((error) => console.log({ error }))
    },[request])

    if(isQuering) return <Spinner />

    if(!request) throw "REQUEST_NOT_FOUND"

    return (
        <div style={{ display: 'grid', alignItems: 'center', gridGap: '10px' }}>
            <label style={{ padding: '10px', fontSize: '20px' }}>{request.brand}</label>
                {request.products.map(({ image, price, sizes, colors }, index) => 
                <RImg
                    key={image}
                    src={image}
                    style={{ objectFit: 'cover', width: (window.innerWidth-50)/2,height: (window.innerWidth-50)/2  }}
                    container={(children) =>
                        <div
                            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '10px', background: 'white', gridGap: '10px', boxShadow: 'rgba(34, 34, 34, 0.3) 0px 5px 15px -4px' }}
                        >
                            {children}
                            <div style={{ display: 'grid', alignContent: 'start' }}>
                                <label style={{ fontSize: 15, padding: '5px 10px' }}>Preço</label>
                                <Input
                                    placeholder='00,00'
                                    value={price||''}
                                    onChange={({ target: { value }}) => {
                                        let _value = value.replace(',','')
                                        _value = parseInt(_value).toString()
                                        if(/^[0-9]*$/gm.test(_value)) {
                                            const r = _value.substring(0,_value.length-2)||'0'
                                            let c = _value.substring(_value.length-2)
                                            if(c.length==1) c = `0${c}`
                                            setValue('price', `${r},${c}`, index)
                                        }
                                    }}
                                />
                                <label style={{ fontSize: 15, padding: '5px 10px' }}>Tamanhos</label>
                                <Input
                                    placeholder='P,M,G'
                                    value={sizes instanceof Array ? sizes.join(',') : sizes||''}
                                    onChange={({ target: { value }}) => setValue('sizes', value, index)}
                                />
                                <label style={{ fontSize: 15, padding: '5px 10px' }}>Cores</label>
                                <Input
                                    placeholder='Azul,Amarelo'
                                    value={colors instanceof Array ? colors.join(',') : colors||''}
                                    onChange={({ target: { value }}) => setValue('colors', value, index)}
                                />
                            </div>
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