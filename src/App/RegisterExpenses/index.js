import React, { useState, useEffect, useContext } from 'react'
import { motion } from 'framer-motion'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner'
import Error from '@bit/vitorbarbosa19.ziro.error'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import InputMoney from '@bit/vitorbarbosa19.ziro.input-money'
import fetch from './fetch'
import sendToBackend from './sendToBackend'
import matchForm from './matchForm'
import { userContext } from '../appContext'
import validateDocuments from '../utils/validateDocuments'

const RegisterExpenses = () => {
    const { nickname } = useContext(userContext)
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    // APLICADO NOS DOIS
    const [expenseAmount, setExpenseAmount] = useState('')
    const [type, setType] = useState('')
    const typeList = ['Operacional', 'Comum'].sort()
    const [bankTransfer, setBankTransfer] = useState('')
    const bankTransferList = ['Sim', 'Não']
    const [beneficiary, setBeneficiary] = useState('')
    const [beneficiaryDocument, setBeneficiaryDocument] = useState('')
    const [bankName, setBankName] = useState('')
    const [accountNumber, setAccountNumber] = useState('')
    const [agency, setAgency] = useState('')
    const [date, setDate] = useState('')
    const [focusDate, setFocusDate] = useState(false)
    // DADOS DO OPERACIONAL
    const [operationalDescription, setOperacionalDescription] = useState('')
    const ODList = ['M. MOTOBOY', 'CORREIOS SEDEX', 'CORREIOS PAC', '99TAXI', 'AZUL CARGO', 'LOGGI', 'GOLLOG', 'TAXI', 'UBER', 'CLIENTES'].sort()
    const [attendance, setAttendance] = useState('')
    const [attendanceList, setAttendanceList] = useState([])
    const [haveRefound, setHaveRefound] = useState('')
    const refoundList = ['Sim', 'Não']
    const [note, setNote] = useState('')
    // DADOS DO COMUM
    const [commonDescription, setCommonDescription] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('')
    const paymentMethodList = ['Cartão de Crédito', 'Dinheiro', 'Cartão de Débito', 'Boleto', 'Transferência Bancária'].sort()
    const [numberOfInstallments, setNumberOfInstallments] = useState('')
    const setState = { setExpenseAmount, setType, setOperacionalDescription, setDate, setFocusDate, setAttendance, setHaveRefound, setNote, setCommonDescription, setPaymentMethod, setNumberOfInstallments, setBankTransfer, setBankName, setAccountNumber, setAgency, setBeneficiary, setBeneficiaryDocument }
    const state = { nickname, paymentMethodList, expenseAmount, type, operationalDescription, ODList, date, focusDate, attendance, attendanceList, haveRefound, refoundList, note, commonDescription, paymentMethod, numberOfInstallments, bankTransfer, bankTransferList, bankName, accountNumber, agency, refoundList, beneficiary, beneficiaryDocument, ...setState }

    const validateCpfOrCnpj = (value) => /(^\d{3}\.\d{3}\.\d{3}\-\d{2}$)|(^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$)/.test(value) && (process.env.HOMOLOG ? true : validateDocuments(value));

    const validations = [
        {
            name: 'expenseAmount',
            validation: value => (/\d/g).test(value),
            value: expenseAmount,
            message: 'Valor inválido'
        }, {
            name: 'date',
            validation: value => paymentMethod !== 'Boleto' && value === '' || /^(?:(?:31(\/)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/.test(value),
            value: date,
            message: 'Data inválida'
        }, {
            name: 'type',
            validation: value => typeList.includes(value),
            value: type,
            message: 'Tipo inválido'
        }, {
            name: 'operationalDescription',
            validation: value => type === 'Operacional' ? ODList.includes(value) : true,
            value: operationalDescription,
            message: 'Favorecido inválido'
        }, {
            name: 'attendance',
            validation: value => type === 'Operacional' ? attendanceList.includes(value) : true,
            value: attendance,
            message: 'Atendimento inválido'
        }, {
            name: 'value',
            validation: value => (/[0-9]+/g).test(value),
            value: expenseAmount,
            message: 'Valor inválido'
        }, {
            name: 'paymentMethod',
            validation: value => type === 'Comum' ? paymentMethodList.includes(value) : true,
            value: paymentMethod,
            message: 'Meio de pagamento inválido'
        }, {
            name: 'haveRefound',
            validation: value => type === 'Operacional' ? refoundList.includes(value) : true,
            value: haveRefound,
            message: 'Valor inválido'
        }, {
            name: 'commonDescription',
            validation: value => type === 'Comum' ? !!value : true,
            value: commonDescription,
            message: 'Descrição inválida'
        }, {
            name: 'bankTransfer',
            validation: value => type === 'Operacional' ? bankTransferList.includes(value) : true,
            value: bankTransfer,
            message: 'Opção inválida'
        }, {
            name: 'bankName',
            validation: value => (paymentMethod === 'Transferência Bancária' || bankTransfer === 'Sim') ? !!value : true,
            value: bankName,
            message: 'Campo inválido'
        }, {
            name: 'accountNumber',
            validation: value => (paymentMethod === 'Transferência Bancária' || bankTransfer === 'Sim') ? !!value : true,
            value: accountNumber,
            message: 'Conta inválida'
        }, {
            name: 'agency',
            validation: value => (paymentMethod === 'Transferência Bancária' || bankTransfer === 'Sim') ? !!value : true,
            value: agency,
            message: 'Agência inválida'
        }, {
            name: 'note',
            validation: value => operationalDescription === 'CLIENTES' ? !!value : true,
            value: note,
            message: 'Campo obrigatório'
        }, {
            name: 'beneficiary',
            validation: value => (paymentMethod === 'Transferência Bancária' || bankTransfer === 'Sim') ? !!value : true,
            value: beneficiary,
            message: 'Campo obrigatório'
        }, {
            name: 'beneficiaryDocument',
            validation: value => (paymentMethod === 'Transferência Bancária' || bankTransfer === 'Sim') ? validateCpfOrCnpj(value) : true,
            value: beneficiaryDocument,
            message: 'Documento inválido'
        }, {
            name: 'numberOfInstallments',
            validation: value => paymentMethod === 'Cartão de Crédito' ? (/(^\d{1}$)/.test(value)) || (/(^\d{2}$)/.test(value) || value === '') : true,
            value: numberOfInstallments,
            message: 'Valor inválido'
        }
    ]

    const clearFields = () => {
        setBankTransfer('')
        setOperacionalDescription('')
        setAttendance('')
        setHaveRefound('')
        setNote('')
        setCommonDescription('')
        setDate('')
        setFocusDate(false)
        setPaymentMethod('')
        setNumberOfInstallments('')
        setBankName('')
        setAccountNumber('')
        setAgency('')
        setBeneficiary('')
        setBeneficiaryDocument('')
    }

    useEffect(() => fetch(setIsLoading, setIsError, setAttendanceList), [])

    if (isLoading) return <div style={{ display: 'grid' }}><Spinner size='5rem' /></div>
    if (isError) return <Error />

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Form
                validations={validations}
                sendToBackend={sendToBackend ? sendToBackend(state) : () => null}
                inputs={[
                    <FormInput name='expenseAmount' label='Valor' input={
                        <InputMoney
                            value={expenseAmount}
                            setValue={setExpenseAmount}
                        />
                    } />,
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
                            placeholder="Tipo da despesa"
                        />}
                    />,
                    ...matchForm(state)
                ]}
            />
        </motion.div>
    )
}

export default RegisterExpenses
