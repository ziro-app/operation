import React, { useState, useEffect, useCallback } from 'react'
import { get } from 'axios'
import { useRoute, useLocation } from 'wouter'
import { db } from '../../Firebase'
import JSZip from 'jszip'
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
    const [prices, setPrices] = useState({})
    const [urls, setURLs] = useState({})

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

    const downloadAllImages = useCallback(async () => {
        const zip = new JSZip()
        const folder = zip.folder(`${storeownerData.fname}_${storeownerData.lname}`)
        await Promise.all(Object.entries(urls).map(([productId,url]) => {
            // return get('https://scontent.faqa1-1.fna.fbcdn.net/v/t1.0-9/51291870_578876865857649_8257876385285013504_n.jpg?_nc_cat=111&_nc_sid=dd9801&_nc_ohc=lLNPOIGXKnEAX-IH33y&_nc_ht=scontent.faqa1-1.fna&oh=cd48bc16df805c3514714f0a495d271c&oe=5ECCDBAC',{ responseType: 'arraybuffer'})
            get(url,{ responseType: 'arraybuffer' })
            .then(({ data }) => {
                folder.file(`${cartItem.productIds.indexOf(productId)+1}.png`, new Blob([Buffer.from(data,'binary')]))
            })
        }))
        const content = await zip.generateAsync({ type: 'blob' })
        const url = window.URL.createObjectURL(content);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${storeownerData.fname}_${storeownerData.lname}.zip`); //or any other extension
        document.body.appendChild(link);
        link.click();
    },[urls])

    if(fetchingCartItem||fetchingStoreownerData) return <Spinner />

    if(!cartItem) throw "REQUEST_NOT_FOUND"

    return (
        <div style={containerWithPadding}>
            <Header type='icon-link' title={`${storeownerData.fname} ${storeownerData.lname}`} navigateTo={`/pedidos/${storeownerId}`} icon='back' />
            <div style={brandCart}>
                <label style={brandName}>{cartItem.brandName}</label>
                <Button type='button' cta='Fazer download' click={downloadAllImages}/>
                {cartItem.productIds.map((productId) => 
                    <Card
                        productId={productId}
                        cartProduct={cartItem.products[productId]}
                        setPrice={(price)=>setPrices(old => ({ ...old, [productId]: price }))}
                        setURL={(url) => setURLs(old => ({ ...old, [productId]: url }))}
                    />
                )}
            </div>
        </div>
    )
}