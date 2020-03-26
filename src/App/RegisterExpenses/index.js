import React, { useState, useEffect, useContext } from 'react'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner'
import Error from '@bit/vitorbarbosa19.ziro.error'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import Calendar from '@bit/vitorbarbosa19.ziro.calendar'
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import InputText from '@bit/vitorbarbosa19.ziro.input-text'
import fetch from './fetch'
import sendToBackend from './sendToBackend'
import { userContext } from '../appContext'

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
    const [bankName, setBankName] = useState('')
    const [accountNumber, setAccountNumber] = useState('')
    const [agency, setAgency] = useState('')
    const [date, setDate] = useState('')
    const [focusDate, setFocusDate] = useState(false)

    // DADOS DO OPERACIONAL
    const [operationalDescription, setOperacionalDescription] = useState('')
    const ODList = ['MARCOS MOTOBOY', 'CORREIOS SEDEX', 'CORREIOS PAC', '99TAXI', 'AZUL CARGO', 'LOGGI', 'GOLLOG', 'TAXI', 'UBER', 'OUTROS'].sort()
    const [attendance, setAttendance] = useState('')
    const [attendanceList, setAttendanceList] = useState([])
    const [haveRefund, setHaveRefund] = useState('')
    const refoundList = ['Sim', 'Não']
    const [note, setNote] = useState('')

    // DADOS DO COMUM
    const [commonDescription, setCommonDescription] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('')
    const paymentMethodList = ['Cartão de Crédito', 'Dinheiro', 'Cartão de Débito', 'Boleto'].sort()
    const [numberOfInstallments, setNumberOfInstallments] = useState('')

    const setState = { setExpenseAmount, setType, setOperacionalDescription, setDate, setAttendance, setHaveRefund, setNote, setCommonDescription, setPaymentMethod, setNumberOfInstallments, setBankTransfer, setBankName, setAccountNumber, setAgency }
    const state = { nickname, expenseAmount, type, operationalDescription, date, attendance, haveRefund, note, commonDescription, paymentMethod, numberOfInstallments, bankTransfer, bankName, accountNumber, agency, ...setState }
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
            validation: value => type === 'Operacional'? ODList.includes(value) : true,
            value: operationalDescription,
            message: 'Descrição inválida'
        }, {
            name: 'attendance',
            validation: value => type === 'Operacional'? attendanceList.includes(value) : true,
            value: attendance,
            message: 'Atendimento inválido'
        }, {
            name: 'value',
            validation: value => (/[0-9]+/g).test(value),
            value: expenseAmount,
            message: 'Valor inválido'
        }, {
            name: 'paymentMethod',
            validation: value => type === 'Comum'? paymentMethodList.includes(value) : true,
            value: paymentMethod,
            message: 'Meio de pagamento inválido'
        }, {
            name: 'haveRefund',
            validation: value => type === 'Operacional'? refoundList.includes(value) : true,
            value: haveRefund,
            message: 'Valor inválido'
        }, {
            name: 'commonDescription',
            validation: value => type === 'Comum'? !!value : true,
            value: commonDescription,
            message: 'Descrição inválida'
        }, {
            name: 'bankTransfer',
            validation: value => bankTransferList.includes(value),
            value: bankTransfer,
            message: 'Opção inválida'
        }, {
            name: 'bankName',
            validation: value => bankTransfer === 'Sim'? !!value : true,
            value: bankName,
            message: 'Campo inválido'
        }, {
            name: 'accountNumber',
            validation: value => bankTransfer === 'Sim'? !!value : true,
            value: accountNumber,
            message: 'Campo inválida'
        }, {
            name: 'agency',
            validation: value => bankTransfer === 'Sim'? !!value : true,
            value: agency,
            message: 'Campo inválida'
        }
    ]

    const operationalForm = () => {
        return(
        <Form
        validations={validations}
        sendToBackend={sendToBackend? sendToBackend(state) : () => null}
        inputs={[
            <FormInput name='attendance' label='Atendimento' input={
                <Dropdown
                    value={attendance}
                    onChange={({ target: { value } }) => setAttendance(value)}
                    onChangeKeyboard={element =>
                        element ? setAttendance(element.value) : null
                    }
                    list={attendanceList}
                    placeholder="Atendimento referido"
                />
            } />,
            <FormInput name='date' label={'Data do despacho'} input={
                <Calendar
                    inputDate={date}
                    setInputDate={setDate}
                    focused={focusDate}
                    setFocused={setFocusDate}
                    placeholder={'01/01/2020'}
                    outsideRange={true}
                    before={true}
                />
            } />,
            <FormInput name='operationalDescription' label='Descrição' input={
                <Dropdown
                    value={operationalDescription}
                    onChange={({ target: { value } }) => setOperacionalDescription(value)}
                    onChangeKeyboard={element =>
                        element ? setOperacionalDescription(element.value) : null
                    }
                    list={ODList}
                    placeholder="Se 'Outros', detalhar nas observações"
                />
            } />,
            <FormInput name='haveRefund' label='Haverá reembolso?' input={
                <Dropdown
                    value={haveRefund}
                    readOnly={true}
                    onChange={({ target: { value } }) => setHaveRefund(value)}
                    onChangeKeyboard={element =>
                        element ? setHaveRefund(element.value) : null
                    }
                    list={refoundList}
                    placeholder="Sim ou não"
                />
            } />,
            <FormInput name='note' label='Observação' input={
                <InputText
                    value={note}
                    onChange={({ target: { value } }) => setNote(value)}
                    placeholder='Observações a respeito'
                />
            } />,
            <FormInput name='bankTransfer' label='Transferência bancária' input={
                <Dropdown
                    value={bankTransfer}
                    readOnly={true}
                    onChange={({ target: { value } }) => setBankTransfer(value)}
                    onChangeKeyboard={element =>
                        element ? setBankTransfer(element.value) : null
                    }
                    list={bankTransferList}
                    placeholder="Sim ou não"
                />
            } />,
            bankTransfer === 'Sim' ? <FormInput name='bankName' label='Nome do Banco' input={
                <InputText
                    value={bankName}
                    onChange={({ target: { value } }) => setBankName(value.toUpperCase())}
                    placeholder='Ex.: BANCO DO BRASIL'
                />
            } /> : <FormInput name='' label='' input={<></>}/>,
            bankTransfer === 'Sim' ? <FormInput name='accountNumber' label='Número da Conta' input={
                <InputText
                    value={accountNumber}
                    onChange={({ target: { value } }) => setAccountNumber(value)}
                    placeholder='Ex.: 14637-8'
                />
            } /> : <FormInput name='' label='' input={<></>}/>,
            bankTransfer === 'Sim' ? <FormInput name='agency' label='Número da Agência' input={
                <InputText
                    value={agency}
                    onChange={({ target: { value } }) => setAgency(value)}
                    placeholder='Ex.: 1463-8'
                />
            } /> : <FormInput name='' label='' input={<></>}/>
        ]}
        />
        )
    }

    const commonForm = () => {
        return(
            <Form
            validations={validations}
            sendToBackend={sendToBackend? sendToBackend(state) : () => null}
            inputs={[
                <FormInput name='commonDescription' label='Descrição' input={
                    <InputText
                        value={commonDescription}
                        onChange={({ target: { value } }) => setCommonDescription(value)}
                        placeholder='Preencha todos os detalhes necessários'
                    />
                } />,
                <FormInput name='paymentMethod' label='Pagamento' input={
                    <Dropdown
                        value={paymentMethod}
                        onChange={({ target: { value } }) => setPaymentMethod(value)}
                        onChangeKeyboard={element =>
                            element ? setPaymentMethod(element.value) : null
                        }
                        list={paymentMethodList}
                        placeholder="Forma de pagamento"
                    />
                } />,
                <FormInput name='numberOfInstallments' label='Quantidade de parcelas' input={
                    <InputText
                        value={numberOfInstallments}
                        onChange={({ target: {value} }) => setNumberOfInstallments(value)}
                        readOnly={false}
                        placeholder='Apenas se maior que 1'
                    />
                } />,
                <FormInput name='date' label={'Data de vencimento do boleto'} input={
                    <Calendar
                        inputDate={date}
                        setInputDate={setDate}
                        focused={focusDate}
                        setFocused={setFocusDate}
                        placeholder={'01/01/2020'}
                        outsideRange={true}
                        before={true}
                    />
                } />,
                <FormInput name='bankTransfer' label='Transferência bancária' input={
                    <Dropdown
                        value={bankTransfer}
                        readOnly={true}
                        onChange={({ target: { value } }) => setBankTransfer(value)}
                        onChangeKeyboard={element =>
                            element ? setBankTransfer(element.value) : null
                        }
                        list={bankTransferList}
                        placeholder="Sim ou não"
                    />
                } />,
                bankTransfer === 'Sim' ? <FormInput name='bankName' label='Nome do Banco' input={
                    <InputText
                        value={bankName}
                        onChange={({ target: { value } }) => setBankName(value.toUpperCase())}
                        placeholder='Ex.: BANCO DO BRASIL'
                    />
                } /> : <FormInput name='' label='' input={<></>}/>,
                bankTransfer === 'Sim' ? <FormInput name='accountNumber' label='Número da Conta' input={
                    <InputText
                        value={accountNumber}
                        onChange={({ target: { value } }) => setAccountNumber(value)}
                        placeholder='Ex.: 14637-8'
                    />
                } /> : <FormInput name='' label='' input={<></>}/>,
                bankTransfer === 'Sim' ? <FormInput name='agency' label='Número da Agência' input={
                    <InputText
                        value={agency}
                        onChange={({ target: { value } }) => setAgency(value)}
                        placeholder='Ex.: 1463-8'
                    />
                } /> : <FormInput name='' label='' input={<></>}/>
            ]}
            />
        )
    }

    const clearFields = () => {
        setBankTransfer('')
        setOperacionalDescription('')
        setAttendance('')
        setHaveRefund('')
        setNote('')
        setCommonDescription('')
        setDate('')
        setFocusDate(false)
        setPaymentMethod('')
        setNumberOfInstallments('')
    }

    useEffect(() => fetch(setIsLoading, setIsError, setAttendanceList), [])

    if (isLoading) return <div style={{ display: 'grid' }}><Spinner size='5rem' /></div>
    if (isError) return <Error />

    return (
        <>
            <div style={{display: 'grid',gridRowGap: '2px'}}>
                <FormInput name='expenseAmount' label='Valor' input={
                    <InputText
                        value={expenseAmount}
                        onChange={({ target: { value } }) => setExpenseAmount(value)}
                        placeholder='Separe os centavos com vírgula'
                    />
                } />
                <FormInput name='type' label='Tipo' input={
                    <Dropdown
                        value={type}
                        onChange={({ target: { value } }) => {
                            setType(value)
                            clearFields()
                        }}
                        onChangeKeyboard={element => {
                            if(element){
                                setType(element.value)
                                clearFields()
                            } else null
                        }
                        }
                        readOnly={true}
                        list={typeList}
                        placeholder="Tipo da despesa"
                    />
                } />
            </div>
            {type === 'Operacional' && operationalForm()}
            {type === 'Comum' && commonForm()}
        </>
    )
}

export default RegisterExpenses
