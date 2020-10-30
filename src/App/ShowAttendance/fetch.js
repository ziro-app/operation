import axios from 'axios'

const fetch = (setIsLoading, setIsError, setStoreowner, atendimento) => {
    const source = axios.CancelToken.source()
    const run = async () => {
        const config = {
            method: 'POST',
            url: process.env.SHEET_URL,
            data: {
                apiResource: 'values',
                apiMethod: 'get',
                spreadsheetId: process.env.SHEET_ID_TRANSITO,
                range: 'Em trânsito'
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
            listStoreowners.map(attendance => {
                if (attendance[0] === atendimento) {
                    setStoreowner({ assessor: attendance[1] || '', lojista:attendance[2] || '', despacho: attendance[3] || '', horario: attendance[4] || '', transporte:attendance[5] || '', endereco:attendance[6] || '', nota:attendance[7] || '', obs: attendance[8] || '', retirados: attendance[11] || '', rastreio: attendance[13] || '', aRetirar: attendance[29], status: (attendance[9] === 'Despachando' ? 'Despachado' : attendance[9]) || ''})
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
