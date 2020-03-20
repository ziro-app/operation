import React, { useState, useEffect, useRef } from 'react'
import { post } from 'axios'
import InputEdit from '@bit/vitorbarbosa19.ziro.input-edit'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner'
import Error from '@bit/vitorbarbosa19.ziro.error'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import Button from '@bit/vitorbarbosa19.ziro.button'
import maskInput from '@ziro/mask-input'
import capitalize from '@ziro/capitalize'
import fetch from './fetch'
import { inputEditUpdate, dropdownUpdate } from './sendToBackend'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateStoreowner = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [foundStoreowner, setFoundStoreowner] = useState(false)
    const [searchedName, setSearchedName] = useState('')
    const [storeowner, setStoreowner] = useState({ 'cadastro': '', 'afiliado': '', 'afiliado_cpf': '', 'lojista': '', 'rg': '', 'cpf': '', 'nascimento': '', 'insta': '', 'cnpj': '', 'ie': '', 'razao': '', 'fantasia': '', 'endereco': '', 'bairro': '', 'cep': '', 'cidade': '', 'estado': '', 'fone': '', 'email': '', 'assessor': '', 'vendedor': '', 'whats': '', 'entrega': '', 'cepEntrega': '', 'cidadeEntrega': '', 'estadoEntrega': '' })
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
    const [newRg, setNewRg] = useState('')
    const [errorRg, setErrorRg] = useState('')
    const [loadingRg, setLoadingRg] = useState(false)
    const [newCpf, setNewCpf] = useState('')
    const [errorCpf, setErrorCpf] = useState('')
    const [loadingCpf, setLoadingCpf] = useState(false)
    const [newEmail, setNewEmail] = useState('')
    const [errorEmail, setErrorEmail] = useState('')
    const [loadingEmail, setLoadingEmail] = useState(false)
    const [newFone, setNewFone] = useState('')
    const [errorFone, setErrorFone] = useState('')
    const [loadingFone, setLoadingFone] = useState(false)
    const [newWhats, setNewWhats] = useState('')
    const [errorWhats, setErrorWhats] = useState('')
    const [loadingWhats, setLoadingWhats] = useState(false)
    const [newStreet, setNewStreet] = useState('')
    const [errorStreet, setErrorStreet] = useState('')
    const [loadingStreet, setLoadingStreet] = useState(false)
    const [newNumber, setNewNumber] = useState('')
    const [errorNumber, setErrorNumber] = useState('')
    const [loadingNumber, setLoadingNumber] = useState(false)
    const [newComplement, setNewComplement] = useState('')
    const [errorComplement, setErrorComplement] = useState('')
    const [loadingComplement, setLoadingComplement] = useState(false)
    const [newNeighborhood, setNewNeighborhood] = useState('')
    const [errorNeighborhood, setErrorNeighborhood] = useState('')
    const [loadingNeighborhood, setLoadingNeighborhood] = useState(false)
    const [newCep, setNewCep] = useState('')
    const [errorCep, setErrorCep] = useState('')
    const [loadingCep, setLoadingCep] = useState(false)
    const [newCity, setNewCity] = useState('')
    const [errorCity, setErrorCity] = useState('')
    const [loadingCity, setLoadingCity] = useState(false)
    const [newState, setNewState] = useState('')
    const [errorState, setErrorState] = useState('')
    const [loadingState, setLoadingState] = useState(false)
    const [affiliateName, setAffiliateName] = useState('')
    const [affiliateCpf, setAffiliateCpf] = useState('')
    const [affiliates, setAffiliates] = useState([])
    const [advisor, setAdvisor] = useState('')
    const [advisors, setAdvisors] = useState([])
    const [salesman, setSalesman] = useState('')
    const [sellers, setSellers] = useState([])
    const [storeownerRow, setStoreownerRow] = useState('')
    const [textArea, setTextArea] = useState('')
    const textAreaRef = useRef(null)
    const setState = { setAffiliateName, setAffiliateCpf, setAdvisor, setSalesman }
    const state = { affiliateName, affiliateCpf, advisor, salesman, ...setState }
    const statesList = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']
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
        const partAddress = person[22]? person[22].split(', ') : ''
        setNewName(person[1] ? person[1].split(' ')[0] : '')
        setNewSurname(person[1] ? person[1].split(' ').slice(1).join(' ') : '')
        setNewBirthDate(person[4] ? person[4] : '')
        setNewInsta(person[5] ? person[5] : '')
        setNewIe(person[7] ? person[7] : '')
        setAffiliateName(person[17] ? person[17] : '')
        setAffiliateCpf(person[18] ? person[18] : '')
        setAdvisor(person[19] ? person[19] : '')
        setSalesman(person[20] ? person[20] : '')
        setNewRg(person[2] ? person[2] : '')
        setNewCpf(person[3] ? person[3] : '')
        setNewFone(person[15] ? person[15] : '')
        setNewEmail(person[16] ? person[16] : '')
        setNewWhats(person[21]? person[21] : '')
        setNewStreet(partAddress[0]? partAddress[0] : '')
        setNewNumber(partAddress[1]? partAddress[1] : '')
        setNewComplement(partAddress.length === 4 ? partAddress[2] : '')
        setNewNeighborhood(partAddress.length === 4 ? partAddress[3] : partAddress[2])
        setNewCep(person[23]? person[23] : '')
        setNewCity(person[24]? person[24] : '')
        setNewState(person[25]? person[25] : '')
        setTextArea(person[6] ? `https://interno.ziro.app/show-info?doc=${person[6]}` : '')
        setStoreowner(Object.assign({ 'cadastro': person[0] ? person[0] : '', 'afiliado': person[17] ? person[17] : '', 'afiliado_cpf': person[18] ? person[18] : '', 'lojista': person[1] ? person[1] : '', 'rg': person[2] ? person[2] : '', 'cpf': person[3] ? person[3] : '', 'nascimento': person[4] ? person[4] : '', 'insta': person[5] ? person[5] : '', 'cnpj': person[6] ? person[6] : '', 'ie': person[7] ? person[7] : '', 'razao': person[8] ? person[8] : '', 'fantasia': person[9] ? person[9] : '', 'endereco': person[10] ? person[10] : '', 'bairro': person[11] ? person[11] : '', 'cep': person[12] ? person[12] : '', 'cidade': person[13] ? person[13] : '', 'estado': person[14] ? person[14] : '', 'fone': person[15] ? person[15] : '', 'email': person[16] ? person[16] : '', 'assessor': person[19] ? person[19] : '', 'vendedor': person[20] ? person[20] : '', 'whats': person[21]? person[21] : '', 'entrega': person[22]? person[22] : '', 'cepEntrega': person[23]? person[23] : '', 'cidadeEntrega': person[24]? person[24] : '', 'estadoEntrega': person[25]? person[25] : '' }))
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
        setNewRg('')
        setNewCpf('')
        setNewFone('')
        setNewEmail('')
        setNewWhats('')
        setNewStreet('')
        setNewNumber('')
        setNewComplement('')
        setNewNeighborhood('')
        setNewCep('')
        setNewCity('')
        setNewState('')
        setTextArea('')
        setStoreowner({ 'cadastro': '', 'afiliado': '', 'afiliado_cpf': '', 'lojista': '', 'rg': '', 'cpf': '', 'nascimento': '', 'insta': '', 'cnpj': '', 'ie': '', 'razao': '', 'fantasia': '', 'endereco': '', 'bairro': '', 'cep': '', 'cidade': '', 'estado': '', 'fone': '', 'email': '', 'assessor': '', 'vendedor': '', 'whats': '', 'entrega': '', 'cepEntrega': '', 'cidadeEntrega': '', 'estadoEntrega': '' })
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
    const validateRg = () => {
        if (newRg !== '') {
            setErrorRg('')
            return true
        } else {
            setErrorRg('Documento inválido')
            return false
        }
    }
    const validateCpf = () => {
        if (/(^\d{3}\.\d{3}\.\d{3}\-\d{2}$)|(^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$)/.test(newCpf)) {
            setErrorCpf('')
            return true
        } else {
            setErrorCpf('CPF inválido')
            return false
        }
    }
    const validateEmail = () => {
        if (/^\S+@\S+\.\S+$/g.test(newEmail)) {
            setErrorEmail('')
            return true
        } else {
            setErrorEmail('Email inválido')
            return false
        }
    }
    const validateFone = () => {
        if (/(^\(\d{2}\) \d{5}\-\d{4}$)/.test(newFone)) {
            setErrorFone('')
            return true
        } else {
            setErrorFone('Telefone inválido')
            return false
        }
    }
    const validateWhats = () => {
        if (/(^\(\d{2}\) \d{5}\-\d{4}$)/.test(newWhats)) {
            setErrorWhats('')
            return true
        } else {
            setErrorWhats('Whatsapp inválido')
            return false
        }
    }
    const validateStreet = () => {
        if (newStreet !== '') {
            setErrorStreet('')
            return true
        } else {
            setErrorStreet('Valor inválido')
            return false
        }
    }
    const validateNumber = () => {
        if (newNumber !== '') {
            setErrorNumber('')
            return true
        } else {
            setErrorNumber('Número inválido')
            return false
        }
    }
    const validateNeighborhood = () => {
        if (newNeighborhood !== '') {
            setErrorNeighborhood('')
            return true
        } else {
            setErrorNeighborhood('Valor inválido')
            return false
        }
    }
    const validateCep = () => {
        if (/(^\d{5}\-\d{3}$)/.test(newCep)) {
            setErrorCep('')
            return true
        } else {
            setErrorCep('CEP inválido')
            return false
        }
    }
    const validateCity = () => {
        if (newCity !== '') {
            setErrorCity('')
            return true
        } else {
            setErrorCity('Valor inválido')
            return false
        }
    }
    const validateState = () => {
        if (/(^\D{2}$)/.test(newState) & statesList.includes(newState)) {
            setErrorState('')
            return true
        } else {
            setErrorState('Valor inválido')
            return false
        }
    }
    const copyToClipboard = (e) => {
        if(document.queryCommandSupported('copy')) {
            try {
                e.preventDefault()
                textAreaRef.current.select()
                document.execCommand('copy')
                toast.success('Link copiado com sucesso!', {
                    position: "bottom-center",
                    autoClose: 2800,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
            } catch (error) {
                console.log(error)
                toast.warn('Ocorreu algum erro, tente novamente.', {
                    position: "bottom-center",
                    autoClose: 2800,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
            }
        } else {
            toast.error('Seu navegador não suporta o recurso de cópia.', {
                position: "bottom-center",
                autoClose: 2800,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
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
            <input type="text" style={{ position: 'absolute', left: '-9999px' }} value={textArea} ref={textAreaRef} />
            {foundStoreowner ? <>
                <ToastContainer
                    position="bottom-center"
                    autoClose={2500}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnVisibilityChange
                    draggable
                    pauseOnHover
                />
                <div style={{padding: '10px 0'}} >
                    <Button
                        type="button"
                        cta="Compartilhar"
                        template="regular"
                        click={copyToClipboard}
                    />
                </div>
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
                    value={newRg}
                    onChange={({ target: { value } }) => setNewRg(value)}
                    validateInput={validateRg}
                    submit={inputEditUpdate(storeowner.cnpj, 'C', storeownerRow, { 'rg': newRg }, newRg, setLoadingRg, setErrorRg)}
                    setError={() => { }}
                    error={errorRg}
                    editable={true}
                    isLoading={loadingRg}
                />
                <InputEdit
                    name="CPF"
                    value={newCpf}
                    onChange={({ target: { value } }) => setNewCpf(maskInput(value, '###.###.###-##', true))}
                    validateInput={validateCpf}
                    submit={inputEditUpdate(storeowner.cnpj, 'D', storeownerRow, { 'cpf': newCpf }, newCpf, setLoadingCpf, setErrorCpf)}
                    setError={() => { }}
                    error={errorCpf}
                    editable={true}
                    isLoading={loadingCpf}
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
                    name="Rua (entrega)"
                    value={newStreet}
                    onChange={({ target: { value } }) => setNewStreet(value.toUpperCase())}
                    validateInput={validateStreet}
                    submit={inputEditUpdate(storeowner.cnpj, 'W', storeownerRow, { 'entrega': newStreet + ', ' + newNumber + ', ' + (newComplement ? newComplement + ', ' : '') + newNeighborhood }, newStreet + ', ' + newNumber + ', ' + (newComplement ? newComplement + ', ' : '') + newNeighborhood, setLoadingStreet, setErrorStreet)}
                    setError={() => { }}
                    error={errorStreet}
                    editable={true}
                    isLoading={loadingStreet}
                />
                <InputEdit
                    name="Número (entrega)"
                    value={newNumber}
                    onChange={({ target: { value } }) => setNewNumber(value)}
                    validateInput={validateNumber}
                    submit={inputEditUpdate(storeowner.cnpj, 'W', storeownerRow, { 'entrega': newStreet + ', ' + newNumber + ', ' + (newComplement ? newComplement + ', ' : '') + newNeighborhood }, newStreet + ', ' + newNumber + ', ' + (newComplement ? newComplement + ', ' : '') + newNeighborhood, setLoadingNumber, setErrorNumber)}
                    setError={() => { }}
                    error={errorNumber}
                    editable={true}
                    isLoading={loadingNumber}
                />
                <InputEdit
                    name="Complemento (entrega)"
                    value={newComplement}
                    onChange={({ target: { value } }) => setNewComplement(value.toUpperCase())}
                    validateInput={() => true}
                    submit={inputEditUpdate(storeowner.cnpj, 'W', storeownerRow, { 'entrega': newStreet + ', ' + newNumber + ', ' + (newComplement ? newComplement + ', ' : '') + newNeighborhood }, newStreet + ', ' + newNumber + ', ' + (newComplement ? newComplement + ', ' : '') + newNeighborhood, setLoadingComplement, setErrorComplement)}
                    setError={() => { }}
                    error={errorComplement}
                    editable={true}
                    isLoading={loadingComplement}
                />
                <InputEdit
                    name="Bairro (entrega)"
                    value={newNeighborhood? newNeighborhood : ''}
                    onChange={({ target: { value } }) => setNewNeighborhood(value.toUpperCase())}
                    validateInput={validateNeighborhood}
                    submit={inputEditUpdate(storeowner.cnpj, 'W', storeownerRow, { 'entrega': newStreet + ', ' + newNumber + ', ' + (newComplement ? newComplement + ', ' : '') + newNeighborhood }, newStreet + ', ' + newNumber + ', ' + (newComplement ? newComplement + ', ' : '') + newNeighborhood, setLoadingNeighborhood, setErrorNeighborhood)}
                    setError={() => { }}
                    error={errorNeighborhood}
                    editable={true}
                    isLoading={loadingNeighborhood}
                />
                <InputEdit
                    name="Cep (entrega)"
                    value={newCep}
                    onChange={({ target: { value } }) => setNewCep(maskInput(value, '#####-###', true))}
                    validateInput={validateCep}
                    submit={inputEditUpdate(storeowner.cnpj, 'X', storeownerRow, { 'cepEntrega': newCep }, newCep, setLoadingCep, setErrorCep)}
                    setError={() => { }}
                    error={errorCep}
                    editable={true}
                    isLoading={loadingCep}
                />
                <InputEdit
                    name="Cidade (entrega)"
                    value={newCity}
                    onChange={({ target: { value } }) => setNewCity(value.toUpperCase())}
                    validateInput={validateCity}
                    submit={inputEditUpdate(storeowner.cnpj, 'Y', storeownerRow, { 'cidadeEntrega': newCity }, newCity, setLoadingCity, setErrorCity)}
                    setError={() => { }}
                    error={errorCity}
                    editable={true}
                    isLoading={loadingCity}
                />
                <InputEdit
                    name="Estado (entrega)"
                    value={newState}
                    onChange={({ target: { value } }) => setNewState(maskInput(value.toUpperCase(), '##', false))}
                    validateInput={validateState}
                    submit={inputEditUpdate(storeowner.cnpj, 'Z', storeownerRow, { 'estadoEntrega': newState }, newState, setLoadingState, setErrorState)}
                    setError={() => { }}
                    error={errorState}
                    editable={true}
                    isLoading={loadingState}
                />
                <InputEdit
                    name="Telefone"
                    value={newFone}
                    onChange={({ target: { value } }) => setNewFone(maskInput(value, '(##) #####-####', true))}
                    validateInput={validateFone}
                    submit={inputEditUpdate(storeowner.cnpj, 'P', storeownerRow, { 'fone': newFone }, newFone, setLoadingFone, setErrorFone)}
                    setError={() => { }}
                    error={errorFone}
                    editable={true}
                    isLoading={loadingFone}
                />
                <InputEdit
                    name="Whatsapp"
                    value={newWhats}
                    onChange={({ target: { value } }) => setNewWhats(maskInput(value, '(##) #####-####', true))}
                    validateInput={validateWhats}
                    submit={inputEditUpdate(storeowner.cnpj, 'V', storeownerRow, { 'whats': newWhats }, newWhats, setLoadingWhats, setErrorWhats)}
                    setError={() => { }}
                    error={errorWhats}
                    editable={true}
                    isLoading={loadingWhats}
                />
                <InputEdit
                    name="Email"
                    value={newEmail}
                    onChange={({ target: { value } }) => setNewEmail(value.toLowerCase())}
                    validateInput={validateEmail}
                    submit={inputEditUpdate(storeowner.cnpj, 'Q', storeownerRow, { 'email': newEmail }, newEmail, setLoadingEmail, setErrorEmail)}
                    setError={() => { }}
                    error={errorEmail}
                    editable={true}
                    isLoading={loadingEmail}
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
                                    if (value !== '' && value !== 'Nenhum') {
                                        let person = affiliates.find(element => element[1] === value)
                                        if (person) {
                                            setAffiliateCpf(person[0])
                                            setAffiliateName(person[1])
                                        }
                                    } else {
                                        setAffiliateCpf('')
                                        setAffiliateName(value === 'Nenhum'? 'Nenhum' : '')
                                    }
                                }}
                                onChangeKeyboard={element => {
                                    if (element && element.value !== 'Nenhum') {
                                        let person = affiliates.find(affiliate => affiliate[1] === element.value)
                                        if (person) {
                                            setAffiliateCpf(person[0])
                                            setAffiliateName(person[1])
                                        }
                                    } else {
                                        setAffiliateCpf('')
                                        setAffiliateName(element.value === 'Nenhum'? 'Nenhum' : '')
                                    }
                                }
                                }
                                list={affiliates.map(affiliate => affiliate === 'Nenhum'? 'Nenhum' : Object.values(affiliate)[1])}
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
