import React, { useState, useEffect, useContext } from 'react'
import { motion } from 'framer-motion'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner'
import Error from '@bit/vitorbarbosa19.ziro.error'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import SpinnerWithDiv from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import InputText from '@bit/vitorbarbosa19.ziro.input-text'
import InputMoney from '@bit/vitorbarbosa19.ziro.input-money'
import maskInput from '@ziro/mask-input'
import currencyFormat from '@ziro/currency-format'
import banksList from '../utils/banks'
import fetch from './fetch'
import sendToBackend from './sendToBackend'
import matchForm from './matchForm'
import validateDocuments from '../utils/validateDocuments'
import { userContext } from '../appContext'
import { db } from '../../Firebase'

const CreateCharge = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingFunction, setIsLoadingFunction] = useState(true)
  const [isError, setIsError] = useState(false)
  const [uid, setUid] = useState('')
  const workDate = new Date()
  const { nickname } = useContext(userContext)
  // APLICADO NOS DOIS
  const [totalAmount, setTotalAmount] = useState('')
  const [receivableAmount, setReceivableAmount] = useState('')
  const [type, setType] = useState('')
  const typeList = ['Transferência', 'Cartão de Crédito']
  const [storeowners, setStoreowners] = useState([])
  const [storeowner, setStoreowner] = useState({ razao: '' })
  const [storeownerName, setStoreownerName] = useState('')
  const [banks, setBanks] = useState([])
  const [bank, setBank] = useState({ fabricante: '', banco: '', agencia: '', conta: '', razao: '', cnpj: '' })
  const [suppliers, setSuppliers] = useState([])
  const [suppliersTrends, setSuppliersTrends] = useState([])
  const [supplier, setSupplier] = useState({ fabricante: '' })
  const [supplierName, setSupplierName] = useState('')
  const [bankCheckEntry, setBankCheckEntry] = useState('')
  const [romaneio, setRomaneio] = useState('')
  const [filename, setFilename] = useState('')
  const [filenameBankCheckEntry, setFilenameBankCheckEntry] = useState('')
  const [beneficiary, setBeneficiary] = useState('')
  const [beneficiaryDocument, setBeneficiaryDocument] = useState('')
  const [bankName, setBankName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [agency, setAgency] = useState('')
  const [note, setNote] = useState('')
  const [billet, setBillet] = useState('')
  const [needUpdateBankAccount, setNeedUpdateBankAccount] = useState(false)
  const [hasSellerZoopPlan, setHasSellerZoopPlan] = useState(null)
  console.log('isLoading',isLoading)
  console.log('isLoadingFunction',isLoadingFunction)
  // DADOS DO CARTÃO
  const [installment, setInstallment] = useState('')
  const installments = ['1', '2', '3', '4', '5', '6']
  const [discount, setDiscount] = useState('')
  const [paymentType, setPaymentType] = useState('')
  const [paymentTypeReceivable, setPaymentTypeReceivable] = useState('')

  // DADOS DO TED
  const [hasCommission, setHasCommission] = useState('')
  const [commissionValue, setCommissionValue] = useState('')

  // DADOS DO PIX
  const [pixKey, setPixKey] = useState('')

  const setState = {
    setTotalAmount,
    setType,
    setStoreowner,
    setStoreownerName,
    setSupplier,
    setSupplierName,
    setRomaneio,
    setBankCheckEntry,
    filename,
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
    setBanks,
    setBank,
    setHasCommission,
    setCommissionValue,
    setNote,
    setBillet,
    setReceivableAmount,
    setPaymentTypeReceivable,
    setPixKey,
    setNeedUpdateBankAccount,
    setIsLoadingFunction,
    setHasSellerZoopPlan,
    setSuppliersTrends,
  }
  const state = {
    nickname,
    totalAmount,
    type,
    storeowner,
    storeownerName,
    supplier,
    supplierName,
    romaneio,
    bankCheckEntry,
    installment,
    installments,
    discount,
    paymentType,
    beneficiary,
    beneficiaryDocument,
    bankName,
    accountNumber,
    agency,
    banks,
    bank,
    hasCommission,
    commissionValue,
    note,
    billet,
    paymentTypeReceivable,
    receivableAmount,
    hasSellerZoopPlan,
    setStoreownerName,
    storeowners,
    setStoreowner,
    setSupplierName,
    setUid,
    uid,
    suppliersTrends,
    suppliers,
    pixKey,
    needUpdateBankAccount,
    isLoadingFunction,
    setSupplier,
    setBank,
    ...setState,
  }

  const validations = [
    {
      name: 'type',
      validation: value => typeList.includes(value),
      value: type,
      message: 'Tipo inválido',
    },
    {
      name: 'storeowner',
      validation: value => storeowners.find(storeowner => storeowner.razao === value),
      value: storeownerName,
      message: 'Lojista inválido',
    },
    {
      name: 'supplier',
      validation: value => value !== '',
      value: supplierName,
      message: 'Campo obrigatório',
    },
    {
      name: 'romaneio',
      validation: value => value !== undefined && value !== '' && /(\.jpg|\.jpeg|\.png|\.PNG|\.JPEG|\.JPG)$/.test(value.name),
      value: romaneio,
      message: 'Formatos válidos: .png, .jpg e .jpeg',
    },
    {
      name: 'paymentType',
      validation: value => ['TED', 'Cheque', 'Transferência'].includes(value),
      value: paymentType,
      message: 'Meio de pagamento inválido',
    },
    {
      name: 'beneficiary',
      validation: value => (paymentType === 'TED' ? !!value : true),
      value: beneficiary,
      message: 'Campo obrigatório',
    },
    {
      name: 'beneficiaryDocument',
      validation: value =>
        paymentType === 'TED'
          ? /(^\d{3}\.\d{3}\.\d{3}\-\d{2}$)|(^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$)/.test(value) &&
            (process.env.HOMOLOG ? true : validateDocuments(value))
          : true,
      value: beneficiaryDocument,
      message: 'Documento inválido',
    },
    {
      name: 'bankName',
      validation: value =>
        paymentType === 'TED' ? (bank.banco ? true : banksList.find(bank => bank.split(' - ')[1] === value) !== undefined) : true,
      value: bankName,
      message: 'Banco inválido',
    },
    {
      name: 'accountNumber',
      validation: value => (paymentType === 'TED' ? !!value : true),
      value: accountNumber,
      message: 'Campo obrigatório',
    },
    {
      name: 'agency',
      validation: value => (paymentType === 'TED' ? !!value : true),
      value: agency,
      message: 'Campo obrigatório',
    },
    {
      name: 'discount',
      validation: value => (type === 'Cartão de Crédito' ? !!value : true),
      value: discount,
      message: 'Campo obrigatório',
    },
  ]

  const clearFields = () => {
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
  }
  useEffect(() => {
    async function getSellerZoopPlan() {
      const getSupplierData = await db.collection('suppliers').where('fantasia', '==', 'ZIRO').get()
      getSupplierData.forEach(doc => {
        setHasSellerZoopPlan(doc.data().sellerZoopPlan || null)
      })
      console.log(hasSellerZoopPlan)
    }
    getSellerZoopPlan()
  }, [])

  useEffect(
    () =>
      fetch(
        setIsLoading,
        setIsLoadingFunction,
        setIsError,
        setStoreowners,
        setBanks,
        setSuppliers,
        suppliersTrends,
        setSuppliersTrends,
        paymentTypeReceivable,
      ),
    [paymentTypeReceivable],
  )
  console.log(' bank.keys.count', Object.keys(bank).length)
  // console.log('states', state.supplierName.split(' -')[0])

  if (isLoading)
    return (
      <div style={{ display: 'grid' }}>
        <Spinner size="5rem" />
      </div>
    )
  if (isError) return <Error />
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Form
        validations={validations}
        sendToBackend={sendToBackend ? sendToBackend(state) : () => null}
        inputs={[
          <FormInput
            name="type"
            label="Tipo de recebimento"
            input={
              <Dropdown
                value={type}
                onChange={({ target: { value } }) => {
                  setType(value)
                  clearFields()
                }}
                onChangeKeyboard={element => {
                  if (element) {
                    setType(element.value)
                    clearFields()
                  } else null
                }}
                readOnly
                list={typeList}
                placeholder="Tipo de pagamento"
              />
            }
          />,
          ...matchForm(state),
        ]}
      />
      {isLoadingFunction || isLoading && (
        <div
          style={{
            zIndex: '9999',
            marginTop:'-60%'
          }}
        >
          <SpinnerWithDiv size="5rem" />
        </div>
      )}
    </motion.div>
  )
}

export default CreateCharge
