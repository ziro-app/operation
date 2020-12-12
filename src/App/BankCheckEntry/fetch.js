import axios from 'axios'
import { db } from '../../Firebase'

const fetch = (setIsLoading, setIsError, setStoreowners, setBanks, setSuppliers) => {
  const storeowners = []
  const reasonsStoreowners = []
  const banks = []
  const suppliers = []
  const suppliersNames = []
  const source = axios.CancelToken.source()
  const run = async () => {
    const configStoreownersBase = {
      method: 'POST',
      url: process.env.SHEET_URL,
      data: {
        apiResource: 'values',
        apiMethod: 'get',
        spreadsheetId: '1stYVHXNZZsVBWcmi5baB3nLtELg-4nCyk_dGLMmlZfc',
        range: 'Base!K:K',
      },
      headers: {
        Authorization: process.env.SHEET_TOKEN,
        'Content-Type': 'application/json',
      },
      cancelToken: source.token,
    }
    const config = {
      method: 'POST',
      url: process.env.SHEET_URL,
      data: {
        apiResource: 'values',
        apiMethod: 'get',
        spreadsheetId: process.env.SHEET_ID_BANK_DATA,
        range: 'TED!A:G',
      },
      headers: {
        Authorization: process.env.SHEET_TOKEN,
        'Content-Type': 'application/json',
      },
      cancelToken: source.token,
    }
    try {
      const data = await axios(config)
      const [, ...list] = data.data.values
      list.map(data => {
        if (data[0]) {
          const sup = { fabricante: data[0] ? data[0] : '', duplicate: suppliersNames.includes(data[0]) }
          suppliersNames.push(data[0])
          suppliers.push(sup)
        }
      })
      const dataStoreowners = await axios(configStoreownersBase)
      const [, ...listStoreowners] = dataStoreowners.data.values
      listStoreowners.map(data => {
        if (data[0]) {
          const store = { razao: data[0] ? data[0] : '', duplicate: reasonsStoreowners.includes(data[0]) }
          reasonsStoreowners.push(data[0])
          storeowners.push(store)
        }
      })

      setStoreowners(storeowners)
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
