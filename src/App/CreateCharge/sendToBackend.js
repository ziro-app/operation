import axios, { post } from 'axios'
import md5 from 'md5'
import { readAndCompressImage } from 'browser-image-resizer'
import { formatDateUTC3 } from '@ziro/format-date-utc3'
import arrayObject from '@ziro/array-object'
import { db, fs, storage } from '../../Firebase/index'
import { round, internalFormat } from '../Transactions/utils'
import getSheet from './utils/getSheet'
import postSheet from './utils/postSheet'
import dataPostBatch from './utils/dataPostBatch'

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
    romaneio,
    bankCheckEntry,
    installment,
    discount,
    paymentType,
    beneficiary,
    beneficiaryDocument,
    bankName,
    accountNumber,
    agency,
    note,
    suppliers,
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
    setReceivableAmount,
    setPaymentTypeReceivable,
    setPixKey,
    paymentTypeReceivable,
    pixKey,
    needUpdateBankAccount,
    bank,
    setNeedUpdateBankAccount,
    nickname,
    hasSellerZoopPlan,
    uid,
  } = state
  const linkValue = type === 'Cartão de Crédito' ? internalFormat(defineCardValue(state)) : internalFormat(defineTEDValue(state))

  const total = totalAmount ? internalFormat(totalAmount) : ''
  console.log('total', total)
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
      const date = new Date()
      const time = date.getTime().toString()
      if (romaneio.size === 0) throw { msg: 'Imagem com tamanho vazio', customError: true }
      const nameOfFile = md5(`${romaneio.name}${randStr()}`).substr(0, 5)
      const compressed = await readAndCompressImage(romaneio, { quality: 0.65 })
      const timestamp = Date.now()
      const image = storage.child(`Romaneios/${nameOfFile}-${timestamp}`)
      const uploadTask = await image.put(compressed)
      const imgUrl = await uploadTask.ref.getDownloadURL()
      const body = {}
      const baseUrl = process.env.HOMOLOG ? 'http://localhost:8080/pagamento/' : 'https://ziro.app/pagamento/'
      const nowDate = fs.FieldValue.serverTimestamp()
      const requestSheet = pixKey ? await axios(getSheet(['PIX!A:C'])) : await axios(getSheet(['TED!A:F']))
      console.log('pixKey', pixKey)
      console.log('requestSheet', requestSheet)
      const objectSheet = await arrayObject(requestSheet.data.valueRanges[0])
      const discountedValue = total - total * (discount / 100)
      console.log('objectSheet', objectSheet)
      console.log('requestSheet.data', requestSheet.data)
      const updateObj = pixKey
        ? { chave: pixKey, uid: time }
        : {
            banco: bankName,
            agencia,
            conta,
            razao: beneficiary,
            cnpj: beneficiaryDocument,
            uid: time,
          }
      let arrayUpdate = {}
      const supplierNameFormatted = supplierName.split(' -')[0]
      const tab = pixKey ? 'PIX' : 'TED'
      console.log('supplierNameFormatted', supplierNameFormatted)
      console.log('suppliers', suppliers)
      console.log('Object.keys(bank).length', Object.keys(bank).length)
      console.log(
        'suppliers.find(supplier => supplier.fabricante === supplierNameFormatted)',
        suppliers.find(supplier => supplier.fabricante === supplierNameFormatted),
      )
      if (Object.keys(suppliers.find(supplier => supplier.fabricante === supplierNameFormatted)).length > 0 && Object.keys(bank).length === 0) {
        console.log('entrou onde não encontrou')
        arrayUpdate = pixKey
          ? [supplierNameFormatted, pixKey, time]
          : [supplierNameFormatted, bankName, agencia, conta, beneficiary, beneficiaryDocument, time]
        await axios(postSheet(arrayUpdate, tab, 'append'))
      } else {
        arrayUpdate = pixKey ? dataPostBatch(objectSheet, 'uid', uid, updateObj, 'PIX') : dataPostBatch(objectSheet, 'uid', uid, updateObj, 'TED')
        await axios(postSheet(arrayUpdate, tab))
      }
      /* teste */
      let bodyLinkPayment = {}
      if (type === 'Cartão de Crédito') {
        bodyLinkPayment = {
          apiResource: 'values',
          apiMethod: 'append',
          spreadsheetId: process.env.SHEET_ID_LINK_PAYMENTS,
          range: 'Link Pagamentos!A1',
          resource: {
            values: [
              [
                formatDateUTC3(new Date()),
                storeownerName,
                supplierNameFormatted,
                linkValue,
                total,
                '4',
                discount,
                paymentType,
                imgUrl,
                paymentTypeReceivable,
                paymentTypeReceivable === 'TED' ? beneficiary : '-',
                paymentTypeReceivable === 'TED' ? bankName : '-',
                paymentTypeReceivable === 'TED' ? agencia : '-',
                paymentTypeReceivable === 'TED' ? conta : '-',
                paymentTypeReceivable === 'TED' ? doc : '-',
                pixKey||'-',
                obs,
                nickname,
              ],
            ],
          },
          valueInputOption: 'user_entered',
        }
      } else {
        bodyLinkPayment = {
          apiResource: 'values',
          apiMethod: 'append',
          spreadsheetId: process.env.SHEET_ID_LINK_PAYMENTS,
          range: 'Link TED!A1',
          resource: {
            values: [
              [
                formatDateUTC3(new Date()),
                storeownerName,
                supplierNameFormatted,
                total,
                linkValue,
                paymentType,
                imgUrl,
                paymentTypeReceivable,
                paymentTypeReceivable === 'TED' ? beneficiary : '-',
                paymentTypeReceivable === 'TED' ? bankName : '-',
                paymentTypeReceivable === 'TED' ? agencia : '-',
                paymentTypeReceivable === 'TED' ? conta : '-',
                paymentTypeReceivable === 'TED' ? doc : '-',
                pixKey||'-',
                obs,
                nickname,
              ],
            ],
          },
          valueInputOption: 'user_entered',
        }
      }
      await post(url, bodyLinkPayment, config)
      /* fim teste */
      console.log('state', state)
      console.log('total', total)
      if (type === 'Cartão de Crédito') {
        const docRef = await db.collection('credit-card-payments').add({
          dateLinkCreated: nowDate,
          dateLastUpdate: nowDate,
          seller: 'Ziro',
          onBehalfOfBrand: supplierNameFormatted,
          sellerZoopId: '13c09ab817014ae6843634493177afb2',
          charge: totalAmount,
          installmentsMax: '4',
          status: 'Aguardando Pagamento',
          observations: note,
          insurance: totalAmount > 300000,
          isNewPlan: true,
          sellerZoopPlan: hasSellerZoopPlan || null,
          checkoutWithoutRegister: false,
        })
        try {
          const doc = await docRef.get()
          if (doc) {
            await navigator.clipboard.writeText(`${baseUrl}${doc.id}`)
          }
        } catch (error) {
          console.log('error', error)
          throw { msg: 'Erro ao realizar a cópia', copyError: true }
        }
      }
      setReceivableAmount('')
      setPaymentTypeReceivable('')
      setReceivableAmount('')
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
      setPixKey('')
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
