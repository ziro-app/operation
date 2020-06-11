import axios from 'axios'

const fetch = (setIsLoading, setIsError, setStoreowners, setBanks, setSuppliers) => {
    const storeowners = []
    const reasonsStoreowners = []
    const banks = []
    const suppliers = []
    const suppliersNames = []
    const source = axios.CancelToken.source()
    const run = async () => {
        const config = {
            method: 'POST',
            url: process.env.SHEET_URL,
            data: {
                apiResource: 'values',
                apiMethod: 'get',
                spreadsheetId: process.env.SHEET_ID_FETCH_LINK,
                range: 'Fetch!A:H'
            },
            headers: {
                'Authorization': process.env.SHEET_TOKEN,
                'Content-Type': 'application/json'
            },
            cancelToken: source.token
        }
        try {
            const data = await axios(config)
            const [, ...list] = data.data.values
            list.map(data => {
                if (data[0]) {
                    let store = Object.assign(Object.assign({ 'razao': data[0] ? data[0] : '', 'duplicate': reasonsStoreowners.includes(data[0]) }))
                    reasonsStoreowners.push(data[0])
                    storeowners.push(store)
                }
                if (data[1]) {
                    let sup = Object.assign(Object.assign({ 'fabricante': data[1] ? data[1] : '', 'duplicate': suppliersNames.includes(data[1]) }))
                    suppliersNames.push(data[1])
                    suppliers.push(sup)
                }
                if (data[7] && data[7].toLowerCase().trim() === 'ok') {
                    let bankData = Object.assign({ 'fabricante': data[1] ? data[1] : '', 'banco': data[2] ? data[2] : '', 'agencia': data[3] ? data[3] : '', 'conta': data[4] ? data[4] : '', razao: data[5] ? data[5] : '', 'cnpj': data[6] ? data[6] : '' })
                    banks.push(bankData)
                }
            })

            setStoreowners(storeowners)
            setBanks(banks)
            setSuppliers(suppliers)
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
