import axios from 'axios'

const fetch = (setIsLoading, setIsError, setPartAddress, setStoreowner, document) => {
    const source = axios.CancelToken.source()
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
        try {
            const dataStoreowners = await axios(config)
            const [, ...listStoreowners] = dataStoreowners.data.values
            listStoreowners.map(storewner => {
                if(storewner[6] === document) {
                    setStoreowner(Object.assign({ 'cadastro': storewner[0] ? storewner[0] : '', 'afiliado': storewner[17] ? storewner[17] : '', 'afiliado_cpf': storewner[18] ? storewner[18] : '', 'lojista': storewner[1] ? storewner[1] : '', 'rg': storewner[2] ? storewner[2] : '', 'cpf': storewner[3] ? storewner[3] : '', 'nascimento': storewner[4] ? storewner[4] : '', 'insta': storewner[5] ? storewner[5] : '', 'cnpj': storewner[6] ? storewner[6] : '', 'ie': storewner[7] ? storewner[7] : '', 'razao': storewner[8] ? storewner[8] : '', 'fantasia': storewner[9] ? storewner[9] : '', 'endereco': storewner[10] ? storewner[10] : '', 'bairro': storewner[11] ? storewner[11] : '', 'cep': storewner[12] ? storewner[12] : '', 'cidade': storewner[13] ? storewner[13] : '', 'estado': storewner[14] ? storewner[14] : '', 'fone': storewner[15] ? storewner[15] : '', 'email': storewner[16] ? storewner[16] : '', 'assessor': storewner[19] ? storewner[19] : '', 'vendedor': storewner[20] ? storewner[20] : '', 'whats': storewner[21]? storewner[21] : '', 'entrega': storewner[22]? storewner[22] : '', 'cepEntrega': storewner[23]? storewner[23] : '', 'cidadeEntrega': storewner[24]? storewner[24] : '', 'estadoEntrega': storewner[25]? storewner[25] : '' }))
                    if(storewner[22]) setPartAddress(storewner[22].split(', '))
                }
            })

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
