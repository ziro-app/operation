import React from 'react'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import InputText from '@bit/vitorbarbosa19.ziro.input-text'
import InputEmail from '@bit/vitorbarbosa19.ziro.input-email'
import maskInput from '@ziro/mask-input'

const documentForm = ({ cnpj, setCnpj, percentage, setPercentage }) => {
    const fields = [
        <FormInput name='cnpj' label='CNPJ' input={
            <InputText
                value={cnpj}
                onChange={({ target: { value } }) => setCnpj(maskInput(value, '##.###.###/####-##', true))}
                placeholder='00.000.000/0000-00'
                inputMode='numeric'
            />
        } />,
        <FormInput name='percentage' label='Nova porcentagem' input={
            <InputText
                value={percentage ? `% ${percentage}` : ''}
                onChange={({ target: { value } }) => {
                    let newPrctg = value.replace(/\s/g, '').replace('%', '').replace(',', '.');
                    setPercentage(newPrctg)
                }}
                placeholder='% 0.00'
                inputMode='numeric'
            />
        } />
    ]
    return fields
}

const emailForm = ({ email, setEmail, percentage, setPercentage }) => {
    const fields = [
        <FormInput name='email' label='Email' input={
            <InputEmail
                value={email}
                setValue={setEmail}
                placeholder='Email do usuário referido'
            />
        } />,
        <FormInput name='percentage' label='Nova porcentagem' input={
            <InputText
                value={percentage ? `% ${percentage}` : ''}
                onChange={({ target: { value } }) => {
                    let newPrctg = value.replace(/\s/g, '').replace('%', '').replace(',', '.');
                    setPercentage(newPrctg)
                }}
                placeholder='% 0.00'
                inputMode='numeric'
            />
        } />
    ]
    return fields
}

const matchForm = (state) => {
    const { type } = state;
    if (type === '') return [<FormInput name='' label='' input={<></>} />]
    if (type === 'CNPJ') return documentForm(state)
    if (type === 'Email') return emailForm(state)
}

export default matchForm
