import axios from 'axios'
import { useEffect, useState } from 'react'

export default () => {

    const [brandsInfos, setBrandsInfos] = useState()
    const [fetchError, setError] = useState()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const source = axios.CancelToken.source()
		const config = {
			method: 'POST',
			url: process.env.SHEET_URL,
			data: {
				apiResource: 'values',
				apiMethod: 'get',
				spreadsheetId: process.env.SHEET_ID_BRANDS,
				range: 'Trends!A1:ZZ'
			},
			headers: {
				'Authorization': process.env.SHEET_TOKEN,
				'Content-Type': 'application/json'
			},
			cancelToken: source.token
        }
        axios(config)
            .then(({ data: { values } }) => {
                const sheetKeys = values.shift()
                const firebaseKeys = sheetKeys.map(sheetKey => {
                    if(sheetKey==='Fabricante') return 'brand'
                    if(sheetKey==='Insta') return 'insta'
                    if(sheetKey==='Faixa de preço') return 'price'
                    if(sheetKey.startsWith('Trend')) return `trends`
                    if(sheetKey.startsWith('Tag')) return `tags`
                    if(sheetKey.startsWith('Estilo')) return `styles`
                    if(sheetKey==='Premium') return 'premium'
                    if(sheetKey==='Mínimo de Peças') return 'minimumItemQty'
                    if(sheetKey==='Frete Grátis') return 'freeShipping'
                    if(sheetKey==='Lançamento') return 'isLaunching'
                    return undefined
                })
                const _brandsInfos = values.map((brandInfos) => brandInfos.reduce((acc,value,index) => {
                    const key = firebaseKeys[index]
                    if(!value||!key||value===''||value==='–') return acc
                    if(firebaseKeys.indexOf(key)!=firebaseKeys.lastIndexOf(key)) {
                        //é um array
                        let newValue = acc[key] ? [...(acc[key]||[]),value] : [value]
                        return { ...acc, [key]: newValue }
                    }
                    return { ...acc, [key]: value }
                },{}))
                setBrandsInfos(_brandsInfos)
            })
            .catch((error) => {
                setError(error)
                console.log({ error })
            })
            .finally(() => setIsLoading(false))
        return () => source.cancel('Canceled fetch request. Component unmounted')
    },[])

    return { brandsInfos, fetchError, isLoading }
}