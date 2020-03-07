import { db } from '../../Firebase/index'
import { post } from 'axios'

export const inputEditUpdate = (cnpj, column, row, obj, newProp, setIsLoading, setError) => () => {
    const url = process.env.SHEET_URL
    const body = {
        apiResource: 'values',
        apiMethod: 'update',
        range: `Base!${column}${row}`,
        valueInputOption: 'raw',
        spreadsheetId: process.env.SHEET_STOREOWNERS_ID,
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

export const dropdownUpdate = (state, cnpj, row) => async () => {
    const { affiliateName, affiliateCpf, advisor, salesman, setAffiliateName, setAffiliateCpf, setAdvisor, setSalesman } = state
    const nomeAfiliado = affiliateName ? affiliateName.trim() : ''
    const cpfAfiliado = affiliateCpf ? affiliateCpf.trim() : ''
    const assessor = advisor ? advisor.trim() : ''
    const vendedor = salesman ? salesman.trim() : ''
    const url = process.env.SHEET_URL
    const body = {
        apiResource: 'values',
        apiMethod: 'update',
        range: `Base!R${row}:U${row}`,
        valueInputOption: 'raw',
        spreadsheetId: process.env.SHEET_STOREOWNERS_ID,
        resource: {
            values: [[nomeAfiliado, cpfAfiliado, assessor, vendedor]]
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
                await db.collection('storeowners').doc(docId).update({ nomeAfiliado, cpfAfiliado, assessor, vendedor })
            } catch (error) {
                console.log(error)
                if (error.response) console.log(error.response)
                throw 'Erro ao salvar na Firestore'
            }
            // clear all fields after submission
            setAffiliateName('')
            setAffiliateCpf('')
            setAdvisor('')
            setSalesman('')
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
