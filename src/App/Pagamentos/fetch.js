import axios from 'axios'
import arrayToObject from '@ziro/array-object'

const toNumeric = (num) => {
  return Number(num.replace('R$ ', '').replace('.', '').replace(',', '.'))
}

const fetch = (state) => {
    const {setIsLoading, setError, setPaymentResume} = state
	const run = async () => {
        const configGetSheet = {
            method:'POST',
            url:process.env.SHEET_URL,
            data: {
              "apiResource": "values",
              "apiMethod": "batchGet",
              "spreadsheetId": process.env.SHEET_ID_PESSOAS,
              "ranges": ["'BaseProviders'!A:E"]
              },
            headers:{
              'Content-Type': 'application/json',
              Authorization: process.env.SHEET_TOKEN
            }
          }
        try {
            const result = await axios(configGetSheet)
            const data = arrayToObject(result.data.valueRanges[0])
            setPaymentResume(data)
          } catch (error) {
            setIsLoading(false)
            setError(true)
            console.log(error)
        }
    }
    run()
}

export default fetch