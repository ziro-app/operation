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
import Card from './card'
import SummaryCard from './summaryCard'
import ObjectAssignDeep from 'object-assign-deep'
import { containerWithPadding } from '@ziro/theme'

const PTstatus = {
    'available': 'Aberto',
    'unavailable': 'Indisponível',
    'closed': 'Fechado',
}


export default () => {

    const { storeownerId, cartItemId } = useRoute('/pedidos/:storeownerId/:cartItemId')[1]
    const [fetchingCartItem, setFetchingCartItem] = useState(true)
    const [fetchingStoreownerData, setFetchingStoreownerData] = useState(true)
    const [cartItem, setCartItem] = useState()
    const [storeownerData, setStoreownerData] = useState()

    useEffect(() => {
        const catalogDataObserver = db.collection('catalog-user-data')
        .doc(storeownerId)
        .collection('cart')
        .doc(cartItemId)
        .onSnapshot(snap => {
            const data = snap.data()
            setCartItem(data)
            setFetchingCartItem(false)
        })
        const storeownerObserver = db.collection('storeowners')
        .doc(storeownerId)
        .onSnapshot(snap => {
            const data = snap.data()
            setStoreownerData(data)
            setFetchingStoreownerData(false)
        })
        return () => {
            catalogDataObserver()
            storeownerObserver()
        }
    },[storeownerId, cartItemId])

    if(fetchingCartItem||fetchingStoreownerData) return <Spinner />

    if(!cartItem) throw "REQUEST_NOT_FOUND"

    return (
        <div style={containerWithPadding}>
            <Header type='icon-link' title={`${storeownerData.fname} ${storeownerData.lname}`} navigateTo={`/pedidos/${storeownerId}`} icon='back' />
            <div style={brandCart}>
                <label style={brandName}>{cartItem.brandName}</label>
                {cartItem.productIds.map((productId) => <Card productId={productId} cartProduct={cartItem.products[productId]}/>)}
            </div>
        </div>
    )
}