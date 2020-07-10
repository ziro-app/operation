import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Error from '@bit/vitorbarbosa19.ziro.error'
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import Calendar from '@bit/vitorbarbosa19.ziro.calendar'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner'
import sendToBackend from './sendToBackend'
import fetch from './fetch'

const DeleteUser = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState({ 'nome': '', 'email': '', 'row': '' });
    const [selectedName, setSelectedName] = useState('');
    const [endDate, setEndDate] = useState('');
    const [focused, setFocused] = useState(false);
    const setState = { setUsers, setSelectedUser, setSelectedName, setEndDate };
    const state = { users, selectedUser, selectedName, endDate, ...setState };
    const validations = [
        {
            name: 'selectedName',
            validation: value => users.find(user => user.name === value) !== undefined,
            value: selectedName,
            message: 'Campo obrigatório'
        }, {
            name: 'endDate',
            validation: value => !!value && /^(?:(?:31(\/)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/.test(value), // tests for min length of 3 char
            value: endDate,
            message: 'Campo obrigatório'
        }
    ]

    useEffect(() => fetch(setIsLoading, setIsError, setUsers), [])

    if (isLoading) return <div style={{ display: 'grid' }}><Spinner size='5rem' /></div>
    if (isError) return <Error />

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Form
                validations={validations}
                sendToBackend={sendToBackend ? sendToBackend(state) : () => null}
                inputs={[
                    <FormInput name='selectedName' label='Nome do Usuário' input={
                        <Dropdown
                            value={selectedName}
                            onChange={({ target: { value } }) => {
                                setSelectedName(value);
                                const user = users.find(user => user.name === value);
                                if (user) setSelectedUser(user);
                            }}
                            onChangeKeyboard={element => {
                                if (element && element.value) {
                                    setSelectedName(element.value);
                                    const user = users.find(user => user.name === element.value);
                                    if (user) setSelectedUser(user);
                                }
                            }
                            }
                            list={users.map(user => user.name).sort()}
                            placeholder="Atuais usuários"
                        />
                    } />,
                    <FormInput name='endDate' label='Data fim' input={
                        <Calendar
                            inputDate={endDate}
                            setInputDate={setEndDate}
                            focused={focused}
                            setFocused={setFocused}
                            placeholder='Data de saída do usuário' />
                    } />
                ]}
            />
        </motion.div>
    )
}

export default DeleteUser
