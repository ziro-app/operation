import { post } from 'axios'
import { dateHourFormatter, intFormatter, numberFormatter, singleDateFormatter } from '../utils'

const sendToBackend = state => () => {
    const { billet, saleDate, provider, storeowner, billetValue, paymentMethod, romaneio,
        dueDate, revenue, advisor, type, setSearchedName, setBillet, setSaleDate, setProvider, setStoreowner,
        setBilletValue, setPaymentMethod, setRomaneio, setDueDate, setRevenue, setAdvisor,
        setType } = state
    const comissao = numberFormatter(provider.comissao)? numberFormatter(provider.comissao)/100 : 0.00
    const today = new Date()
    const url = process.env.SHEET_URL
    const body = {
        apiResource: 'values',
        apiMethod: 'append',
        spreadsheetId: process.env.SHEET_ID_BILLETS,
        range: 'Boletos!A1',
        resource: {
            values: [
                [dateHourFormatter(today), intFormatter(romaneio), intFormatter(billet), today.getMonth()+1, today.getFullYear(), singleDateFormatter(saleDate),
                    storeowner, numberFormatter(billetValue), comissao, revenue, provider.nome, paymentMethod,
                    type, advisor, singleDateFormatter(dueDate), '-', provider.endereco.split(' — ')[0],
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
