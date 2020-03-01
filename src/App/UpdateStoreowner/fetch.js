import axios from 'axios'

const fetch = (setIsLoading, setIsError, setStoreowners, setAdvisors, setAffiliates, setSellers) => {
    const source = axios.CancelToken.source()
    const affiliates = []
    const advisors = []
    const sellers = []
    const run = async () => {
        const config = {
            method: 'POST',
            url: process.env.SHEET_URL,
            data: {
                apiResource: 'values',
                apiMethod: 'get',
                spreadsheetId: '1x6T_309HUNijByr1B_2Ofi0oFG3USyTAWH66QV-6L-0',
                range: 'Base'
            },
            headers: {
                'Authorization': process.env.SHEET_TOKEN,
                'Content-Type': 'application/json'
            },
            cancelToken: source.token
        }
        const configAffiliate = {
            method: 'POST',
            url: process.env.SHEET_URL,
            data: {
                apiResource: 'values',
                apiMethod: 'get',
                spreadsheetId: process.env.SHEET_ID_AFFILIATES,
                range: 'Afiliados!B:D'
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
                spreadsheetId: process.env.SHEET_ID_PEOPLE,
                range: 'Base!D:T'
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
            setStoreowners(listStoreowners)

            const dataAffiliates = await axios(configAffiliate)
            const [, ...listAffiliates] = dataAffiliates.data.values
            listAffiliates.map(affiliate => affiliates.push(Object.assign({}, [affiliate[0], affiliate[1] + ' ' + affiliate[2]])))
            setAffiliates(affiliates)

            const dataPeople = await axios(configPeople)
            const [, ...listPeople] = dataPeople.data.values
            listPeople.map(person => {
                if (person[16] === 'Assessoria') advisors.push(person[0])
                if (person[16] === 'Vendas') sellers.push(person[0])
            })
            setAdvisors(advisors)
            setSellers(sellers)

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