import React from 'react'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import InputText from '@bit/vitorbarbosa19.ziro.input-text'
import Calendar from '@bit/vitorbarbosa19.ziro.calendar'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import capitalize from '@ziro/capitalize'
import maskInput from '@ziro/mask-input'

const cardForm = ({ installment, setInstallment, installments, discount, setDiscount, paymentType, setPaymentType, bank, bankName, setBankName, accountNumber, setAccountNumber, agency, setAgency, beneficiary, setBeneficiary, beneficiaryDocument, setBeneficiaryDocument }) => {
    const fields = [
        <FormInput name='installment' label='Parcelas' input={
            <Dropdown
                value={installment}
                onChange={({ target: { value } }) => setInstallment(value)}
                onChangeKeyboard={element =>
                    element ? setInstallment(element.value) : null
                }
                list={installments}
                placeholder="Quantidade de parcelas"
            />
        } />,
        <FormInput name='discount' label='Desconto à vista' input={
            <InputText
                value={discount ? `% ${discount}` : ''}
                onChange={({ target: { value } }) => {
                    let newPrctg = value.replace(/\s/g, '').replace('%', '').replace(',', '.')
                    setDiscount(newPrctg)
                }}
                placeholder='% 0.00'
                inputMode='numeric'
            />
        } />,
        <FormInput name='paymentType' label='Tipo de Pagamento' input={
            <Dropdown
                value={paymentType}
                readOnly={true}
                onChange={({ target: { value } }) => setPaymentType(value)}
                onChangeKeyboard={element =>
                    element ? setPaymentType(element.value) : null
                }
                list={['TED', 'Cheque']}
                placeholder="TED ou Cheque"
            />
        } />,
        paymentType === 'TED' ? <FormInput name='beneficiary' label='Beneficiário' input={
            <InputText
                value={beneficiary}
                onChange={({ target: { value } }) => bank.razao ? () => null : setBeneficiary(capitalize(value))}
                placeholder='Nome do beneficiário'
                disabled={bank.razao ? true : false}
            />
        } /> : <FormInput name='' label='' input={<></>} />,
        paymentType === 'TED' ? <FormInput name='beneficiaryDocument' label='Documento' input={
            <InputText
                value={beneficiaryDocument}
                onChange={({ target: { value } }) => {
                    if (bank.cnpj) () => null
                    else {
                        let mask = value.length <= 14 ? '###.###.###-##' : '##.###.###/####-##'
                        setBeneficiaryDocument(maskInput(value, mask, true))
                    }
                }}
                placeholder='CPF ou CNPJ'
                inputMode='numeric'
                disabled={bank.cnpj ? true : false}
            />
        } /> : <FormInput name='' label='' input={<></>} />,
        paymentType === 'TED' ? <FormInput name='bankName' label='Nome do Banco' input={
            <InputText
                value={bankName}
                onChange={({ target: { value } }) => bank.banco ? () => null : setBankName(value.toUpperCase())}
                placeholder='Ex.: BANCO DO BRASIL'
                disabled={bank.banco ? true : false}
            />
        } /> : <FormInput name='' label='' input={<></>} />,
        paymentType === 'TED' ? <FormInput name='accountNumber' label='Número da Conta' input={
            <InputText
                value={accountNumber}
                onChange={({ target: { value } }) => bank.conta ? () => null : setAccountNumber(value)}
                placeholder='Ex.: 14637-8'
                inputMode='numeric'
                disabled={bank.conta ? true : false}
            />
        } /> : <FormInput name='' label='' input={<></>} />,
        paymentType === 'TED' ? <FormInput name='agency' label='Número da Agência' input={
            <InputText
                value={agency}
                onChange={({ target: { value } }) => bank.agencia ? () => null : setAgency(value)}
                placeholder='Ex.: 1463-8'
                inputMode='numeric'
                disabled={bank.agencia ? true : false}
            />
        } /> : <FormInput name='' label='' input={<></>} />
    ]
    return fields
}

const tedForm = ({ hasCommission, setHasCommission, commissionValue, setCommissionValue, bank, bankName, setBankName, accountNumber, setAccountNumber, agency, setAgency, beneficiary, setBeneficiary, beneficiaryDocument, setBeneficiaryDocument }) => {
    const fields = [
        <FormInput name='beneficiary' label='Beneficiário' input={
            <InputText
                value={beneficiary}
                onChange={({ target: { value } }) => bank.razao ? () => null : setBeneficiary(capitalize(value))}
                placeholder='Nome do beneficiário'
                disabled={bank.razao ? true : false}
            />
        } />,
        <FormInput name='beneficiaryDocument' label='Documento' input={
            <InputText
                value={beneficiaryDocument}
                onChange={({ target: { value } }) => {
                    if (bank.cnpj) () => null
                    else {
                        let mask = value.length <= 14 ? '###.###.###-##' : '##.###.###/####-##'
                        setBeneficiaryDocument(maskInput(value, mask, true))
                    }
                }}
                placeholder='CPF ou CNPJ'
                inputMode='numeric'
                disabled={bank.cnpj ? true : false}
            />
        } />,
        <FormInput name='bankName' label='Nome do Banco' input={
            <InputText
                value={bankName}
                onChange={({ target: { value } }) => bank.banco ? () => null : setBankName(value.toUpperCase())}
                placeholder='Ex.: BANCO DO BRASIL'
                disabled={bank.banco ? true : false}
            />
        } />,
        <FormInput name='accountNumber' label='Número da Conta' input={
            <InputText
                value={accountNumber}
                onChange={({ target: { value } }) => bank.conta ? () => null : setAccountNumber(value)}
                placeholder='Ex.: 14637-8'
                inputMode='numeric'
                disabled={bank.conta ? true : false}
            />
        } />,
        <FormInput name='agency' label='Número da Agência' input={
            <InputText
                value={agency}
                onChange={({ target: { value } }) => bank.agencia ? () => null : setAgency(value)}
                placeholder='Ex.: 1463-8'
                inputMode='numeric'
                disabled={bank.agencia ? true : false}
            />
        } />,
        <FormInput name='hasCommission' label='Descontado comissão?' input={
            <Dropdown
                value={hasCommission}
                onChange={({ target: { value } }) => setHasCommission(value)}
                onChangeKeyboard={element =>
                    element ? setHasCommission(element.value) : null
                }
                list={['Sim', 'Não']}
                placeholder="Sim ou Não"
            />
        } />,
        hasCommission === 'Sim' ? <FormInput name='commissionValue' label='Valor da comissão' input={
            <InputText
                value={commissionValue ? `% ${commissionValue}` : ''}
                onChange={({ target: { value } }) => {
                    let newPrctg = value.replace(/\s/g, '').replace('%', '').replace(',', '.')
                    setCommissionValue(newPrctg)
                }}
                placeholder='% 0.00'
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
    const { type } = state
    if (type === '') return [<FormInput name='' label='' input={<></>} />]
    if (type === 'Cartão de Crédito') return cardForm(state)
    if (type === 'TED') return tedForm(state)
}

export default matchForm