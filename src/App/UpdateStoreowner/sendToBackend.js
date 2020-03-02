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

export const dropdownUpdate = (state, cnpj, row) => () => {
    const { affiliateName, affiliateCpf, advisor, salesman, obj, setAffiliateName, setAffiliateCpf, setAdvisor, setSalesman } = state
    const url = process.env.SHEET_URL
    const bodyAffiliate = {
        apiResource: 'values',
        apiMethod: 'update',
        valueInputOption: 'raw',
        spreadsheetId: process.env.SHEET_STOREOWNERS_ID,
        resource: {
            values: [[affiliateName, affiliateCpf]]
        }
    }
    const bodyAdvisorSalesman = {
        apiResource: 'values',
        apiMethod: 'update',
        valueInputOption: 'raw',
        spreadsheetId: process.env.SHEET_STOREOWNERS_ID,
        resource: {
            values: [[advisor, salesman]]
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
            const row = await findStoreownerRow(cnpj)
            await post(url, { range: `Base!B${row}:C${row}`, ...bodyAffiliate }, config)
            await post(url, { range: `Base!T${row}:U${row}`, ...bodyAdvisorSalesman }, config)
            try {
                const snapCollection = await db.collection('storeowners').where('cnpj', '==', cnpj).get()
                let docId
                snapCollection.forEach(doc => docId = doc.id)
                await db.collection('storeowners').doc(docId).update({ 'nomeAfiliado': affiliateName, 'cpfAfiliado': affiliateCpf, 'assessor': advisor, 'vendedor': salesman })
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

const findStoreownerRow = async cnpj => {
    const url = process.env.SHEET_URL
    let pos
    const config = {
        headers: {
            'Content-type': 'application/json',
            'Authorization': process.env.SHEET_TOKEN
        }
    }
    const body = {
        "apiResource": "values",
        "apiMethod": "get",
        "range": "Base",
        "spreadsheetId": '1x6T_309HUNijByr1B_2Ofi0oFG3USyTAWH66QV-6L-0'
    }
    const { data: { values } } = await post(url, body, config)
    values.map((user, index) => {
        if (user[8] === cnpj) {
            pos = index
        }
    })
    return pos + 1
}