import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner'
import Error from '@bit/vitorbarbosa19.ziro.error'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import InputText from '@bit/vitorbarbosa19.ziro.input-text'
import InputMoney from '@bit/vitorbarbosa19.ziro.input-money'
import maskInput from '@ziro/mask-input'
import currencyFormat from '@ziro/currency-format'
import SingleImageUpload from '../SingleImageUpload/index'
import banksList from '../utils/banks'
import fetch from './fetch'
import sendToBackend from './sendToBackend'
import validateDocuments from '../utils/validateDocuments'

const BankCheckEntry = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const workDate = new Date()
  // APLICADO NOS DOIS
  const [totalAmount, setTotalAmount] = useState('')
  const [receivableAmount, setReceivableAmount] = useState('')
  const [type, setType] = useState('')
  const typeList = ['TED', 'Cartão de Crédito']
  const [storeowners, setStoreowners] = useState([])
  const [storeowner, setStoreowner] = useState({ razao: '' })
  const [storeownerName, setStoreownerName] = useState('')
  const [banks, setBanks] = useState([])
  const [bank, setBank] = useState({ fabricante: '', banco: '', agencia: '', conta: '', razao: '', cnpj: '' })
  const [suppliers, setSuppliers] = useState([])
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
  const [bankCheckDate, setBankCheckDate] = useState(
    `${workDate.getFullYear()}-${`0${workDate.getMonth() + 1}`.slice(-2)}-${`0${workDate.getDate()}`.slice(-2)}`,
  )
  console.log('const timestamp = Date.now()', Date.now())
  // DADOS DO CARTÃO
  const [installment, setInstallment] = useState('')
  const installments = ['1', '2', '3', '4', '5', '6']
  const [discount, setDiscount] = useState('')
  const [paymentType, setPaymentType] = useState('')

  // DADOS DO TED
  const [hasCommission, setHasCommission] = useState('')
  const [commissionValue, setCommissionValue] = useState('')

  const setState = {
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
    setBanks,
    setBank,
    setHasCommission,
    setCommissionValue,
    setNote,
    setBillet,
    setReceivableAmount,
  }
  const state = {
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
    receivableAmount,
    bankCheckDate,
    ...setState,
  }

  const validations = [
    {
      name: 'billetValue',
      validation: value => !!value,
      value: totalAmount,
      message: 'Campo obrigatório',
    },
    {
      name: 'totalAmount',
      validation: value => !!value,
      value: totalAmount,
      message: 'Campo obrigatório',
    },
    {
      name: 'storeowner',
      validation: value => storeowners.find(storeowner => storeowner.razao === value),
      value: storeownerName,
      message: 'Lojista inválido',
    },
    {
      name: 'supplier',
      validation: value => suppliers.find(supplier => supplier.fabricante === value),
      value: supplierName,
      message: 'Fabricante inválido',
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

  useEffect(() => fetch(setIsLoading, setIsError, setStoreowners, setBanks, setSuppliers), [])

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
            name="billetValue"
            label="Boleto"
            input={
              <InputText
                value={billet}
                onChange={({ target: { value } }) => setBillet(value)}
                placeholder="Numero do boleto que será gerado para o fabricante"
                type="number"
              />
            }
          />,
          <FormInput
            name="storeowner"
            label="Lojista"
            input={
              <Dropdown
                value={storeownerName}
                onChange={({ target: { value } }) => {
                  if (value !== '') {
                    setStoreownerName(value)
                    const searched = storeowners.find(storeowner => storeowner.razao === value)
                    if (searched) {
                      setStoreowner(searched)
                    } else setStoreowner({})
                  } else {
                    setStoreownerName('')
                    setStoreowner({})
                  }
                }}
                onChangeKeyboard={element => {
                  if (element && element.value !== '') {
                    setStoreownerName(element.value)
                    const searched = storeowners.find(storeowner => storeowner.razao === element.value)
                    if (searched) {
                      setStoreowner(searched)
                    } else setStoreowner({})
                  } else {
                    setStoreownerName('')
                    setStoreowner({})
                  }
                }}
                list={storeowners.map((storeowner, index) => (storeowner.duplicate ? `${storeowner.razao} - ${index}` : storeowner.razao)).sort()}
                placeholder="Nome do Lojista"
              />
            }
          />,
          <FormInput
            name="supplier"
            label="Fabricante"
            input={
              <Dropdown
                value={supplierName}
                onChange={({ target: { value } }) => {
                  if (value !== '') {
                    setSupplierName(value)
                    console.log('suppliers teste', suppliers)
                    const searched = suppliers.find(supplier => supplier.fabricante === value)
                    if (searched) {
                      setSupplier(searched)
                    } else {
                      setSupplier({})
                      setBank({})
                    }
                  } else {
                    setSupplierName('')
                    setSupplier({})
                    setBank({})
                  }
                }}
                onChangeKeyboard={element => {
                  if (element && element.value !== '') {
                    setSupplierName(element.value)
                    const searched = suppliers.find(supplier => supplier.fabricante === element.value)
                    if (searched) {
                      setSupplier(searched)
                    } else {
                      setSupplier({})
                      setBank({})
                    }
                  } else {
                    setSupplierName('')
                    setSupplier({})
                    setBank({})
                  }
                }}
                list={suppliers.map((supplier, index) => (supplier.duplicate ? `${supplier.fabricante} - ${index}` : supplier.fabricante)).sort()}
                placeholder="Nome do fabricante"
              />
            }
          />,
          <FormInput name="totalAmount" label="Valor do cheque" input={<InputMoney value={totalAmount} setValue={setTotalAmount} />} />,

          <FormInput
            name="dateBankCheckEntry"
            label="Bom para"
            input={
              <InputText
                value={bankCheckDate}
                onChange={({ target: { value } }) => setBankCheckDate(value)}
                placeholder="Data que será depositado o cheque"
                type="date"
                min={`${workDate.getFullYear()}-${`0${workDate.getMonth() + 1}`.slice(-2)}-${`0${workDate.getDate()}`.slice(-2)}`}
              />
            }
          />,
          <FormInput
            name="photoBankCheckEntry"
            label="Foto do Cheque"
            input={
              <SingleImageUpload
                setFile={setBankCheckEntry}
                filename={filenameBankCheckEntry || ''}
                setFilename={setFilenameBankCheckEntry}
                indexOfFile={0}
              />
            }
          />,
          <FormInput
            name="note"
            label="Observação"
            input={<InputText value={note} onChange={({ target: { value } }) => setNote(value)} placeholder="Observações sobre o link" />}
          />,
        ]}
      />
    </motion.div>
  )
}

export default BankCheckEntry
