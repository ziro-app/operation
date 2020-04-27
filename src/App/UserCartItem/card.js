import React, { useState, useEffect, useCallback } from 'react'
import RImg from 'react-image'
import { image } from './styles'
import { db, fs } from '../../Firebase'
import SpinnerWithDiv from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import EditCard from './editCard'
import SummaryCard from './summaryCard'
import InfoCard from './infoCard'


export default ({ productId, cartProduct }) => {

    const [productRef] = useState(db.collection('catalog-images').doc(productId))
    const [fetchingProduct, setFetchingProduct] = useState(true)
    const [editing, setEditing] = useState(false)
    const [product, setProduct] = useState({})
    const [initialStatus, setInitialStatus] = useState()
    const [sizes, setSizes] = useState([])
    const [colors, setColors] = useState([])

    useEffect(() => productRef.onSnapshot(snap => {
        const data = snap.data()
        if(data.availableQuantities) {
            Object.keys(data.availableQuantities).forEach((key) => {
                const [size,color] = key.split('-')
                if(size) setSizes(old => old.includes(size) ? old:[...old,size])
                if(color) setColors(old => old.includes(color) ? old:[...old,color])
            })
        }
        setProduct(data)
        setInitialStatus(data.status)
        setFetchingProduct(false)
    }),[])

    const update = useCallback(async () => {
        try {
            if(product.status==='waitingInfo'||product.status==='unavailable') await productRef.update({
                status: product.status,
                price: fs.FieldValue.delete(),
                referenceId: fs.FieldValue.delete(),
                description: fs.FieldValue.delete(),
                availableQuantities: fs.FieldValue.delete(),
            })
            else await productRef.update(product)
            setEditing(false)
        }
        catch(error) {
            console.log({ error })
            throw error
        }
    },[productRef,product])

    if(fetchingProduct) return <SpinnerWithDiv />

    return (
        <RImg
            src={product.url}
            style={image}
            container={
                (children) => 
                    !initialStatus || initialStatus === 'waitingInfo' || editing ?
                    <EditCard
                        image={children}
                        product={product}
                        productRef={productRef}
                        setProduct={setProduct}
                        setColors={setColors}
                        setSizes={setSizes}
                        colors={colors}
                        sizes={sizes}
                        update={update}
                    />
                    :
                    product.status === 'unavailable' ?
                    <InfoCard product={{ requestedQuantities: {}, ...product, ...cartProduct }} image={children} setEditing={setEditing} /> :
                    <SummaryCard product={{ requestedQuantities: {}, ...product, ...cartProduct }} image={children} setEditing={setEditing} />
            }
            loaderContainer={() => <SpinnerWithDiv/>}
        />
    )

}