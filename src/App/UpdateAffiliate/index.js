import React, { useState, useEffect } from 'react'
import { post } from 'axios'
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import InputEdit from '@bit/vitorbarbosa19.ziro.input-edit'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner'
import Error from '@bit/vitorbarbosa19.ziro.error'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import maskInput from '@ziro/mask-input'
import capitalize from '@ziro/capitalize'
import fetch from './fetch'
import { inputEditUpdate, dropdownUpdate } from './sendToBackend'
import validateDocuments from '../utils/validateDocuments'

const UpdateAffiliate = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [foundAffiliate, setFoundAffiliate] = useState(false)
    const [searchedName, setSearchedName] = useState('')
    const [affiliate, setAffiliate] = useState({ 'cpf': '', 'nome': '', 'sobrenome': '', 'whatsapp': '', 'email': '', 'marca': '', 'unidade': '', 'instagram': '' })
    const [affiliates, setAffiliates] = useState([])
    const [newName, setNewName] = useState('')
    const [errorName, setErrorName] = useState('')
    const [loadingName, setLoadingName] = useState(false)
    const [newSurname, setNewSurname] = useState('')
    const [errorSurname, setErrorSurname] = useState('')
    const [loadingSurname, setLoadingSurname] = useState(false)
    const [newCpf, setNewCpf] = useState('')
    const [errorCpf, setErrorCpf] = useState('')
    const [loadingCpf, setLoadingCpf] = useState(false)
    const [newWhatsapp, setNewWhatsapp] = useState('')
    const [errorWhatsapp, setErrorWhatsapp] = useState('')
    const [loadingWhatsapp, setLoadingWhatsapp] = useState(false)
    const [newInsta, setNewInsta] = useState('')
    const [errorInsta, setErrorInsta] = useState('')
    const [loadingInsta, setLoadingInsta] = useState(false)
    const [brandsAndBranches, setBrandsAndBranches] = useState([])
    const [brands, setBrands] = useState([])
    const [branches, setBranches] = useState([])
    const [brand, setBrand] = useState('')
    const [branch, setBranch] = useState('')
    const [affiliateRow, setAffiliateRow] = useState('')
    const setState = { setBrand, setBranch }
    const state = { brand, branch, ...setState }

    const validations = [
        {
            name: 'brand',
            validation: value => brands.includes(value),
            value: brand,
            message: 'Marca inválida'
        }, {
            name: 'branch',
            validation: value => branches.includes(value),
            value: branch,
            message: 'Unidade inválida'
        }
    ]

    const findAffiliateRow = async cpf => {
        const url = process.env.SHEET_URL
        let pos
        const config = {
            headers: {
                'Content-type': 'application/json',
                'Authorization': process.env.SHEET_TOKEN
            }
        }
        const body = {
            "apiResource": "values",
            "apiMethod": "get",
            "range": "Afiliados!B:I",
            "spreadsheetId": process.env.SHEET_ID_AFFILIATES
        }
        const { data: { values } } = await post(url, body, config)
        values.map((affiliate, index) => {
            if (affiliate[0] === cpf) {
                pos = index
            }
        })
        return pos + 1
    }
    const affiliateHandleSuccess = async affiliate => {
        setFoundAffiliate(true)
        setNewName(affiliate[1] ? affiliate[1] : '')
        setNewSurname(affiliate[2] ? affiliate[2] : '')
        setNewCpf(affiliate[0] ? affiliate[0] : '')
        setNewWhatsapp(affiliate[3] ? affiliate[3] : '')
        setNewInsta(affiliate[7] ? affiliate[7] : '')
        setBrand(affiliate[5] ? affiliate[5] : '')
        setBranch(affiliate[6] ? affiliate[6] : '')
        setAffiliate(Object.assign({ 'cpf': affiliate[0] ? affiliate[0] : '', 'nome': affiliate[1] ? affiliate[1] : '', 'sobrenome': affiliate[2] ? affiliate[2] : '', 'whatsapp': affiliate[3] ? affiliate[3] : '', 'email': affiliate[4] ? affiliate[4] : '', 'marca': affiliate[5] ? affiliate[5] : '', 'unidade': affiliate[6] ? affiliate[6] : '', 'instagram': affiliate[7] ? affiliate[7] : '' }))
        let row = await findAffiliateRow(affiliate[0])
        setAffiliateRow(row)
    }
    const affiliateHandleError = () => {
        setFoundAffiliate(false)
        setSearchedName('')
        setNewName('')
        setNewSurname('')
        setNewCpf('')
        setNewWhatsapp('')
        setNewInsta('')
        setBrand('')
        setBranch('')
        setAffiliate({ 'cpf': '', 'nome': '', 'sobrenome': '', 'whatsapp': '', 'email': '', 'marca': '', 'unidade': '', 'instagram': '' })
        setAffiliateRow('')
    }

    useEffect(() => fetch(setIsLoading, setIsError, setAffiliates, setBrands, setBrandsAndBranches), [])
    useEffect(() => {
        setBranches(brandsAndBranches
            .filter(value => value.split(' - ')[0] === brand)
            .map(value => value.split(' - ')[1].replace('Bom Retiro', 'B. Retiro')))
    }, [brand])

    const validateName = () => {
        if (newName !== '') {
            setErrorName('')
            return true
        } else {
            setErrorName('Valor inválido')
            return false
        }
    }
    const validateSurname = () => {
        if (newSurname !== '') {
            setErrorSurname('')
            return true
        } else {
            setErrorSurname('Valor inválido')
            return false
        }
    }
    const validateCpf = () => {
        if (/(^\d{3}\.\d{3}\.\d{3}\-\d{2}$)|(^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$)/.test(newCpf) && (process.env.HOMOLOG ? true : validateDocuments(newCpf))) {
            setErrorCpf('')
            return true
        } else {
            setErrorCpf('CPF inválido')
            return false
        }
    }
    const validateWhatsapp = () => {
        if (/(^\(\d{2}\) \d{5}\-\d{4}$)/.test(newWhatsapp)) {
            setErrorWhatsapp('')
            return true
        } else {
            setErrorWhatsapp('Telefone inválido')
            return false
        }
    }
    const validateInsta = () => {
        if (newInsta !== '') {
            setErrorInsta('')
            return true
        } else {
            setErrorInsta('Instagram inválido')
            return false
        }
    }

    if (isLoading) return <div style={{ display: 'grid' }}><Spinner size='5rem' /></div>
    if (isError) return <Error />

    return (
        <>
            <Dropdown
                value={searchedName}
                onChange={({ target: { value } }) => {
                    if (value !== '') {
                        setSearchedName(value)
                        let person = affiliates.find(element => `${Object.values(element)[1]} ${Object.values(element)[2]}` === value)
                        if (person) affiliateHandleSuccess(person)
                        else setFoundAffiliate(false)
                    } else affiliateHandleError()
                }}
                onChangeKeyboard={element => {
                    if (element) {
                        setSearchedName(element.value)
                        let person = storeowners.find(storeowner => `${Object.values(storeowner)[1]} ${Object.values(storeowner)[2]}` === element.value)
                        if (person) storeownerHandleSuccess(person)
                        else setFoundStoreowner(false)
                    } else storeownerHandleError()
                }}
                list={affiliates.map(affiliate => `${Object.values(affiliate)[1]} ${Object.values(affiliate)[2]}`)}
                placeholder="Pesquise o afiliado"
            />
            {foundAffiliate ? <>
                <InputEdit
                    name="Nome"
                    value={newName}
                    onChange={({ target: { value } }) => setNewName(capitalize(value))}
                    validateInput={validateName}
                    submit={inputEditUpdate('C', affiliateRow, newName, setLoadingName, setErrorName)}
                    setError={() => { }}
                    error={errorName}
                    editable={true}
                    isLoading={loadingName}
                />
                <InputEdit
                    name="Sobrenome"
                    value={newSurname}
                    onChange={({ target: { value } }) => setNewSurname(capitalize(value))}
                    validateInput={validateSurname}
                    submit={inputEditUpdate('D', affiliateRow, newSurname, setLoadingSurname, setErrorSurname)}
                    setError={() => { }}
                    error={errorSurname}
                    editable={true}
                    isLoading={loadingSurname}
                />
                <InputEdit
                    name="CPF"
                    value={newCpf}
                    onChange={({ target: { value } }) => setNewCpf(maskInput(value, '###.###.###-##', true))}
                    validateInput={validateCpf}
                    submit={inputEditUpdate('B', affiliateRow, newCpf, setLoadingCpf, setErrorCpf)}
                    setError={() => { }}
                    error={errorCpf}
                    editable={true}
                    isLoading={loadingCpf}
                    inputMode='numeric'
                />
                <InputEdit
                    name="Whatsapp"
                    value={newWhatsapp}
                    onChange={({ target: { value } }) => setNewWhatsapp(maskInput(value, '(##) #####-####', true))}
                    validateInput={validateWhatsapp}
                    submit={inputEditUpdate('E', affiliateRow, newWhatsapp, setLoadingWhatsapp, setErrorWhatsapp)}
                    setError={() => { }}
                    error={errorWhatsapp}
                    placeholder="digite aqui..."
                    editable={true}
                    isLoading={loadingWhatsapp}
                    inputMode='tel'
                />
                <InputEdit
                    name="Instagram da Marca"
                    value={newInsta}
                    onChange={({ target: { value } }) => setNewInsta(value)}
                    validateInput={validateInsta}
                    submit={inputEditUpdate('I', affiliateRow, newInsta.replace('@', '').trim().toLowerCase(), setLoadingInsta, setErrorInsta)}
                    placeholder={'Ex.: ateliederoupa'}
                    setError={() => { }}
                    error={errorInsta}
                    editable={true}
                    isLoading={loadingInsta}
                />
                <br />
                <Form
                    validations={validations}
                    sendToBackend={dropdownUpdate ? dropdownUpdate(state, affiliateRow) : () => null}
                    inputs={[
                        <FormInput name='brand' label='Marca' input={
                            <Dropdown
                                value={brand}
                                onChange={({ target: { value } }) => {
                                    setBrand(value)
                                    setBranch('')
                                }}
                                list={brands}
                                placeholder='Marca onde trabalha'
                                onChangeKeyboard={element => {
                                    if (element) {
                                        setBrand(element.value)
                                        setBranch('')
                                    } else null
                                }}
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
                        } />
                    ]}
                />
            </> : <></>}
        </>
    )
}

export default UpdateAffiliate
