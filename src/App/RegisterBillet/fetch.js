import axios from 'axios'

const fetch = (setIsLoading, setIsError, setProviders, setStoreowners, setAdvisors, setAddresses, setBillets) => {
    const source = axios.CancelToken.source()
    const advisors = []
    const storeowners = []
    const providers = []
    const run = async () => {
        const config = {
            method: 'POST',
            url: process.env.SHEET_URL,
            data: {
                apiResource: 'values',
                apiMethod: 'get',
                spreadsheetId: process.env.SHEET_STOREOWNERS_ID,
                range: 'Base'
            },
            headers: {
                'Authorization': process.env.SHEET_TOKEN,
                'Content-Type': 'application/json'
            },
            cancelToken: source.token
        }
        const configProvider = {
            method: 'POST',
            url: process.env.SHEET_URL,
            data: {
                apiResource: 'values',
                apiMethod: 'get',
                spreadsheetId: process.env.SHEET_ID_PROVIDERS,
                range: 'Fornecedores'
            },
            headers: {
                'Authorization': process.env.SHEET_TOKEN,
                'Content-Type': 'application/json'
            },
            cancelToken: source.token
        }
        const configPeople = {
            method: 'POST',
            url: process.env.SHEET_URL,
            data: {
                apiResource: 'values',
                apiMethod: 'get',
                spreadsheetId: process.env.SHEET_ID,
                range: 'Base!D:T'
            },
            headers: {
                'Authorization': process.env.SHEET_TOKEN,
                'Content-Type': 'application/json'
            },
            cancelToken: source.token
        }
        const configBillets = {
            method: 'POST',
            url: process.env.SHEET_URL,
            data: {
                apiResource: 'values',
                apiMethod: 'get',
                spreadsheetId: process.env.SHEET_ID_BILLETS,
                range: 'Boletos!C:C'
            },
            headers: {
                'Authorization': process.env.SHEET_TOKEN,
                'Content-Type': 'application/json'
            },
            cancelToken: source.token
        }
        try {
            const dataStoreowners = await axios(config)
            const [, ...listStoreowners] = dataStoreowners.data.values
            listStoreowners.map(storeowner => storeowner[8] !== ''? storeowners.push(storeowner[8]) : '')
            setStoreowners(storeowners)

            const dataProviders = await axios(configProvider)
            const [, ...listProviders] = dataProviders.data.values
            listProviders.map(provider => {
                providers.push(Object.assign({'nome': provider[0]? provider[0] : '', 'comissao': provider[1]? provider[1].replace(/\s/g, '').replace('%', '') : '', 'endereco': '' }))
            })
            setProviders(providers)
            const addresses = listProviders.map( (supplierInfo) => Object.assign({}, {
                [supplierInfo[0]]: supplierInfo.slice(2).reduce( (fullAddress, value, index, array) => {
                    if (index % 2 === 0 && array[index + 1])
                        fullAddress.push(`${array[index]} — ${array[index + 1]}`)
                    return fullAddress
                }, [])
            }))
            setAddresses(addresses)

            const dataPeople = await axios(configPeople)
            const [, ...listPeople] = dataPeople.data.values
            listPeople.map(person => {
                let endDate = person[15].split('/')
                if (person[16] === 'Assessoria') {
                    if (person[15] === '-') advisors.push(person[0])
                    else if (new Date() < new Date(endDate[1] + '/' + endDate[0] + '/' + endDate[2])) advisors.push(person[0])
                }
            })
            setAdvisors(advisors)

            const billets = await axios(configBillets)
            const [, ...listBillets] = billets.data.values
            setBillets(listBillets.flat())

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
