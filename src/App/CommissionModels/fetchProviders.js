import axios from 'axios'

const fetch = (state) => {
    const  {setDataProviders, setIsLoading, setError} = state
	const run = async () => {
        const options = {
            'method' : 'GET',
            'url':process.env.URL_PROVIDERS,
            'headers' : {
                'Authorization':process.env.TOKEN_PROVIDERS
            }
        }
        try {
            const result = await axios(options)
            setDataProviders(result.data)
        } catch (error) {
            setError(true)
            console.log(error)
        }
        finally{
            setIsLoading(false)
        }
    }
    run()
}

export default fetch