import { post } from 'axios'
import { formatDateUTC3 } from '@ziro/format-date-utc3'

const sendToBackend = state => () => {
    const { brand, branch, insta, fname, lname, cpf, whats } = state
    const branchTrim = branch ? branch.trim() : ''
    const instaTrim = insta ? insta.replace('@', '').trim().toLowerCase() : ''
    const fnameTrim = fname ? fname.trim() : ''
    const lnameTrim = lname ? lname.trim() : ''
    const url = process.env.SHEET_URL
    const body = {
        apiResource: 'values',
        apiMethod: 'append',
        spreadsheetId: process.env.SHEET_ID_AFFILIATES,
        range: 'Afiliados!A1',
        resource: {
            values: [
                [formatDateUTC3(new Date()), cpf, fnameTrim, lnameTrim, whats, '', brand, branchTrim, instaTrim]
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
            resolve('Afiliado criado com sucesso.')
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
