import { db } from '../../Firebase/index'
import { post } from 'axios'

export const inputEditUpdate = (cnpj, column, row, obj, newProp, setIsLoading, setError) => () => {
    let property
    if (Object.keys(obj)[0] === 'ie') property = `'${newProp}`
    else property = newProp
    const url = process.env.SHEET_URL
    const body = {
        apiResource: 'values',
        apiMethod: 'update',
        range: `Base!${column}${row}`,
        valueInputOption: 'user_entered',
        spreadsheetId: process.env.SHEET_STOREOWNERS_ID,
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
                const snapCollection = await db.collection('storeowners').where('cnpj', '==', cnpj).get()
                let docId
                snapCollection.forEach(doc => docId = doc.id)
                await db.collection('storeowners').doc(docId).update(obj)
            } catch (error) {
                console.log(error)
                if (error.response) console.log(error.response)
                throw 'Erro ao salvar na Firestore'
            }
            resolve('Deu bom!')
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

export const formUpdate = (state, cnpj, row) => async () => {
    const { affiliateName, affiliateCpf, advisor, salesman, link, storeowner, setAffiliateName, setAffiliateCpf, setAdvisor, setSalesman, setStoreowner, setLink } = state
    const nomeAfiliado = affiliateName ? affiliateName.trim() : ''
    const cpfAfiliado = affiliateCpf ? affiliateCpf.trim() : ''
    const assessor = advisor ? advisor.trim() : ''
    const vendedor = salesman ? salesman.trim() : ''
    const vinculo = link ? link.trim() : ''
    const url = process.env.SHEET_URL
    const body = {
        apiResource: 'values',
        apiMethod: 'update',
        range: `Base!S${row}:W${row}`,
        valueInputOption: 'raw',
        spreadsheetId: process.env.SHEET_STOREOWNERS_ID,
        resource: {
            values: [[nomeAfiliado.split(' - ')[1] ? nomeAfiliado.split(' - ')[1] : 'NENHUM', cpfAfiliado, assessor, vendedor, vinculo]]
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
            try {
                const snapCollection = await db.collection('storeowners').where('cnpj', '==', cnpj).get()
                let docId
                snapCollection.forEach(doc => docId = doc.id)
                await db.collection('storeowners').doc(docId).update({ nomeAfiliado: nomeAfiliado.split(' - ')[1] ? nomeAfiliado.split(' - ')[1] : 'NENHUM', cpfAfiliado, assessor, vendedor, vinculo })
            } catch (error) {
                console.log(error)
                if (error.response) console.log(error.response)
                throw 'Erro ao salvar na Firestore'
            }
            // resolve Promise with message to user
            setStoreowner({ ...storeowner, assessor, vinculo })
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
