import axios from 'axios'

const configSheet = (array) => {
    return {
      method:'POST',
      url:process.env.SHEET_URL,
      data:{
        "apiResource": "values",
        "apiMethod": "append",
        "spreadsheetId": process.env.SHEET_ID,
        "range": "'Reajustes'!A1",
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

const sendToBackend = async state => {
    const {parcela, modeloParcela, escopo,apelido, inputDate, setError} = state
    try {
        await axios(configSheet(['-',apelido,inputDate,escopo, parcela/100, modeloParcela]))
    } catch (error) {
        console.log(error)
        setError(true)
    }
}

export default sendToBackend