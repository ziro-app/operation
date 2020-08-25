import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import InputText from '@bit/vitorbarbosa19.ziro.input-text'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import matchForm from './matchForm'
import sendToBackend from './sendToBackend'
import searchSupplier from './searchSupplier'
import { contentStyle, info, titleStyle } from './styles'
import validateDocuments from '../utils/validateDocuments'

const UpdateZoopPlan = () => {
    const [type, setType] = useState('');
    const typeList = ['CNPJ', 'Email'];
    const [cnpj, setCnpj] = useState('');
    const [email, setEmail] = useState('');
    const [percentage, setPercentage] = useState('');
    const [supplier, setSupplier] = useState({ 'docId': '', 'name': '', 'percentage': '' });
    const setState = { setCnpj, setEmail, setType, setPercentage, setSupplier };
    const state = { cnpj, email, type, percentage, supplier, ...setState };
    const searchValidation = [
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
    ];
    const updateValidation = [
        {
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
        setSupplier({ 'docId': '', 'name': '', 'percentage': '' });
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <>
                <Form
                    buttonName='Buscar'
                    buttonOnTop={true}
                    validations={searchValidation}
                    sendToBackend={searchSupplier ? searchSupplier(state) : () => null}
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

                {supplier.name && <div style={info}>
                    <label style={titleStyle}>FABRICANTE</label>
                    <label style={contentStyle}>{supplier.name}</label>
                </div>}

                {supplier.percentage && <div style={{ ...info, paddingBottom: '20px' }}>
                    <label style={titleStyle}>PORCENTAGEM ATUAL</label>
                    <label style={contentStyle}>{supplier.percentage}</label>
                </div>}

                {supplier.docId && supplier.name && supplier.percentage &&
                    <Form
                        buttonName='Atualizar'
                        validations={updateValidation}
                        sendToBackend={sendToBackend ? sendToBackend({ ...state, clear }) : () => null}
                        inputs={[
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
                        ]}
                    />
                }
            </>
        </motion.div>
    )

}

export default UpdateZoopPlan
