import { post } from 'axios'
import { formatDateUTC3 } from '@ziro/format-date-utc3'

const sendToBackend = state => () => {
    const { nickname, category, requiredItems, itemIsOver, setCategory, setRequiredItems, setItemIsOver } = state
    const nome = nickname ? nickname.trim() : ''
    const itens = requiredItems ? requiredItems.trim() : ''

    const url = process.env.SHEET_URL

    const body = {
        apiResource: 'values',
        apiMethod: 'append',
        spreadsheetId: process.env.SHEET_ID_SUPPLIES,
        range: 'Material!A1',
        resource: {
            values: [
                [formatDateUTC3(new Date()), nome, category, itens, itemIsOver]
            ]
        },
        valueInputOption: 'user_entered'
    }
    const config = {
        headers: {
            'Content-type': 'application/json',
            'Authorization': process.env.SHEET_TOKEN
        }
    }
    return new Promise(async (resolve, reject) => {
        try {
            await post(url, body, config)
            setCategory('')
            setRequiredItems('')
            setItemIsOver('')
            resolve('Requisição feita com sucesso.')
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
