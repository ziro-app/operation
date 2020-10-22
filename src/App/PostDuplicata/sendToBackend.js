import axios from 'axios'
import currencyFormat from '@ziro/currency-format'
import { storage } from '../../Firebase/index'

const configSheet = (array) => {
    return {
      method:'POST',
      url:process.env.SHEET_URL,
      data:{
        "apiResource": "values",
        "apiMethod": "append",
        "spreadsheetId": process.env.SHEET_ID_FORM_DUPLICATES,
        "range": "Base!A1",
        "resource": {
            "values": [array]
        },
        "valueInputOption": "user_entered"
      },
      headers:{
        'Content-Type': 'application/json',
        Authorization: process.env.SHEET_TOKEN
      }
    }
  }

const sendToBackend = state => () => {
    const {codigoBarra, setCodigoBarra,type, setType, setInputDate, inputDate, duplicateValue, setDuplicateValue, provider, setProvider, setFileDuplicate, duplicate, setDuplicate, isLoading} = state
    return new Promise(async (resolve, reject) => {
        try {
            const timestamp = Date.now();
            if(duplicate.size > 0){
                const image = storage.child(`Duplicataprovider/provider-${provider}-${timestamp}`);
                const uploadTask = await image.put(duplicate);
                const imgUrl = await uploadTask.ref.getDownloadURL();
                const arraySheet = [provider, type, currencyFormat(duplicateValue), inputDate, codigoBarra, imgUrl]
                console.log(arraySheet)
                await axios(configSheet(arraySheet))
                resolve('Boleto adicionado com sucesso !')
                setProvider('')
                setFileDuplicate('')
                setDuplicate('')
                setInputDate('')
                setDuplicateValue('')
                setCodigoBarra('')
                setType('')
            }else{
                reject('Imagem sem tamanho!')
            }
        } catch (error) {
            if (error.customError) reject(error)
            else {
                console.log(error)
                if (error.response) console.log(error.response)
                reject(error)
            }
        }
    })
}

export default sendToBackend
