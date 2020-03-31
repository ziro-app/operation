import { post } from 'axios'
import { dateHourFormatterUTC3, numberFormatter } from '../utils'

const mountBankTransfer = ({ paymentMethod, bankTransfer, beneficiary, beneficiaryDocument, bankName, agency, accountNumber }) => {
    if(paymentMethod === 'Transferência Bancária' || bankTransfer === 'Sim')
        return `Sim, Beneficiário: ${beneficiary} - Documento: ${beneficiaryDocument} - Banco: ${bankName} - Agência: ${agency} - Conta: ${accountNumber}`
    else return 'Não'
}

const sendToBackend = state => () => {
    const { nickname, expenseAmount, type, operationalDescription, date, attendance,
        haveRefound, note, commonDescription, paymentMethod, numberOfInstallments,
        setExpenseAmount, setOperacionalDescription, setDate, setAttendance, setHaveRefound,
        setNote, setCommonDescription, setPaymentMethod, setNumberOfInstallments, setBankTransfer,
        setBankName, setAccountNumber, setAgency } = state
    const transfer = mountBankTransfer(state)
    const value = expenseAmount? numberFormatter(expenseAmount)/100 : ''
    const atendimento = attendance? attendance.split(' - ')[0] : ''
    const url = process.env.SHEET_URL
    const body = {
        apiResource: 'values',
        apiMethod: 'append',
        spreadsheetId: process.env.SHEET_ID_EXPENSES,
        range: 'Despesas!A1',
        resource: {
            values: [
                [dateHourFormatterUTC3(new Date()), nickname, value, type, operationalDescription,
                    atendimento, haveRefound, note, commonDescription, paymentMethod, numberOfInstallments,
                    transfer, type === 'Operacional'? date : '', type==='Comum'? date : '']
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
            setExpenseAmount('')
            setBankTransfer('')
            setOperacionalDescription('')
            setAttendance('')
            setHaveRefound('')
            setNote('')
            setCommonDescription('')
            setDate('')
            setPaymentMethod('')
            setNumberOfInstallments('')
            setBankName('')
            setAccountNumber('')
            setAgency('')
            resolve('Despesa cadastrada com sucesso.')
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
