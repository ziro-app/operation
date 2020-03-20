import { post } from 'axios'

const months = {
    '01': 'Jan',
    '02': 'Fev',
    '03': 'Mar',
    '04': 'Apr',
    '05': 'May',
    '06': 'Jun',
    '07': 'Jul',
    '08': 'Aug',
    '09': 'Sep',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dec'
}

const dateFormat = (date) => {
    let parts = date.split('/')
    return `${parts[0]}/${months[parts[1]]}/${parts[2]}`
}

const sendToBackend = state => () => {
    const { billet, saleDate, provider, storeowner, billetValue, paymentMethod, romaneio,
        dueDate, revenue, advisor, type, setSearchedName, setBillet, setSaleDate, setProvider, setStoreowner,
        setBilletValue, setPaymentMethod, setRomaneio, setDueDate, setRevenue, setAdvisor,
        setType } = state
    const value = billetValue? parseFloat(billetValue).toLocaleString('en-USA', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL',  }).replace(/\s/g, '') : ''
    const comissao = provider.comissao? provider.comissao.replace(',', '.') : ''
    const venda = saleDate? dateFormat(saleDate) : ''
    const vencimento = dueDate? dateFormat(dueDate) : ''
    const today = new Date()
    const data = `${today.getDate()}/${months[today.getMonth()+1 >= 10? today.getMonth()+1 : `0${today.getMonth()+1}`]}/${today.getFullYear()}`
    const url = process.env.SHEET_URL
    const body = {
        apiResource: 'values',
        apiMethod: 'append',
        spreadsheetId: process.env.SHEET_ID_BILLETS,
        range: 'Boletos!A1',
        resource: {
            values: [
                [data, romaneio, billet, today.getMonth()+1, today.getFullYear(), venda,
                    storeowner, value, comissao, revenue, provider.nome, paymentMethod,
                    type, advisor, vencimento, '-', provider.endereco.split(' — ')[0],
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
