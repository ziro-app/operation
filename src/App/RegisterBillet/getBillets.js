import axios from 'axios'

const getBillets = (setIsLoading, setIsError, setBillets) => {
    const source = axios.CancelToken.source()
    const run = async () => {
        const config = {
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
            const billets = await axios(config)
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

export default getBillets
