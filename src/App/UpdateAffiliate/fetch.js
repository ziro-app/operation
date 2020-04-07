import axios from 'axios'

const fetch = (setIsLoading, setIsError, setAffiliates, setBrands, setBrandsAndBranches) => {
    const source = axios.CancelToken.source()
    const run = async () => {
        const config = {
            method: 'POST',
            url: process.env.SHEET_URL,
            data: {
                apiResource: 'values',
                apiMethod: 'get',
                spreadsheetId: process.env.SHEET_ID_AFFILIATES,
                range: 'Afiliados!B:I'
            },
            headers: {
                'Authorization': process.env.SHEET_TOKEN,
                'Content-Type': 'application/json'
            },
            cancelToken: source.token
        }
        const configBrands = {
			method: 'POST',
			url: process.env.SHEET_URL,
			data: {
				apiResource: 'values',
				apiMethod: 'get',
				spreadsheetId: process.env.SHEET_ID_REGISTER_GET,
				range: 'Dados!W:AJ'
			},
			headers: {
				'Authorization': process.env.SHEET_TOKEN,
				'Content-Type': 'application/json'
			},
			cancelToken: source.token
		}
        try {
            const dataAffiliates = await axios(config)
            const [, ...listAffiliates] = dataAffiliates.data.values
            setAffiliates(listAffiliates)

            const { data: { values } } = await axios(configBrands)
			const [, ...dataWithoutHeaderRow] = values
			const brands = dataWithoutHeaderRow.map(value => {
				const [brand, ...rest] = value
				return brand
			})
			const branches = dataWithoutHeaderRow.map(value => {
				const [brand, , ...addresses] = value
				let fullAddresses = []
				for (let i = 0; i < addresses.length; i++) {
					if (i % 2 === 0)
						fullAddresses.push(`${brand} - ${addresses[i]}, ${addresses[i + 1]}`)
				}
				return fullAddresses
			}).flat()
			setBrands(['Autônomo', ...brands])
			setBrandsAndBranches(['Autônomo - N/A', ...branches])
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
