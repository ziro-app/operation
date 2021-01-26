import { post } from 'axios'
import md5 from 'md5'
import { readAndCompressImage } from 'browser-image-resizer'
import { formatDateUTC3 } from '@ziro/format-date-utc3'
import { storage } from '../../Firebase/index'
import { round, internalFormat } from '../Transactions/utils'

const defineCardValue = ({ discount, installment, totalAmount }) => {
  const valueAmount = totalAmount / 100
  if (discount === '' || discount == 0) {
    if (installment.indexOf('1') !== -1) return round(valueAmount / 0.96, 2)
    if (installment.indexOf('2') !== -1) return round(valueAmount / 0.95, 2)
    if (installment.indexOf('3') !== -1 || installment.indexOf('4') !== -1) return round(valueAmount / 0.93, 2)
    return round(valueAmount / 0.92, 2)
  }
  return totalAmount
}

const defineTEDValue = ({ hasCommission, commissionValue, totalAmount }) => {
  if (hasCommission === 'Sim') {
    const percent = commissionValue / 100
    return totalAmount - totalAmount * percent
  }
  return totalAmount
}

const randStr = () => {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

const sendToBackend = state => () => {
  const {
    totalAmount,
    type,
    storeownerName,
    supplierName,
    bankCheckEntry,
    beneficiaryDocument,
    accountNumber,
    agency,
    note,
    billet,
    setTotalAmount,
    setType,
    setStoreowner,
    setStoreownerName,
    setSupplier,
    setSupplierName,
    setRomaneio,
    setBankCheckEntry,
    setFilename,
    setFilenameBankCheckEntry,
    setInstallment,
    setDiscount,
    setPaymentType,
    setBeneficiary,
    setBeneficiaryDocument,
    setBankName,
    setAccountNumber,
    setAgency,
    setBank,
    setHasCommission,
    setCommissionValue,
    setNote,
    setBillet,
    bankCheckDate
  } = state
  const linkValue = type === 'Cartão de Crédito' ? internalFormat(defineCardValue(state)) : internalFormat(defineTEDValue(state))
  const total = totalAmount ? internalFormat(totalAmount) : ''
  const doc = beneficiaryDocument.startsWith('0') ? `'${beneficiaryDocument}` : beneficiaryDocument
  const agencia = agency.startsWith('0') ? `'${agency}` : agency
  const conta = accountNumber.startsWith('0') ? `'${accountNumber}` : accountNumber
  const obs = note ? note.trim() : ''
  const url = process.env.SHEET_URL
  const config = {
    headers: {
      'Content-type': 'application/json',
      Authorization: process.env.SHEET_TOKEN,
    },
  }
  return new Promise(async (resolve, reject) => {
    try {
      if (bankCheckEntry === '' || bankCheckEntry.size === 0) throw { msg: 'Imagem com tamanho vazio', customError: true }
      const timestamp = Date.now()

      const nameOfFileBankCheckEntry = md5(`${bankCheckEntry.name}${randStr()}`).substr(0, 5)
      const compressedBankCheckEntry = await readAndCompressImage(bankCheckEntry, { quality: 0.65 })
      const imageBankCheckEntry = storage.child(`Cheques/${nameOfFileBankCheckEntry}-${timestamp}`)
      const uploadTaskBankCheckEntry = await imageBankCheckEntry.put(compressedBankCheckEntry)
      const imgUrlBankCheckEntry = await uploadTaskBankCheckEntry.ref.getDownloadURL()
      const yearBankCheckDate = bankCheckDate.split('-')[0]
      const monthBankCheckDate = bankCheckDate.split('-')[1]
      const dayBankCheckDate = bankCheckDate.split('-')[2]
      const newDateBankCheck = `${dayBankCheckDate}/${monthBankCheckDate}/${yearBankCheckDate}`
      const bankCheckDateFormatted = newDateBankCheck//bankCheckDate.replace(/-/g, '/')
      const body = {
        apiResource: 'values',
        apiMethod: 'append',
        spreadsheetId: process.env.SHEET_ID_LINK_PAYMENTS,
        range: 'Link Cheques!A1',
        resource: {
          values: [[formatDateUTC3(new Date()), billet, storeownerName, supplierName, total, imgUrlBankCheckEntry, obs, timestamp,bankCheckDateFormatted]],
        },
        valueInputOption: 'user_entered',
      }

      await post(url, body, config)
      setType('')
      setTotalAmount('')
      setStoreowner({})
      setStoreownerName('')
      setSupplier({})
      setSupplierName('')
      setRomaneio('')
      setBankCheckEntry('')
      setFilename('')
      setFilenameBankCheckEntry('')
      setInstallment('')
      setDiscount('')
      setPaymentType('')
      setBank({})
      setBeneficiary('')
      setBeneficiaryDocument('')
      setBankName('')
      setAccountNumber('')
      setAgency('')
      setHasCommission('')
      setCommissionValue('')
      setNote('')
      setBillet('')
      resolve('Link cadastrado com sucesso.')
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
