import axios from 'axios'

const fetch = (setIsLoading, setIsError, setStoreowners) => {
	const source = axios.CancelToken.source()
	const run = async () => {
		const config = {
			method: 'POST',
			url: process.env.SHEET_URL,
			data: {
				apiResource: 'values',
				apiMethod: 'get',
				spreadsheetId: process.env.SHEET_STOREOWNERS_ID,
				range: 'Base!K2:K'
			},
			headers: {
				'Authorization': process.env.SHEET_TOKEN,
				'Content-Type': 'application/json'
			},
			cancelToken: source.token
		}
		try {
			const { data: { values } } = await axios(config)
			const storeowners = values.flat().sort((a,b) => a < b ? -1 : 1)
			setStoreowners(storeowners)
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