import React from 'react'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import InputText from '@bit/vitorbarbosa19.ziro.input-text'
import Calendar from '@bit/vitorbarbosa19.ziro.calendar'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import capitalize from '@ziro/capitalize'
import maskInput from '@ziro/mask-input'

const operationalForm = ({ attendance, setAttendance, attendanceList, date, setDate, focusDate, setFocusDate, operationalDescription, setOperacionalDescription, ODList, note, setNote, haveRefound, setHaveRefound, refoundList, bankTransfer, setBankTransfer, bankTransferList, bankName, setBankName, accountNumber, setAccountNumber, agency, setAgency, beneficiary, setBeneficiary, beneficiaryDocument, setBeneficiaryDocument }) => {
    const fields = [
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
                outsideRange={false}
                before={true}
            />
        } />,
        <FormInput name='operationalDescription' label='Favorecido' input={
            <Dropdown
                value={operationalDescription}
                onChange={({ target: { value } }) => {
                    setOperacionalDescription(value)
                    if (value === 'CLIENTES') setHaveRefound('Não')
                }}
                onChangeKeyboard={element =>
                    element ? setOperacionalDescription(element.value) : null
                }
                list={ODList}
                placeholder="Se 'Clientes', detalhar nas observações"
            />
        } />,
        <FormInput name='note' label='Observação' input={
            <InputText
                value={note}
                onChange={({ target: { value } }) => setNote(value)}
                placeholder='Observações a respeito'
            />
        } />,
        <FormInput name='haveRefound' label='Haverá reembolso?' input={
            <Dropdown
                value={haveRefound}
                readOnly={true}
                onChange={operationalDescription === 'CLIENTES' ? () => { } : ({ target: { value } }) => setHaveRefound(value)}
                onChangeKeyboard={element =>
                    element ? setHaveRefound(element.value) : null
                }
                list={refoundList}
                placeholder="Sim ou não"
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
        bankTransfer === 'Sim' ? <FormInput name='beneficiary' label='Beneficiário' input={
            <InputText
                value={beneficiary}
                onChange={({ target: { value } }) => setBeneficiary(capitalize(value))}
                placeholder='Nome do beneficiário'
            />
        } /> : <FormInput name='' label='' input={<></>} />,
        bankTransfer === 'Sim' ? <FormInput name='beneficiaryDocument' label='Documento' input={
            <InputText
                value={beneficiaryDocument}
                onChange={({ target: { value } }) => {
                    let mask = value.length <= 14 ? '###.###.###-##' : '##.###.###/####-##'
                    setBeneficiaryDocument(maskInput(value, mask, true))
                }}
                placeholder='CPF ou CNPJ'
                inputMode='numeric'
            />
        } /> : <FormInput name='' label='' input={<></>} />,
        bankTransfer === 'Sim' ? <FormInput name='bankName' label='Nome do Banco' input={
            <InputText
                value={bankName}
                onChange={({ target: { value } }) => setBankName(value.toUpperCase())}
                placeholder='Ex.: BANCO DO BRASIL'
            />
        } /> : <FormInput name='' label='' input={<></>} />,
        bankTransfer === 'Sim' ? <FormInput name='accountNumber' label='Número da Conta' input={
            <InputText
                value={accountNumber}
                onChange={({ target: { value } }) => setAccountNumber(value)}
                placeholder='Ex.: 14637-8'
                inputMode='numeric'
            />
        } /> : <FormInput name='' label='' input={<></>} />,
        bankTransfer === 'Sim' ? <FormInput name='agency' label='Número da Agência' input={
            <InputText
                value={agency}
                onChange={({ target: { value } }) => setAgency(value)}
                placeholder='Ex.: 1463-8'
                inputMode='numeric'
            />
        } /> : <FormInput name='' label='' input={<></>} />
    ]
    return fields
}

const commonForm = ({ commonDescription, setCommonDescription, paymentMethod, setPaymentMethod, paymentMethodList }) => {
    const fields = [
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
        } />]
    return fields
}

const billetForm = ({ commonDescription, setCommonDescription, paymentMethod, setPaymentMethod,
    paymentMethodList, date, setDate, focusDate, setFocusDate }) => {
    const fields = [
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
        } />
    ]
    return fields
}

const creditCardForm = ({ commonDescription, setCommonDescription, paymentMethod, setPaymentMethod,
    paymentMethodList, numberOfInstallments, setNumberOfInstallments }) => {
    const fields = [
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
                onChange={({ target: { value } }) => setNumberOfInstallments(maskInput(value, '##', true))}
                readOnly={false}
                placeholder='Apenas se maior que 1'
                inputMode='numeric'
            />
        } />
    ]
    return fields
}

const debtOrMoney = ({ commonDescription, setCommonDescription, paymentMethod, setPaymentMethod,
    paymentMethodList }) => {
    const fields = [
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
        } />
    ]
    return fields
}

const bankTransferForm = ({ commonDescription, setCommonDescription, paymentMethod, setPaymentMethod,
    paymentMethodList, beneficiary, setBeneficiary, beneficiaryDocument,
    setBeneficiaryDocument, bankName, setBankName, accountNumber, setAccountNumber,
    agency, setAgency }) => {
    const fields = [
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
        <FormInput name='beneficiary' label='Beneficiário' input={
            <InputText
                value={beneficiary}
                onChange={({ target: { value } }) => setBeneficiary(capitalize(value))}
                placeholder='Nome do beneficiário'
            />
        } />,
        <FormInput name='beneficiaryDocument' label='Documento' input={
            <InputText
                value={beneficiaryDocument}
                onChange={({ target: { value } }) => {
                    let mask = value.length <= 14 ? '###.###.###-##' : '##.###.###/####-##'
                    setBeneficiaryDocument(maskInput(value, mask, true))
                }}
                placeholder='CPF ou CNPJ'
                inputMode='numeric'
            />
        } />,
        <FormInput name='bankName' label='Nome do Banco' input={
            <InputText
                value={bankName}
                onChange={({ target: { value } }) => setBankName(value.toUpperCase())}
                placeholder='Ex.: BANCO DO BRASIL'
            />
        } />,
        <FormInput name='accountNumber' label='Número da Conta' input={
            <InputText
                value={accountNumber}
                onChange={({ target: { value } }) => setAccountNumber(value)}
                placeholder='Ex.: 14637-8'
                inputMode='numeric'
            />
        } />,
        <FormInput name='agency' label='Número da Agência' input={
            <InputText
                value={agency}
                onChange={({ target: { value } }) => setAgency(value)}
                placeholder='Ex.: 1463-8'
                inputMode='numeric'
            />
        } />]
    return fields
}

const matchForm = (state) => {
    const { type, paymentMethod } = state
    if (type === '' && paymentMethod === '') return [<FormInput name='' label='' input={<></>} />]
    if (type === 'Operacional' && paymentMethod === '') return operationalForm(state)
    if (type === 'Comum' && paymentMethod === '') return commonForm(state)
    if (type === 'Comum' && paymentMethod === 'Boleto') return billetForm(state)
    if (type === 'Comum' && paymentMethod === 'Transferência Bancária') return bankTransferForm(state)
    if (type === 'Comum' && paymentMethod === 'Cartão de Crédito') return creditCardForm(state)
    if (type === 'Comum' && (paymentMethod === 'Cartão de Débito' || paymentMethod === 'Dinheiro')) return debtOrMoney(state)
}

export default matchForm
