import React, { useState, useEffect } from 'react'
import { post } from 'axios'
import InputEdit from '@bit/vitorbarbosa19.ziro.input-edit'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner'
import Error from '@bit/vitorbarbosa19.ziro.error'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import maskInput from '@ziro/mask-input'
import capitalize from '@ziro/capitalize'
import fetch from './fetch'
import { inputEditUpdate, dropdownUpdate } from './sendToBackend'

const UpdateStoreowner = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [foundStoreowner, setFoundStoreowner] = useState(false)
    const [searchedName, setSearchedName] = useState('')
    const [storeowner, setStoreowner] = useState({ 'cadastro': '', 'afiliado': '', 'afiliado_cpf': '', 'lojista': '', 'rg': '', 'cpf': '', 'nascimento': '', 'insta': '', 'cnpj': '', 'ie': '', 'razao': '', 'fantasia': '', 'endereco': '', 'bairro': '', 'cep': '', 'cidade': '', 'estado': '', 'fone': '', 'email': '', 'assessor': '', 'vendedor': '' })
    const [storeowners, setStoreowners] = useState([])
    const [newName, setNewName] = useState('')
    const [errorName, setErrorName] = useState('')
    const [loadingName, setLoadingName] = useState(false)
    const [newSurname, setNewSurname] = useState('')
    const [errorSurname, setErrorSurname] = useState('')
    const [loadingSurname, setLoadingSurname] = useState(false)
    const [newBirthDate, setNewBirthDate] = useState('')
    const [errorBirthDate, setErrorBirthDate] = useState('')
    const [loadingBirthDate, setLoadingBirthDate] = useState(false)
    const [newInsta, setNewInsta] = useState('')
    const [errorInsta, setErrorInsta] = useState('')
    const [loadingInsta, setLoadingInsta] = useState(false)
    const [newIe, setNewIe] = useState('')
    const [errorIe, setErrorIe] = useState('')
    const [loadingIe, setLoadingIe] = useState(false)
    const [affiliateName, setAffiliateName] = useState('')
    const [affiliateCpf, setAffiliateCpf] = useState('')
    const [affiliates, setAffiliates] = useState([])
    const [advisor, setAdvisor] = useState('')
    const [advisors, setAdvisors] = useState([])
    const [salesman, setSalesman] = useState('')
    const [sellers, setSellers] = useState([])
    const [storeownerRow, setStoreownerRow] = useState('')
    const setState = { setAffiliateName, setAffiliateCpf, setAdvisor, setSalesman }
    const state = { affiliateName, affiliateCpf, advisor, salesman, ...setState }
    const validations = [
        {
            name: 'affiliate',
            validation: value => value === '' || affiliates.find(affiliate => affiliate[1] === value),
            value: affiliateName,
            message: 'Afiliado(a) inválido(a)'
        }, {
            name: 'advisor',
            validation: value => value === '' || advisors.includes(value),
            value: advisor,
            message: 'Assessor(a) inválido(a)'
        }, {
            name: 'salesman',
            validation: value => value === '' || sellers.includes(value),
            value: salesman,
            message: 'Vendedor(a) inválido(a)'
        }
    ]
    const findStoreownerRow = async cnpj => {
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
            "range": "Base",
            "spreadsheetId": process.env.SHEET_STOREOWNERS_ID
        }
        const { data: { values } } = await post(url, body, config)
        values.map((user, index) => {
            if (user[6] === cnpj) {
                pos = index
            }
        })
        return pos + 1
    }
    const storeownerHandleSuccess = async person => {
        setFoundStoreowner(true)
        setNewName(person[1] ? person[1].split(' ')[0] : '')
        setNewSurname(person[1] ? person[1].split(' ').slice(1).join(' ') : '')
        setNewBirthDate(person[4] ? person[4] : '')
        setNewInsta(person[5] ? person[5] : '')
        setNewIe(person[7] ? person[7] : '')
        setAffiliateName(person[17] ? person[17] : '')
        setAffiliateCpf(person[18] ? person[18] : '')
        setAdvisor(person[19] ? person[19] : '')
        setSalesman(person[20] ? person[20] : '')
        setStoreowner(Object.assign({ 'cadastro': person[0] ? person[0] : '', 'afiliado': person[17] ? person[17] : '', 'afiliado_cpf': person[18] ? person[18] : '', 'lojista': person[1] ? person[1] : '', 'rg': person[2] ? person[2] : '', 'cpf': person[3] ? person[3] : '', 'nascimento': person[4] ? person[4] : '', 'insta': person[5] ? person[5] : '', 'cnpj': person[6] ? person[6] : '', 'ie': person[7] ? person[7] : '', 'razao': person[8] ? person[8] : '', 'fantasia': person[9] ? person[9] : '', 'endereco': person[10] ? person[10] : '', 'bairro': person[11] ? person[11] : '', 'cep': person[12] ? person[12] : '', 'cidade': person[13] ? person[13] : '', 'estado': person[14] ? person[14] : '', 'fone': person[15] ? person[15] : '', 'email': person[16] ? person[16] : '', 'assessor': person[19] ? person[19] : '', 'vendedor': person[20] ? person[20] : '' }))
        if (person[6]) {
            let row = await findStoreownerRow(person[6])
            setStoreownerRow(row)
        }
    }
    const storeownerHandleError = () => {
        setFoundStoreowner(false)
        setSearchedName('')
        setNewName('')
        setNewSurname('')
        setNewBirthDate('')
        setNewInsta('')
        setNewIe('')
        setAffiliateName('')
        setAffiliateCpf('')
        setAdvisor('')
        setSalesman('')
        setStoreowner({ 'cadastro': '', 'afiliado': '', 'afiliado_cpf': '', 'lojista': '', 'rg': '', 'cpf': '', 'nascimento': '', 'insta': '', 'cnpj': '', 'ie': '', 'razao': '', 'fantasia': '', 'endereco': '', 'bairro': '', 'cep': '', 'cidade': '', 'estado': '', 'fone': '', 'email': '', 'assessor': '', 'vendedor': '' })
        setStoreownerRow('')
    }

    useEffect(() => fetch(setIsLoading, setIsError, setStoreowners, setAdvisors, setAffiliates, setSellers), [])

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
    const validateInsta = () => {
        if (newInsta !== '') {
            setErrorInsta('')
            return true
        } else {
            setErrorInsta('Valor inválido')
            return false
        }
    }
    const validateIe = () => {
        if (newIe !== '') {
            setErrorIe('')
            return true
        } else {
            setErrorIe('Valor inválido')
            return false
        }
    }
    const validateBirthDate = () => {
        if (/^(?:(?:31(\/)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/.test(newBirthDate)) {
            setErrorBirthDate('')
            return true
        } else {
            setErrorBirthDate('Data inválida')
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
                        let person = storeowners.find(element => element[1] === value)
                        if (person) storeownerHandleSuccess(person)
                        else setFoundStoreowner(false)
                    } else storeownerHandleError()
                }}
                onChangeKeyboard={element => {
                    if (element) {
                        setSearchedName(element.value)
                        let person = storeowners.find(storeowner => storeowner[1] === element.value)
                        if (person) storeownerHandleSuccess(person)
                        else setFoundStoreowner(false)
                    } else storeownerHandleError()
                }}
                list={storeowners.map(storeowner => Object.values(storeowner)[1])}
                placeholder="Pesquise o lojista"
            />
            {foundStoreowner ? <>
                <InputEdit
                    name="Assessor(a)"
                    value={storeowner.assessor}
                    onChange={() => { }}
                    validateInput={() => { }}
                    submit={() => { }}
                    setError={() => { }}
                    error={''}
                    editable={false}
                    isLoading={false}
                />
                <InputEdit
                    name="CNPJ"
                    value={storeowner.cnpj}
                    onChange={() => { }}
                    validateInput={() => { }}
                    submit={() => { }}
                    setError={() => { }}
                    error={''}
                    editable={false}
                    isLoading={false}
                />
                <InputEdit
                    name="Nome"
                    value={newName}
                    onChange={({ target: { value } }) => setNewName(capitalize(value))}
                    validateInput={validateName}
                    submit={inputEditUpdate(storeowner.cnpj, 'B', storeownerRow, { 'lojista': `${newName} ${newSurname}` }, `${newName} ${newSurname}`, setLoadingName, setErrorName)}
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
                    submit={inputEditUpdate(storeowner.cnpj, 'B', storeownerRow, { 'lojista': `${newName} ${newSurname}` }, `${newName} ${newSurname}`, setLoadingSurname, setErrorSurname)}
                    setError={() => { }}
                    error={errorSurname}
                    editable={true}
                    isLoading={loadingSurname}
                />
                <InputEdit
                    name="RG"
                    value={storeowner.rg}
                    onChange={() => { }}
                    validateInput={() => { }}
                    submit={() => { }}
                    setError={() => { }}
                    error={''}
                    editable={false}
                    isLoading={false}
                />
                <InputEdit
                    name="CPF"
                    value={storeowner.cpf}
                    onChange={() => { }}
                    validateInput={() => { }}
                    submit={() => { }}
                    setError={() => { }}
                    error={''}
                    editable={false}
                    isLoading={false}
                />
                <InputEdit
                    name="Nascimento"
                    value={newBirthDate}
                    onChange={({ target: { value } }) => setNewBirthDate(maskInput(value, '##/##/####', true))}
                    validateInput={validateBirthDate}
                    submit={inputEditUpdate(storeowner.cnpj, 'E', storeownerRow, { 'nascimento': newBirthDate }, newBirthDate, setLoadingBirthDate, setErrorBirthDate)}
                    setError={() => { }}
                    error={errorBirthDate}
                    editable={true}
                    isLoading={loadingBirthDate}
                />
                <InputEdit
                    name="Instagram da loja"
                    value={newInsta}
                    onChange={({ target: { value } }) => setNewInsta(value)}
                    validateInput={validateInsta}
                    submit={inputEditUpdate(storeowner.cnpj, 'F', storeownerRow, { 'insta': newInsta.replace('@', '').trim().toLowerCase() }, newInsta.replace('@', '').trim().toLowerCase(), setLoadingInsta, setErrorInsta)}
                    placeholder={'Ex.: ateliederoupa. Não use .com'}
                    setError={() => { }}
                    error={errorInsta}
                    editable={true}
                    isLoading={loadingInsta}
                />
                <InputEdit
                    name="Inscrição Estadual"
                    value={newIe}
                    onChange={({ target: { value } }) => setNewIe(maskInput(value, '#############', true))}
                    validateInput={validateIe}
                    submit={inputEditUpdate(storeowner.cnpj, 'H', storeownerRow, { 'ie': newIe }, newIe, setLoadingIe, setErrorIe)}
                    setError={() => { }}
                    error={errorIe}
                    editable={true}
                    isLoading={loadingIe}
                />
                <InputEdit
                    name="Razão Social"
                    value={storeowner.razao}
                    onChange={() => { }}
                    validateInput={() => { }}
                    submit={() => { }}
                    setError={() => { }}
                    error={''}
                    editable={false}
                    isLoading={false}
                />
                <InputEdit
                    name="Nome Fantasia"
                    value={storeowner.fantasia}
                    onChange={() => { }}
                    validateInput={() => { }}
                    submit={() => { }}
                    setError={() => { }}
                    error={''}
                    editable={false}
                    isLoading={false}
                />
                <InputEdit
                    name="Rua"
                    value={storeowner.endereco ? storeowner.endereco.split(', ')[0] : ''}
                    onChange={() => { }}
                    validateInput={() => { }}
                    submit={() => { }}
                    setError={() => { }}
                    error={''}
                    editable={false}
                    isLoading={false}
                />
                <InputEdit
                    name="Número"
                    value={storeowner.endereco ? storeowner.endereco.split(', ')[1] : ''}
                    onChange={() => { }}
                    validateInput={() => { }}
                    submit={() => { }}
                    setError={() => { }}
                    error={''}
                    editable={false}
                    isLoading={false}
                />
                <InputEdit
                    name="Complemento"
                    value={storeowner.endereco ? storeowner.endereco.split(', ')[2] : ''}
                    onChange={() => { }}
                    validateInput={() => { }}
                    submit={() => { }}
                    setError={() => { }}
                    error={''}
                    editable={false}
                    isLoading={false}
                />
                <InputEdit
                    name="Bairro"
                    value={storeowner.bairro}
                    onChange={() => { }}
                    validateInput={() => { }}
                    submit={() => { }}
                    setError={() => { }}
                    error={''}
                    editable={false}
                    isLoading={false}
                />
                <InputEdit
                    name="Cep"
                    value={storeowner.cep}
                    onChange={() => { }}
                    validateInput={() => { }}
                    submit={() => { }}
                    setError={() => { }}
                    error={''}
                    editable={false}
                    isLoading={false}
                />
                <InputEdit
                    name="Cidade"
                    value={storeowner.cidade}
                    onChange={() => { }}
                    validateInput={() => { }}
                    submit={() => { }}
                    setError={() => { }}
                    error={''}
                    editable={false}
                    isLoading={false}
                />
                <InputEdit
                    name="Estado"
                    value={storeowner.estado}
                    onChange={() => { }}
                    validateInput={() => { }}
                    submit={() => { }}
                    setError={() => { }}
                    error={''}
                    editable={false}
                    isLoading={false}
                />
                <InputEdit
                    name="Telefone"
                    value={storeowner.fone}
                    onChange={() => { }}
                    validateInput={() => { }}
                    submit={() => { }}
                    setError={() => { }}
                    error={''}
                    editable={false}
                    isLoading={false}
                />
                <InputEdit
                    name="Email"
                    value={storeowner.email}
                    onChange={() => { }}
                    validateInput={() => { }}
                    submit={() => { }}
                    setError={() => { }}
                    error={''}
                    editable={false}
                    isLoading={false}
                />
                <br />
                <Form
                    validations={validations}
                    sendToBackend={dropdownUpdate ? dropdownUpdate(state, storeowner.cnpj, storeownerRow) : null}
                    inputs={[
                        <FormInput name='affiliate' label='Afiliado(a)' input={
                            <Dropdown
                                value={affiliateName}
                                onChange={({ target: { value } }) => {
                                    if (value !== '') {
                                        let person = affiliates.find(element => element[1] === value)
                                        if (person) {
                                            setAffiliateCpf(person[0])
                                            setAffiliateName(person[1])
                                        }
                                    } else {
                                        setAffiliateCpf('')
                                        setAffiliateName('')
                                    }
                                }}
                                onChangeKeyboard={element => {
                                    if (element) {
                                        let person = affiliates.find(affiliate => affiliate[1] === element.value)
                                        if (person) {
                                            setAffiliateCpf(person[0])
                                            setAffiliateName(person[1])
                                        }
                                    } else {
                                        setAffiliateCpf('')
                                        setAffiliateName('')
                                    }
                                }
                                }
                                list={affiliates.map(affiliate => Object.values(affiliate)[1])}
                                placeholder="Nome do(a) afiliado(a)"
                                readOnly={true}
                            />
                        } />,
                        <FormInput name='advisor' label='Assessor(a)' input={
                            <Dropdown
                                value={advisor}
                                onChange={({ target: { value } }) => setAdvisor(value)}
                                onChangeKeyboard={element =>
                                    element ? setAdvisor(element.value) : null
                                }
                                list={advisors}
                                placeholder="Nome do(a) assessor(a)"
                                readOnly={true}
                            />
                        } />,
                        <FormInput name='salesman' label='Vendedor(a)' input={
                            <Dropdown
                                value={salesman}
                                onChange={({ target: { value } }) => setSalesman(value)}
                                onChangeKeyboard={element =>
                                    element ? setSalesman(element.value) : null
                                }
                                list={sellers}
                                placeholder="Nome do(a) vendedor(a)"
                                readOnly={true}
                            />
                        } />
                    ]}
                />
            </> : <></>}
        </>
    )
}

export default UpdateStoreowner
