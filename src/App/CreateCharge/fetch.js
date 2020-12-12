import axios from 'axios'
import arrayObject from '@ziro/array-object'
import { db } from '../../Firebase'
import getSheet from './utils/getSheet'

const fetch = (setIsLoading, setIsLoadingFunction, setIsError, setStoreowners, setBanks, setSuppliers, paymentTypeReceivable = 'TED') => {
  setIsLoadingFunction(true)
  const storeowners = []
  const reasonsStoreowners = []
  const banks = []
  const suppliers = []
  const suppliersNames = []
  const source = axios.CancelToken.source()
  const run = async () => {
    const requestSheet = await axios(getSheet(['TED!A:F']))
    // console.log('requestSheet.data.valueRanges[0]', requestSheet.data.valueRanges[0])
    const [header, ...data] = requestSheet.data.valueRanges[0].values
    // console.log('header', header)
    // console.log('data[0]', data[0])
    const objectSheet = await arrayObject(requestSheet.data.valueRanges[0])
    // console.log('test', objectSheet)
    let configStoreOwner = {}
    configStoreOwner = {
      method: 'POST',
      url: process.env.SHEET_URL,
      data: {
        apiResource: 'values',
        apiMethod: 'get',
        spreadsheetId: process.env.SHEET_STOREOWNERS_ID,
        range: 'Base!K:K',
      },
      headers: {
        Authorization: process.env.SHEET_TOKEN,
        'Content-Type': 'application/json',
      },
      cancelToken: source.token,
    }
    let config = {}
    config = {
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
    if (paymentTypeReceivable === 'PIX') {
      config = {
        method: 'POST',
        url: process.env.SHEET_URL,
        data: {
          apiResource: 'values',
          apiMethod: 'get',
          spreadsheetId: process.env.SHEET_ID_BANK_DATA,
          range: 'PIX!A:H',
        },
        headers: {
          Authorization: process.env.SHEET_TOKEN,
          'Content-Type': 'application/json',
        },
        cancelToken: source.token,
      }
    }
    const queryStoreowners = db.collection('storeowners')
    const querySuppliers = db.collection('suppliers').where('tipoCadastro', '==', 'Completo')
    try {
      const data = await axios(config)
      const dataStoreowners = await axios(configStoreOwner)
      if (data.data.values) {
        const [, ...list] = data.data.values
        const [, ...listStoreOwners] = dataStoreowners.data.values
        const resultStoreowners = await queryStoreowners.get()
        resultStoreowners.forEach(doc => storeowners.push(doc.data()))
        setStoreowners(storeowners)
        listStoreOwners.map(data => {
          if (data[0]) {
            const store = { razao: data[0] ? data[0] : '', duplicate: reasonsStoreowners.includes(data[0]) }
            reasonsStoreowners.push(data[0])
            storeowners.push(store)
          }
        })
        list.map(data => {
          if (data[0]) {
            const sup = { fabricante: data[0] ? data[0] : '', duplicate: suppliersNames.includes(data[0]) }
            suppliersNames.push(data[0])
            suppliers.push(sup)
          }
          if (data[5]) {
            const bankData = {
              fabricante: data[0] ? data[0] : '',
              banco: data[1] ? data[1] : '',
              agencia: data[2] ? data[2] : '',
              conta: data[3] ? data[3] : '',
              razao: data[4] ? data[4] : '',
              cnpj: data[5] ? data[5] : '',
            }
            banks.push(bankData)
          }
        })

        // setStoreowners(storeowners)
        setBanks(banks)
        setSuppliers(suppliers)
      } else {
        const resultSuppliers = await querySuppliers.get()
        resultSuppliers.forEach(doc => suppliers.push(doc.data()))
        const resultStoreowners = await queryStoreowners.get()
        resultStoreowners.forEach(doc => storeowners.push(doc.data()))
        storeowners.map(item => console.log(item.razao.toLowerCase()))
        suppliers.map(item => console.log(item.fantasia.toLowerCase()))
        setStoreowners(storeowners)
        setSuppliers(suppliers)
      }
    } catch (error) {
      if (error.response) console.log(error.response)
      else console.log(error)
      setIsError(true)
    } finally {
      setIsLoading(false)
      setIsLoadingFunction(false)
    }
  }
  run()
  return () => source.cancel('Canceled fetch request. Component unmounted')
}

export default fetch
