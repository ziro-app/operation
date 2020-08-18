import React, { useState, useEffect } from 'react'
import fetch from './fetch'
import sendToBackend from './sendToBackend'
import maskInput from '@ziro/mask-input'
import capitalize from '@ziro/capitalize'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner'
import Error from '@bit/vitorbarbosa19.ziro.error'
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import InputText from '@bit/vitorbarbosa19.ziro.input-text'
import InputPhone from '@bit/vitorbarbosa19.ziro.input-phone'
import validateDocuments from '../utils/validateDocuments'

const RegisterAffiliate = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    // dropdown options
    const [brandsAndBranches, setBrandsAndBranches] = useState([])
    const [brands, setBrands] = useState([])
    const [branches, setBranches] = useState([])
    // form fields
    const [brand, setBrand] = useState('')
    const [branch, setBranch] = useState('')
    const [insta, setInsta] = useState('')
    const [fname, setFname] = useState('')
    const [lname, setLname] = useState('')
    const [cpf, setCpf] = useState('')
    const [whats, setWhats] = useState('')
    const state = { brand, branch, insta, fname, lname, cpf, whats }
    useEffect(() => fetch(setIsLoading, setIsError, setBrands, setBrandsAndBranches), [])
    useEffect(() => {
        setBranch('')
        setBranches(brandsAndBranches
            .filter(value => value.split(' - ')[0] === brand)
            .map(value => value.split(' - ')[1].replace('Bom Retiro', 'B. Retiro')))
    }, [brand])
    const validations = [
        {
            name: 'brand',
            validation: value => !!value,
            value: brand,
            message: 'Marca inválida'
        }, {
            name: 'branch',
            validation: value => !!value,
            value: branch,
            message: 'Unidade inválida'
        }, {
            name: 'fname',
            validation: value => !!value,
            value: fname,
            message: 'Campo obrigatório'
        }, {
            name: 'lname',
            validation: value => !!value,
            value: lname,
            message: 'Campo obrigatório'
        }, {
            name: 'cpf',
            validation: value => value === '' || (/(^\d{3}\.\d{3}\.\d{3}\-\d{2}$)|(^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$)/.test(value) && (process.env.HOMOLOG ? true : validateDocuments(value))),
            value: cpf,
            message: 'Formato inválido'
        }, {
            name: 'whats',
            validation: value => value.length >= 14,
            value: whats,
            message: 'Formato inválido'
        }
    ]
    if (isLoading) return <div style={{ display: 'grid' }}><Spinner size='5rem' /></div>
    if (isError) return <Error />
    return (
        <>
            <Form
                validations={validations}
                sendToBackend={sendToBackend ? sendToBackend(state) : () => null}
                inputs={[
                    <FormInput name='brand' label='Marca' input={
                        <Dropdown
                            value={brand}
                            onChange={({ target: { value } }) => setBrand(value)}
                            list={brands}
                            placeholder='Marca onde trabalha'
                            onChangeKeyboard={element => element ? setBrand(element.value) : null}
                        />
                    } />,
                    <FormInput name='branch' label='Unidade da Marca' input={
                        <Dropdown
                            value={branch}
                            onChange={({ target: { value } }) => setBranch(value)}
                            list={branches || ['Escolha uma marca acima']}
                            placeholder='Unidade/endereço da marca'
                            onChangeKeyboard={element => element ? setBranch(element.value) : null}
                        />
                    } />,
                    <FormInput name='insta' label='Instagram da Marca' input={
                        <InputText
                            value={insta}
                            onChange={({ target: { value } }) => setInsta(value)}
                            placeholder='Ex.: ateliederoupa. Não use .com'
                        />
                    } />,
                    <FormInput name='fname' label='Nome' input={
                        <InputText
                            value={fname}
                            onChange={({ target: { value } }) => setFname(capitalize(value))}
                            placeholder='Seu primeiro nome'
                        />
                    } />,
                    <FormInput name='lname' label='Sobrenome' input={
                        <InputText
                            value={lname}
                            onChange={({ target: { value } }) => setLname(capitalize(value))}
                            placeholder='Seu sobrenome'
                        />
                    } />,
                    <FormInput name='cpf' label='CPF' input={
                        <InputText
                            value={cpf}
                            onChange={({ target: { value } }) => setCpf(maskInput(value, '###.###.###-##', true))}
                            placeholder='000.111.222-33'
                            inputMode='numeric'
                        />
                    } />,
                    <FormInput name='whats' label='Whatsapp' input={
                        <InputPhone
                            value={whats}
                            setValue={setWhats}
                        />
                    } />
                ]}
            />
        </>
    )
}

export default RegisterAffiliate
