import axios from 'axios'

const fetch = (setIsLoading, setIsError, setStoreowner, document) => {
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
                if (storewner[8] === document) {
                    setStoreowner(Object.assign({ 'cadastro': storewner[0] ? storewner[0] : '', 'afiliado': storewner[18] ? storewner[18] : '', 'afiliado_cpf': storewner[19] ? storewner[19] : '', 'lojista': storewner[1] ? storewner[1] : '', 'rg': storewner[4] ? storewner[4] : '', 'cpf': storewner[5] ? storewner[5] : '', 'nascimento': storewner[6] ? storewner[6] : '', 'instagram': storewner[7] ? storewner[7] : '', 'cnpj': storewner[8] ? storewner[8] : '', 'ie': storewner[9] ? storewner[9] : '', 'razao': storewner[10] ? storewner[10] : '', 'fantasia': storewner[11] ? storewner[11] : '', 'endereco': storewner[12] ? storewner[12] : '', 'bairro': storewner[13] ? storewner[13] : '', 'cep': storewner[14] ? storewner[14] : '', 'cidade': storewner[15] ? storewner[15] : '', 'estado': storewner[16] ? storewner[16] : '', 'fone': storewner[17] ? storewner[17] : '', 'email': storewner[3] ? storewner[3] : '', 'assessor': storewner[20] ? storewner[20] : '', 'vendedor': storewner[21] ? storewner[21] : '', 'whats': storewner[2] ? storewner[2] : '', 'entrega': storewner[23] ? storewner[23] : '', 'bairroEntrega': storewner[24] ? storewner[24] : '', 'cepEntrega': storewner[25] ? storewner[25] : '', 'cidadeEntrega': storewner[26] ? storewner[26] : '', 'estadoEntrega': storewner[27] ? storewner[27] : '', 'vinculo': storewner[22] ? storewner[22] : '' }))
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
