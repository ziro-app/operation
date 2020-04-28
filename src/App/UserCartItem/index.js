import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { get } from 'axios'
import { useRoute } from 'wouter'
import { db } from '../../Firebase'
import JSZip from 'jszip'
import Header from '@bit/vitorbarbosa19.ziro.header'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import Button from '@bit/vitorbarbosa19.ziro.button'
import { brandCart, brandName } from './styles'
import Card from './card'
import currencyFormat from '@ziro/currency-format'
import { summary, saleSummary, total, priceTotal } from './styles_catalog'
import { containerWithPadding } from '@ziro/theme'
import { reduceTotal } from './utils'



export default () => {

    const { storeownerId, cartItemId } = useRoute('/pedidos/:storeownerId/:cartItemId')[1]
    const [fetchingCartItem, setFetchingCartItem] = useState(true)
    const [fetchingStoreownerData, setFetchingStoreownerData] = useState(true)
    const [cartItem, setCartItem] = useState({})
    const [storeownerData, setStoreownerData] = useState()
    const [prices, setPrices] = useState({})
    const [urls, setURLs] = useState({})

    const [totalItems, totalPrice] = useMemo(() => (cartItem.productIds && cartItem.products ? cartItem.productIds.reduce(reduceTotal(prices, cartItem.products), [0, 0]) : [0, 0]), [
        cartItem.productIds,
        cartItem.products,
        prices,
      ]);

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

    const confirmCartItem = useCallback(async () => {
        try {
            await db.collection('catalog-user-data')
            .doc(storeownerId)
            .collection('cart')
            .doc(cartItemId)
            .set({ status: 'waitingPayment'},{merge: true })
        }
        catch(error) {
            console.log({ error })
            throw error
        }
    })

    const downloadAllImages = useCallback(async () => {
        const zip = new JSZip()
        const folder = zip.folder(`${storeownerData.fname}_${storeownerData.lname}`)
        await Promise.all(Object.entries(urls).map(([productId,url]) => {
            // return get('https://scontent.faqa1-1.fna.fbcdn.net/v/t1.0-9/51291870_578876865857649_8257876385285013504_n.jpg?_nc_cat=111&_nc_sid=dd9801&_nc_ohc=lLNPOIGXKnEAX-IH33y&_nc_ht=scontent.faqa1-1.fna&oh=cd48bc16df805c3514714f0a495d271c&oe=5ECCDBAC',{ responseType: 'arraybuffer'})
            return get(url,{ responseType: 'arraybuffer' })
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
                        key={productId}
                        productId={productId}
                        cartProduct={cartItem.products[productId]}
                        setPrice={(price)=>setPrices(old => ({ ...old, [productId]: price }))}
                        setURL={(url) => setURLs(old => ({ ...old, [productId]: url }))}
                    />
                )}
                <div style={summary}>
                  <div style={saleSummary}>
                    <label style={total}>Total da compra</label>
                    <label style={priceTotal}>{currencyFormat(totalPrice)}</label>
                  </div>
                  <div style={saleSummary}>
                    <label style={total}>Quantidade</label>
                    <label style={priceTotal}>{totalItems}</label>
                  </div>
                </div>
                {
                    cartItem.status === 'waitingConfirmation' &&
                    <Button
                        type="button"
                        cta={'Confirmar pedido'}
                        click={confirmCartItem}
                        submitting={false}
                    />
                }
            </div>
        </div>
    )
}