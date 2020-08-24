import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import matchForm from './matchForm'
import sendToBackend from './sendToBackend'
import validateDocuments from '../utils/validateDocuments'

const UpdateZoopPlan = () => {
    const [type, setType] = useState('');
    const typeList = ['CNPJ', 'Email'];
    const [cnpj, setCnpj] = useState('');
    const [email, setEmail] = useState('');
    const [percentage, setPercentage] = useState('');
    const setState = { setCnpj, setEmail, setType, setPercentage };
    const state = { cnpj, email, type, percentage, ...setState };
    const validations = [
        {
            name: 'cnpj',
            validation: value => type === 'CNPJ' ? /(^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$)/.test(value) && (process.env.HOMOLOG ? true : validateDocuments(value)) : true,
            value: cnpj,
            message: 'CNPJ inválido'
        }, {
            name: 'email',
            validation: value => type === 'Email' ? /^\S+@\S+\.\S+$/g.test(value) : true,
            value: email,
            message: 'Email inválido'
        }, {
            name: 'type',
            validation: value => typeList.includes(value),
            value: type,
            message: 'Tipo inválido'
        }
        , {
            name: 'percentage',
            validation: value => !!value && (parseFloat(value) >= 0 && parseFloat(value) <= 100),
            value: percentage,
            message: 'Valor inválido'
        }
    ];

    const clear = () => {
        setCnpj('');
        setEmail('');
        setPercentage('');
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Form
                validations={validations}
                sendToBackend={sendToBackend ? sendToBackend({ ...state, clear }) : () => null}
                inputs={[
                    <FormInput name='type' label='Campo de busca' input={
                        <Dropdown
                            value={type}
                            onChange={({ target: { value } }) => {
                                setType(value);
                                clear();
                            }}
                            onChangeKeyboard={element => {
                                if (element) {
                                    setType(element.value)
                                    clear();
                                }
                                else null
                            }
                            }
                            readOnly={true}
                            list={typeList}
                            placeholder="Buscar por cnpj ou email"
                        />}
                    />,
                    ...matchForm(state)
                ]}
            />
        </motion.div>
    )

}

export default UpdateZoopPlan
