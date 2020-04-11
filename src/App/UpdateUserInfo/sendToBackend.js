import { db } from '../../Firebase/index'
import { post } from 'axios'

const sendToBackend = (uid, column, row, obj, newProp, setIsLoading, setError) => () => {
    let property
    if (Object.keys(obj)[0] === 'altura') property = newProp.replace('.', ',')
    else if (Object.keys(obj)[0] === 'agencia') property = `'${newProp}`
    else property = newProp
    const url = process.env.SHEET_URL
    const body = {
        apiResource: 'values',
        apiMethod: 'update',
        range: `Base!${column}${row}`,
        valueInputOption: 'user_entered',
        spreadsheetId: process.env.SHEET_ID,
        resource: {
            values: [[property]]
        }
    }

    const config = {
        headers: {
            'Content-type': 'application/json',
            'Authorization': process.env.SHEET_TOKEN
        }
    }
    return new Promise(async (resolve, reject) => {
        setIsLoading(true)
        try {
            await post(url, body, config)
            try {
                await db.collection('team').doc(uid).update(obj)
                resolve('Atualizado com sucesso')
            } catch (error) {
                console.log(error)
                if (error.response) console.log(error.response)
                throw 'Erro ao salvar na Firestore'
            }
        } catch (error) {
            if (error.customError) {
                setError(error)
                reject(error)
            }
            else {
                console.log(error)
                if (error.response) console.log(error.response)
                reject(error)
            }
        } finally {
            setIsLoading(false)
        }
    })
}

export default sendToBackend
