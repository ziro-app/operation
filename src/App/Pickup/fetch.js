import axios from 'axios'

const fetch = (state) => {
    const {setIsLoading, setData, setProviders} = state
	const run = async () => {
        const configGetSheet = {
            method:'POST',
            url:process.env.SHEET_URL,
            data: {
              "apiResource": "values",
              "apiMethod": "batchGet",
              "spreadsheetId": process.env.SHEET_ID_REGISTER_GET,
              "ranges": ["'Dados'!K:AJ"]
              },
            headers:{
              'Content-Type': 'application/json',
              Authorization: process.env.SHEET_TOKEN
            }
          }
        try {
            const result = await axios(configGetSheet)
            const data = result.data.valueRanges[0].values
            setData(data)
            const arrayProviders = data.map(row => row[12]).filter((item, index) => index !== 0 && item)
            setProviders([...arrayProviders, 'Pertence do cliente'])
        } catch (error) {
            console.log(error)
        }
        finally{
            setIsLoading(false)
        }
    }
    run()
}

export default fetch