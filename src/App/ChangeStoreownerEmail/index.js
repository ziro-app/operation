import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import InputEmail from '@bit/vitorbarbosa19.ziro.input-email'
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Form
                validations={validations}
                sendToBackend={sendToBackend ? sendToBackend(state) : () => null}
                inputs={[
                    <FormInput name='email' label='Email atual' input={
                        <InputEmail
                            value={email}
                            setValue={setEmail}
                            placeholder='Email atual do usuário'
                        />
                    } />,
                    <FormInput name='newEmail' label='Novo email' input={
                        <InputEmail
                            value={newEmail}
                            setValue={setNewEmail}
                            placeholder='Novo email do usuário'
                        />
                    } />
                ]}
            />
        </motion.div>
    )
}

export default ChangeStoreownerEmail
