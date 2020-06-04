import React, { useState, useEffect, useContext } from 'react'
import { motion } from 'framer-motion'
import currencyFormat from '@ziro/currency-format'
import maskInput from '@ziro/mask-input'
import sendToBackend from './sendToBackend'
import capitalize from '@ziro/capitalize'
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import InputText from '@bit/vitorbarbosa19.ziro.input-text'
import SpinnerWithDiv from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import { userContext } from '../appContext'
import fetch from './fetch'

const CreatePayment = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [errorLoading, setErrorLoading] = useState(false)
    const [suppliers, setSuppliers] = useState([])
    const [fantasyNames, setFantasyNames] = useState([])
    const [fantasy, setFantasy] = useState('')
    const [zoopId, setZoopId] = useState('')
    const [charge, setCharge] = useState('')
    const [maxInstallments, setMaxInstallments] = useState('')
    const { nickname } = useContext(userContext)
    const state = { nickname, seller: capitalize(fantasy), sellerId: zoopId, charge, maxInstallments, setFantasy, setCharge, setMaxInstallments }
    const validations = [
        {
            name: 'fantasy',
            validation: value => fantasyNames.includes(value),
            value: fantasy,
            message: 'Fabricante inválido'
        },
        {
            name: 'charge',
            validation: value => value > 9 && value <= 3000000,
            value: charge,
            message: 'Deve ser entre 0,10 e 30mil'
        },
        {
            name: 'maxInstallments',
            validation: value => parseInt(value) > 0 && parseInt(value) <= 10,
            value: maxInstallments,
            message: 'Deve ser entre 1 e 10'
        }
    ]

    useEffect(() => fetch(setIsLoading, setErrorLoading, setSuppliers, setFantasyNames), [])

    if (isLoading) return <SpinnerWithDiv size='5rem' />
    if (errorLoading) return <Error />

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Form
                validations={validations}
                sendToBackend={sendToBackend ? sendToBackend(state) : () => null}
                inputs={[
                    <FormInput
                        name='fantasy'
                        label='Fabricante'
                        input={
                            <Dropdown
                                value={fantasy}
                                onChange={({ target: { value } }) => {
                                    setFantasy(value);
                                    if (fantasyNames.includes(value)) {
                                        const supplier = suppliers.filter(supplier => supplier.fantasia === value);
                                        if (supplier) {
                                            setZoopId(supplier[0].zoopId);
                                        }
                                    }
                                }}
                                onChangeKeyboard={element => {
                                    if (element) {
                                        const value = element.value;
                                        setFantasy(value);
                                        if (fantasyNames.includes(value)) {
                                            const supplier = suppliers.filter(supplier => supplier.fantasia === value);
                                            if (supplier) {
                                                setZoopId(supplier[0].zoopId);
                                            }
                                        }
                                    }
                                    else null
                                }
                                }
                                list={fantasyNames.sort()}
                                placeholder="Fabricante referido"
                            />
                        }
                    />,
                    <FormInput
                        name='charge'
                        label='Valor a cobrar'
                        input={
                            <InputText
                                value={currencyFormat(charge)}
                                onChange={({ target: { value } }) => {
                                    const toInteger = parseInt(value.replace(/[R$\.,]/g, ''), 10)
                                    return setCharge(maskInput(toInteger, '#######', true))
                                }}
                                placeholder='R$1.299,99'
                            />
                        }
                    />,
                    <FormInput
                        name='maxInstallments'
                        label='Parcelamento máximo'
                        input={
                            <InputText
                                value={maxInstallments}
                                onChange={({ target: { value } }) => setMaxInstallments(maskInput(value, '##', true))}
                                placeholder='10'
                            />
                        }
                    />
                ]} />
        </motion.div>
    )
}

export default CreatePayment
