import axios from 'axios'

const fetch = (setIsLoading, setIsError, setStoreowners, setAdvisors, setAffiliates, setSellers) => {
    const source = axios.CancelToken.source()
    const affiliates = ['NENHUM']
    const advisors = []
    const sellers = ['NENHUM']
    const run = async () => {
        const config = {
            method: 'POST',
            url: process.env.SHEET_URL,
            data: {
                apiResource: 'values',
                apiMethod: 'get',
                spreadsheetId: process.env.SHEET_STOREOWNERS_ID,
                range: 'Base!I:I'
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
                range: 'Afiliados!B:G'
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
        try {
            const dataStoreowners = await axios(config)
            const [, ...listStoreowners] = dataStoreowners.data.values.flat()
            setStoreowners(listStoreowners)

            const dataAffiliates = await axios(configAffiliate)
            const [, ...listAffiliates] = dataAffiliates.data.values
            listAffiliates.map(affiliate => affiliates.push(Object.assign({}, [affiliate[0], affiliate[5] + ' - ' + affiliate[1] + ' ' + affiliate[2]])))
            setAffiliates(affiliates)

            const dataPeople = await axios(configPeople)
            const [, ...listPeople] = dataPeople.data.values
            listPeople.map(person => {
                let endDate = person[15]?.split('/')
                if (person[16] === 'Assessoria') {
                    if (person[15] === '-') advisors.push(person[0])
                    else if (new Date() < new Date(endDate[1] + '/' + endDate[0] + '/' + endDate[2])) advisors.push(person[0])
                }
                if (person[16] === 'Vendas') {
                    if (person[15] === '-') sellers.push(person[0])
                    else if (new Date() < new Date(endDate[1] + '/' + endDate[0] + '/' + endDate[2])) sellers.push(person[0])
                }
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
