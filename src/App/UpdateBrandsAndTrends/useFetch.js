import axios from 'axios'
import { useEffect, useState } from 'react'

export default () => {

    const [brandsAndTrends, setBrandsAndTrends] = useState()
    const [fetchError, setError] = useState()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        const source = axios.CancelToken.source()
		const config = {
			method: 'POST',
			url: process.env.SHEET_URL,
			data: {
				apiResource: 'values',
				apiMethod: 'get',
				spreadsheetId: process.env.SHEET_ID_BRANDS,
				range: 'Trends!A2:E'
			},
			headers: {
				'Authorization': process.env.SHEET_TOKEN,
				'Content-Type': 'application/json'
			},
			cancelToken: source.token
        }
        axios(config)
            .then(({ data: { values } }) => {
                const _brandsAndTrends = values.map(([name,insta,...trends]) => [name,trends])
                setBrandsAndTrends(_brandsAndTrends)
            })
            .catch(setError)
            .finally(() => setIsLoading(false))
        return () => source.cancel('Canceled fetch request. Component unmounted')
    },[])

    return { brandsAndTrends, fetchError, isLoading }
}