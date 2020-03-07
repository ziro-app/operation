import axios from 'axios'

const fetch = (setIsLoading, setIsError, setBrands, setBrandsAndTags) => {
	const source = axios.CancelToken.source()
	const run = async () => {
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
		try {
			const { data: { values } } = await axios(config)
			console.log(values)
			const brands = values.map(([name]) => name)
			const brandsAndTags = values.map(([name,insta,...trends]) => [name,trends])
			console.log(brands)
			console.log(brandsAndTags)
			setBrands(['Bot', ...brands])
			setBrandsAndTags(brandsAndTags)
		} catch (error) {
			if (error.response) console.log(error.response)
			else console.log(error)
			setIsError(true)
		} finally {
			setIsLoading(false)
		}
	}
	run()
	return () => source.cancel('Canceled fetch request. Component unmounted')
}

export default fetch