import axios from 'axios'

const fetchProviders = async (state) => {
    const  {setDataProviders, setIsLoading, setError} = state
    const options = {
        'method' : 'GET',
        'url':process.env.URL_PROVIDERS,
        'headers' : {
            'Authorization':process.env.TOKEN_PROVIDERS,
            'Origin':'https://ziro.app'
        }
    }
    try {
        const result = await axios(options)
        setDataProviders(result.data)
    } catch (error) {
        setError(true)
        console.log(error)
    } finally {
        setIsLoading(false)
    }
}

export default fetchProviders