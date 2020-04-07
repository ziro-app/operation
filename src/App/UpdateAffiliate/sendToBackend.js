import { post } from 'axios'

export const inputEditUpdate = (column, row, newProp, setIsLoading, setError) => () => {
    const url = process.env.SHEET_URL
    const body = {
        apiResource: 'values',
        apiMethod: 'update',
        spreadsheetId: process.env.SHEET_ID_AFFILIATES,
        range: `Afiliados!${column}${row}`,
        valueInputOption: 'raw',
        resource: {
            values: [[newProp]]
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
            resolve('Afiliado atualizado.')
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

export const dropdownUpdate = (state, row) => async () => {
    const { brand, branch, setBrand, setBranch } = state
    const url = process.env.SHEET_URL
    const body = {
        apiResource: 'values',
        apiMethod: 'update',
        range: `Afiliados!G${row}:H${row}`,
        valueInputOption: 'raw',
        spreadsheetId: process.env.SHEET_ID_AFFILIATES,
        resource: {
            values: [[brand, branch]]
        }
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
            setBrand('')
            setBranch('')
            // resolve Promise with message to user
            resolve('Atualizado com sucesso')
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
