import React, { useState, useContext, useEffect } from 'react'
import { userContext } from '../appContext'
import InputEdit from '@bit/vitorbarbosa19.ziro.input-edit'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner'
import Error from '@bit/vitorbarbosa19.ziro.error'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import { containerWithPadding } from '@ziro/theme'
import maskInput from '@ziro/mask-input'
import capitalize from '@ziro/capitalize'
import fetch from './fetch'
import { inputEditUpdate, dropdownUpdate } from './sendToBackend'

const UpdateStoreowner = () => {
    const { userPos } = useContext(userContext)
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
    const setState = { setAffiliateName, setAffiliateCpf, setAdvisor, setSalesman }
    const state = { affiliateName, affiliateCpf, advisor, salesman, ...setState }
    const validations = [
        {
            name: 'affiliate',
            validation: value => affiliates.find(affiliate => affiliate[1] === value),
            value: affiliateName,
            message: 'Afiliado(a) inválido(a)'
        }, {
            name: 'advisor',
            validation: value => advisors.includes(value),
            value: advisor,
            message: 'Assessor(a) inválido(a)'
        }, {
            name: 'salesman',
            validation: value => sellers.includes(value),
            value: salesman,
            message: 'Vendedor(a) inválido(a)'
        }
    ]
    const storeownerHandleSuccess = person => {
        setFoundStoreowner(true)
        setNewName(person[3].split(' ')[0])
        setNewSurname(person[3].split(' ').slice(1).join(' '))
        setNewBirthDate(person[6])
        setNewInsta(person[7])
        setNewIe(person[9])
        setAffiliateName(person[1])
        setAffiliateCpf(person[2])
        setAdvisor(person[19])
        setSalesman(person[20])
        setStoreowner(Object.assign({ 'cadastro': person[0], 'afiliado': person[1], 'afiliado_cpf': person[2], 'lojista': person[3], 'rg': person[4], 'cpf': person[5], 'nascimento': person[6], 'insta': person[7], 'cnpj': person[8], 'ie': person[9], 'razao': person[10], 'fantasia': person[11], 'endereco': person[12], 'bairro': person[13], 'cep': person[14], 'cidade': person[15], 'estado': person[16], 'fone': person[17], 'email': person[18], 'assessor': person[19], 'vendedor': person[20] }))
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
        <div style={containerWithPadding}>
            <Dropdown
                value={searchedName}
                onChange={({ target: { value } }) => {
                    if (value !== '') {
                        setSearchedName(value)
                        let person = storeowners.find(element => element[3] === value)
                        if (person) storeownerHandleSuccess(person)
                        else setFoundStoreowner(false)
                    } else storeownerHandleError()
                }}
                onChangeKeyboard={element => {
                    if (element) {
                        setSearchedName(element.value)
                        let person = storeowners.find(affiliate => affiliate[3] === element.value)
                        if (person) storeownerHandleSuccess(person)
                        else setFoundStoreowner(false)
                    } else storeownerHandleError()
                }}
                list={storeowners.map(storeowner => Object.values(storeowner)[3])}
                placeholder="Pesquise o lojista"
            />
            {foundStoreowner ? <>
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
                    submit={inputEditUpdate(storeowner.cnpj, 'D', userPos, { 'lojista': `${newName} ${newSurname}` }, `${newName} ${newSurname}`, setLoadingName, setErrorName)}
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
                    submit={inputEditUpdate(storeowner.cnpj, 'D', userPos, { 'lojista': `${newName} ${newSurname}` }, `${newName} ${newSurname}`, setLoadingSurname, setErrorSurname)}
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
                    submit={inputEditUpdate(storeowner.cnpj, 'G', userPos, { 'nascimento': newBirthDate }, newBirthDate, setLoadingBirthDate, setErrorBirthDate)}
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
                    submit={inputEditUpdate(storeowner.cnpj, 'H', userPos, { 'insta': newInsta.replace('@', '').trim().toLowerCase() }, newInsta.replace('@', '').trim().toLowerCase(), setLoadingInsta, setErrorInsta)}
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
                    submit={inputEditUpdate(storeowner.cnpj, 'J', userPos, { 'ie': newIe }, newIe, setLoadingIe, setErrorIe)}
                    setError={() => { }}
                    error={errorIe}
                    editable={true}
                    isLoading={loadingIe}
                />
                <InputEdit
                    name="Razão Social"
                    value={storeowner.razao}
                    onChange={({ target: { value } }) => setNewName(capitalize(value))}
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
                    onChange={({ target: { value } }) => setNewName(capitalize(value))}
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
                    onChange={({ target: { value } }) => setNewName(capitalize(value))}
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
                    onChange={({ target: { value } }) => setNewName(capitalize(value))}
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
                    onChange={({ target: { value } }) => setNewName(capitalize(value))}
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
                    onChange={({ target: { value } }) => setNewName(capitalize(value))}
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
                    onChange={({ target: { value } }) => setNewName(capitalize(value))}
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
                    onChange={({ target: { value } }) => setNewName(capitalize(value))}
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
                    onChange={({ target: { value } }) => setNewName(capitalize(value))}
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
                    onChange={({ target: { value } }) => setNewName(capitalize(value))}
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
                    onChange={({ target: { value } }) => setNewName(capitalize(value))}
                    validateInput={() => { }}
                    submit={() => { }}
                    setError={() => { }}
                    error={''}
                    editable={false}
                    isLoading={false}
                />
                <br />
                <hr />
                <Form
                    validations={validations}
                    sendToBackend={dropdownUpdate ? dropdownUpdate(state, storeowner.cnpj, userPos) : null}
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
        </div>
    )
}

export default UpdateStoreowner