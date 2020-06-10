import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner'
import Error from '@bit/vitorbarbosa19.ziro.error'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import InputText from '@bit/vitorbarbosa19.ziro.input-text'
import maskInput from '@ziro/mask-input'
import currencyFormat from '@ziro/currency-format'
import SingleImageUpload from '../SingleImageUpload/index'
import fetch from './fetch'
import sendToBackend from './sendToBackend'
import matchForm from './matchForm'

const LinkRequest = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    // APLICADO NOS DOIS
    const [totalAmount, setTotalAmount] = useState('')
    const [type, setType] = useState('')
    const typeList = ['Cartão de Crédito', 'TED']
    const [storeowners, setStoreowners] = useState([])
    const [storeowner, setStoreowner] = useState({ 'razao': '' })
    const [storeownerName, setStoreownerName] = useState('')
    const [banks, setBanks] = useState([])
    const [bank, setBank] = useState({ 'fabricante': '', 'banco': '', 'agencia': '', 'conta': '', 'razao': '', 'cnpj': '' })
    const [suppliers, setSuppliers] = useState([])
    const [supplier, setSupplier] = useState({ 'fabricante': '' })
    const [supplierName, setSupplierName] = useState('')
    const [romaneio, setRomaneio] = useState('')
    const [filename, setFilename] = useState('')
    const [beneficiary, setBeneficiary] = useState('')
    const [beneficiaryDocument, setBeneficiaryDocument] = useState('')
    const [bankName, setBankName] = useState('')
    const [accountNumber, setAccountNumber] = useState('')
    const [agency, setAgency] = useState('')

    // DADOS DO CARTÃO
    const [installment, setInstallment] = useState('')
    const installments = ['1', '2', '3', '4', '5', '6']
    const [discount, setDiscount] = useState('')
    const [paymentType, setPaymentType] = useState('')

    // DADOS DO TED
    const [hasCommission, setHasCommission] = useState('')
    const [commissionValue, setCommissionValue] = useState('')

    const setState = {
        setTotalAmount, setType, setStoreowner, setStoreownerName, setSupplier, setSupplierName,
        setRomaneio, setFilename, setInstallment, setDiscount, setPaymentType, setBeneficiary, setBeneficiaryDocument,
        setBankName, setAccountNumber, setAgency, setBanks, setBank, setHasCommission, setCommissionValue
    }
    const state = {
        totalAmount, type, storeowner, storeownerName, supplier, supplierName, romaneio,
        installment, installments, discount, paymentType, beneficiary, beneficiaryDocument, bankName,
        accountNumber, agency, banks, bank, hasCommission, commissionValue, ...setState
    }

    const validations = [
        {
            name: 'type',
            validation: value => typeList.includes(value),
            value: type,
            message: 'Tipo inválido'
        }, {
            name: 'totalAmount',
            validation: value => !!value,
            value: totalAmount,
            message: 'Campo obrigatório'
        }, {
            name: 'storeowner',
            validation: value => storeowners.find(storeowner => storeowner.razao === value),
            value: storeownerName,
            message: 'Lojista inválido'
        }, {
            name: 'supplier',
            validation: value => suppliers.find(supplier => supplier.fabricante === value),
            value: supplierName,
            message: 'Fabricante inválido'
        }, {
            name: 'romaneio',
            validation: value => value !== undefined && value !== '' && /(\.jpg|\.jpeg|\.png)$/.test(value.name),
            value: romaneio,
            message: 'Formatos válidos: .png, .jpg e .jpeg'
        }, {
            name: 'installment',
            validation: value => type === 'Cartão de Crédito' ? value !== '' && installments.includes(value) : true,
            value: installment,
            message: 'Campo obrigatório'
        }, {
            name: 'paymentType',
            validation: value => type === 'Cartão de Crédito' ? ['TED', 'Cheque'].includes(value) : true,
            value: paymentType,
            message: 'Meio de pagamento inválido'
        }, {
            name: 'paymentType',
            validation: value => type === 'Cartão de Crédito' ? ['TED', 'Cheque'].includes(value) : true,
            value: paymentType,
            message: 'Meio de pagamento inválido'
        }, {
            name: 'beneficiary',
            validation: value => (type === 'TED' || paymentType === 'TED') ? !!value : true,
            value: beneficiary,
            message: 'Campo obrigatório'
        }, {
            name: 'beneficiaryDocument',
            validation: value => (type === 'TED' || paymentType === 'TED') ? /(^\d{3}\.\d{3}\.\d{3}\-\d{2}$)|(^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$)/.test(value) : true,
            value: beneficiaryDocument,
            message: 'Documento inválido'
        }, {
            name: 'bankName',
            validation: value => (type === 'TED' || paymentType === 'TED') ? !!value : true,
            value: bankName,
            message: 'Campo obrigatório'
        }, {
            name: 'accountNumber',
            validation: value => (type === 'TED' || paymentType === 'TED') ? !!value : true,
            value: accountNumber,
            message: 'Campo obrigatório'
        }, {
            name: 'agency',
            validation: value => (type === 'TED' || paymentType === 'TED') ? !!value : true,
            value: agency,
            message: 'Campo obrigatório'
        }, {
            name: 'discount',
            validation: value => type === 'Cartão de Crédito' ? !!value : true,
            value: discount,
            message: 'Campo obrigatório'
        }, {
            name: 'hasCommission',
            validation: value => type === 'TED' ? ['Sim', 'Não'].includes(value) : true,
            value: hasCommission,
            message: 'Campo obrigatório'
        }, {
            name: 'commissionValue',
            validation: value => type === 'TED' && hasCommission === 'Sim' ? !!value : true,
            value: commissionValue,
            message: 'Campo obrigatório'
        }
    ]

    const clearFields = () => {
        setTotalAmount('')
        setStoreowner({})
        setStoreownerName('')
        setSupplier({})
        setSupplierName('')
        setRomaneio('')
        setFilename('')
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
    }

    useEffect(() => fetch(setIsLoading, setIsError, setStoreowners, setBanks, setSuppliers), [])

    if (isLoading) return <div style={{ display: 'grid' }}><Spinner size='5rem' /></div>
    if (isError) return <Error />

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Form
                validations={validations}
                sendToBackend={sendToBackend ? sendToBackend(state) : () => null}
                inputs={[
                    <FormInput name='type' label='Tipo' input={
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
                            }
                            }
                            readOnly={true}
                            list={typeList}
                            placeholder="Tipo da Transação"
                        />}
                    />,
                    <FormInput name='totalAmount' label={(type === 'Cartão de Crédito' || type === '') ? 'Valor sem desconto' : 'Valor do TED Recebido'} input={
                        <InputText
                            value={currencyFormat(totalAmount)}
                            onChange={({ target: { value } }) => {
                                const toInteger = parseInt(value.replace(/[R$\.,]/g, ''), 10)
                                setTotalAmount(maskInput(toInteger, '#######', true))
                            }}
                            placeholder='R$ 100,00'
                            inputMode='numeric'
                        />
                    } />,
                    <FormInput name='storeowner' label='Lojista' input={
                        <Dropdown
                            value={storeownerName}
                            onChange={({ target: { value } }) => {
                                if (value !== '') {
                                    setStoreownerName(value)
                                    let searched = storeowners.find(storeowner => storeowner.razao === value)
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
                                    let searched = storeowners.find(storeowner => storeowner.razao === element.value)
                                    if (searched) {
                                        setStoreowner(searched)
                                    } else setStoreowner({})
                                } else {
                                    setStoreownerName('')
                                    setStoreowner({})
                                }
                            }
                            }
                            list={storeowners.map((storeowner, index) => storeowner.duplicate ? `${storeowner.razao} - ${index}` : storeowner.razao).sort()}
                            placeholder="Nome do Lojista"
                        />
                    } />,
                    <FormInput name='supplier' label='Fabricante' input={
                        <Dropdown
                            value={supplierName}
                            onChange={({ target: { value } }) => {
                                if (value !== '') {
                                    setSupplierName(value)
                                    let searched = suppliers.find(supplier => supplier.fabricante === value)
                                    if (searched) {
                                        setSupplier(searched)
                                        let searchedBank = banks.find(bank => bank.fabricante === value)
                                        if (searchedBank) {
                                            setBank(searchedBank)
                                            setBeneficiary(searchedBank.razao)
                                            setBeneficiaryDocument(maskInput(searchedBank.cnpj, '##.###.###/####-##', true))
                                            setBankName(searchedBank.banco)
                                            setAccountNumber(searchedBank.conta)
                                            setAgency(searchedBank.agencia)
                                        }
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
                                    let searched = suppliers.find(supplier => supplier.fabricante === element.value)
                                    if (searched) {
                                        setSupplier(searched)
                                        let searchedBank = banks.find(bank => bank.fabricante === element.value)
                                        if (searchedBank) {
                                            setBank(searchedBank)
                                            setBeneficiary(searchedBank.razao)
                                            setBeneficiaryDocument(maskInput(searchedBank.cnpj, '##.###.###/####-##', true))
                                            setBankName(searchedBank.banco)
                                            setAccountNumber(searchedBank.conta)
                                            setAgency(searchedBank.agencia)
                                        }
                                    } else {
                                        setSupplier({})
                                        setBank({})
                                    }
                                } else {
                                    setSupplierName('')
                                    setSupplier({})
                                    setBank({})
                                }
                            }
                            }
                            list={suppliers.map((supplier, index) => supplier.duplicate ? `${supplier.fabricante} - ${index}` : supplier.fabricante).sort()}
                            placeholder="Nome do fabricante"
                        />
                    } />,
                    <FormInput name='romaneio' label='Foto do Romaneio' input={
                        <SingleImageUpload
                            setFile={setRomaneio}
                            filename={filename ? filename : ''}
                            setFilename={setFilename}
                            indexOfFile={0}
                        />
                    } />,
                    ...matchForm(state)
                ]}
            />
        </motion.div>
    )
}

export default LinkRequest