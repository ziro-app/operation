import axios from 'axios'
import { readAndCompressImage } from 'browser-image-resizer'
import { storage } from '../../Firebase/index'
import {dateHourFormatter} from './utils/dateFormatter'

const configSheet = (array) => {
    return {
      method:'POST',
      url:process.env.SHEET_URL,
      data:{
        "apiResource": "values",
        "apiMethod": "append",
        "spreadsheetId": process.env.SHEET_ID_PICKUP,
        "range": "'Retiradas'!A1",
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
    const {setInputDate,setCodPickup,setProvider,setAdress,setBags,setInvoice,setRomaneio,setObservation,setFilename, reseller, codPickup, inputDate, provider, adress,bags, invoice, romaneio, observation} = state
    return new Promise(async (resolve, reject) => {
        try {
            const cadastro = dateHourFormatter(new Date())
            const timestamp = Date.now();
            const conferencia = `${bags} sacola(s)${invoice === 'Sim' ? ', nota fiscal' : ''}`
            console.log(provider)
            if(!romaneio){
              const arrayToSheet = [cadastro, codPickup.split('RL')[1],codPickup, inputDate, reseller, provider, adress, conferencia, observation]
              await axios(configSheet(arrayToSheet))
            }else{
              if (romaneio.size === 0) throw { msg: 'Imagem com tamanho vazio', customError: true };
              const image = storage.child(`Romaneios/atendimento-${codPickup.split('RL')[1]}-${timestamp}`);
              const compressed = await readAndCompressImage(romaneio, { quality: 0.65 });
              const uploadTask = await image.put(compressed);
              const imgUrl = await uploadTask.ref.getDownloadURL();
              const arrayToSheet = [cadastro, codPickup.split('RL')[1],codPickup, inputDate, reseller, provider, adress, conferencia, observation,"", "", "", imgUrl]
              await axios(configSheet(arrayToSheet))
            }
            setInputDate('')
            setCodPickup('')
            setProvider('')
            setAdress('')
            setBags('')
            setInvoice('')
            setRomaneio('')
            setFilename('')
            setObservation('')
            resolve('Boleto adicionado com sucesso !')
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
