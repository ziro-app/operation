import React, { useState } from 'react'
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import InputText from '@bit/vitorbarbosa19.ziro.input-text'
import sendToBackend from './sendToBackend'

const ChangeStoreownerEmail = () => {
    const [email, setEmail] = useState('')
    const [newEmail, setNewEmail] = useState('')
    const state = { email, newEmail, setEmail, setNewEmail }
    const validations = [
        {
            name: 'email',
            validation: value => /^\S+@\S+\.\S+$/g.test(value), // tests for pattern a@b.c
            value: email,
            message: 'Formato inválido'
        }, {
            name: 'newEmail',
            validation: value => /^\S+@\S+\.\S+$/g.test(value) && value !== email,
            value: newEmail,
            message: email === newEmail ? 'Deve ser diferente do anterior' : 'Formato inválido'
        }
    ]
    return (
        <Form
            validations={validations}
            sendToBackend={sendToBackend ? sendToBackend(state) : () => null}
            inputs={[
                <FormInput name='email' label='Email atual' input={
                    <InputText
                        value={email}
                        onChange={({ target: { value } }) => setEmail(value ? value.toLowerCase() : '')}
                        placeholder='Email atual do usuário'
                        inputMode='email'
                        autoComplete='email'
                    />
                } />,
                <FormInput name='newEmail' label='Novo email' input={
                    <InputText
                        value={newEmail}
                        onChange={({ target: { value } }) => setNewEmail(value ? value.toLowerCase() : '')}
                        placeholder='Novo email do usuário'
                        inputMode='email'
                        autoComplete='email'
                    />
                } />
            ]}
        />
    )
}

export default ChangeStoreownerEmail
