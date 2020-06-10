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
                spreadsheetId: process.env.SHEET_STOREOWNERS_ID,
                range: 'Base!K:K'
            },
            headers: {
                'Authorization': process.env.SHEET_TOKEN,
                'Content-Type': 'application/json'
            },
            cancelToken: source.token
        }
        const configBanks = {
            method: 'POST',
            url: process.env.SHEET_URL,
            data: {
                apiResource: 'values',
                apiMethod: 'get',
                spreadsheetId: process.env.SHEET_ID_SUPPLIERS_BANKS,
                range: 'Dados Bancários'
            },
            headers: {
                'Authorization': process.env.SHEET_TOKEN,
                'Content-Type': 'application/json'
            },
            cancelToken: source.token
        }
        const configSuppliers = {
            method: 'POST',
            url: process.env.SHEET_URL,
            data: {
                apiResource: 'values',
                apiMethod: 'get',
                spreadsheetId: process.env.SHEET_ID_SUPPLIERS_BASE,
                range: 'Consulta!A:A'
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
            listStoreowners.map(storeowner => {
                let store = Object.assign(Object.assign({ 'razao': storeowner[0] ? storeowner[0] : '', 'duplicate': reasonsStoreowners.includes(storeowner[0]) }))
                reasonsStoreowners.push(storeowner[0])
                storeowners.push(store)
            })
            setStoreowners(storeowners)

            const dataBanks = await axios(configBanks)
            const [, ...listBanks] = dataBanks.data.values
            listBanks.map(bank => {
                if (bank[6] && (bank[6] === 'ok' || bank[6] === 'Ok')) {
                    let bankData = Object.assign({ 'fabricante': bank[0] ? bank[0] : '', 'banco': bank[1] ? bank[1] : '', 'agencia': bank[2] ? bank[2] : '', 'conta': bank[3] ? bank[3] : '', razao: bank[4] ? bank[4] : '', 'cnpj': bank[5] ? bank[5] : '' })
                    banks.push(bankData)
                }
            })
            setBanks(banks)

            const dataSuppliers = await axios(configSuppliers)
            const [, ...listSuppliers] = dataSuppliers.data.values
            listSuppliers.map(supplier => {
                let sup = Object.assign(Object.assign({ 'fabricante': supplier[0] ? supplier[0] : '', 'duplicate': suppliersNames.includes(supplier[0]) }))
                suppliersNames.push(supplier[0])
                suppliers.push(sup)
            })
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
