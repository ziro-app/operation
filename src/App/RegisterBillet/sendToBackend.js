import { post } from 'axios'

const sendToBackend = state => () => {
    const { billet, saleDate, provider, storeowner, billetValue, paymentMethod, romaneio,
        dueDate, revenue, advisor, type, setSearchedName, setBillet, setSaleDate, setProvider, setStoreowner,
        setBilletValue, setPaymentMethod, setRomaneio, setDueDate, setRevenue, setAdvisor,
        setType } = state
    const value = billetValue? parseFloat(billetValue).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' }) : ''
    const today = new Date()
    const url = process.env.SHEET_URL
    const body = {
        apiResource: 'values',
        apiMethod: 'append',
        spreadsheetId: process.env.SHEET_ID_BILLETS,
        range: 'Boletos!A1',
        resource: {
            values: [
                [today, romaneio, billet, today.getMonth()+1, today.getFullYear(), saleDate,
                    storeowner, value, provider.comissao, revenue, provider.nome, paymentMethod,
                    type, advisor, dueDate, '-', provider.endereco.split(' — ')[0],
                    provider.endereco.split(' — ')[1], '', '', '', '', '']
            ]
        },
        valueInputOption: 'raw'
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
            // clear all fields after submission
            setSearchedName(''),
            setBillet(''),
            setSaleDate(''),
            setProvider({'nome': '', 'comissao': '', 'endereco': '' }),
            setStoreowner(''),
            setBilletValue(''),
            setPaymentMethod(''),
            setRomaneio(''),
            setDueDate(''),
            setRevenue(''),
            setAdvisor(''),
            setType('')
            // resolve Promise with message to user
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
