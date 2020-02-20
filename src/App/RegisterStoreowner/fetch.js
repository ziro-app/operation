import axios from 'axios'

const fetch = (setIsLoading, setIsError, setStoreowners, setAdvisors, setAffiliates) => {
    const source = axios.CancelToken.source()
    const affiliates = []
    const advisors = []
    const run = async () => {
        const config = {
            method: 'POST',
            url: process.env.SHEET_URL,
            data: {
                apiResource: 'values',
                apiMethod: 'get',
                spreadsheetId: process.env.SHEET_ID_REFER_LEGACY,
                range: 'Clientes!D:D'
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
                spreadsheetId: '1badoOxsYITqtwq4l_GR9D5o8mWvfLi48HQcqv-7kzpo',
                range: 'Afiliados!B:D'
            },
            headers: {
                'Authorization': process.env.SHEET_TOKEN,
                'Content-Type': 'application/json'
            },
            cancelToken: source.token
        }
        const configAdvisor = {
            method: 'POST',
            url: process.env.SHEET_URL,
            data: {
                apiResource: 'values',
                apiMethod: 'get',
                spreadsheetId: '1msOk_Q_0RJXR4iDUuHEFPUELXcZgm02SmpHKsvbe7tc',
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
            listAffiliates.map(affiliate => affiliates.push(Object.assign({}, [affiliate[0], affiliate[1] + ' ' + affiliate[2]])))
            setAffiliates(affiliates)

            const dataAdvisors = await axios(configAdvisor)
            const [, ...listAdvisors] = dataAdvisors.data.values
            listAdvisors.map(advisor => {
                if (advisor[16] === 'Assessoria') advisors.push(advisor[0])
            })
            setAdvisors(advisors)

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