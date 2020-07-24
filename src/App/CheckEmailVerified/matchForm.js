import React from 'react'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import InputText from '@bit/vitorbarbosa19.ziro.input-text'
import InputEmail from '@bit/vitorbarbosa19.ziro.input-email'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import maskInput from '@ziro/mask-input'

const documentForm = ({ app, setApp, appList, cnpj, setCnpj }) => {
    const fields = [
        <FormInput name='app' label='Aplicativo utilizado' input={
            <Dropdown
                value={app}
                onChange={({ target: { value } }) => setApp(value)}
                onChangeKeyboard={element => element ? setApp(element.value) : null}
                readOnly={true}
                list={appList}
                placeholder="App do usuário"
            />}
        />,
        <FormInput name='cnpj' label='CNPJ' input={
            <InputText
                value={cnpj}
                onChange={({ target: { value } }) => setCnpj(maskInput(value, '##.###.###/####-##', true))}
                placeholder='00.000.000/0000-00'
                inputMode='numeric'
            />
        } />
    ]
    return fields
}

const emailForm = ({ email, setEmail }) => {
    const fields = [
        <FormInput name='email' label='Email' input={
            <InputEmail
                value={email}
                setValue={setEmail}
                placeholder='Email do usuário referido'
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
