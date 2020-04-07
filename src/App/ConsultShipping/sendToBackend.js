import { post } from 'axios'
import { dateHourFormatterUTC3, numberFormatter } from '../utils'

const sendToBackend = state => () => {
    console.log('Consulta de frete')
    const { setSuccess } = state
    setSuccess(true)
    return
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
