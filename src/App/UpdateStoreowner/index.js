import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { post } from 'axios'
import InputEdit from '@bit/vitorbarbosa19.ziro.input-edit'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner'
import Error from '@bit/vitorbarbosa19.ziro.error'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import Button from '@bit/vitorbarbosa19.ziro.button'
import maskInput from '@ziro/mask-input'
import Illustration from '@bit/vitorbarbosa19.ziro.illustration'
import capitalize from '@ziro/capitalize'
import Modal from '@bit/vitorbarbosa19.ziro.modal'
import { alertColor, successColor } from '@ziro/theme'
import fetch from './fetch'
import { inputEditUpdate, formUpdate } from './sendToBackend'
import GetCnpj from './GetCnpj'
import { modalBox, container, titleError, svg } from './GetCnpj/styles'
import validateDocuments from '../utils/validateDocuments'

const UpdateStoreowner = () => {
    // SearchCnpjInfo
    const [errorMsg, setErrorMsg] = useState('')
    const [storeowner, setStoreowner] = useState({ 'cadastro': '', 'afiliado': '', 'afiliado_cpf': '', 'lojista': '', 'rg': '', 'cpf': '', 'nascimento': '', 'instagram': '', 'cnpj': '', 'ie': '', 'razao': '', 'fantasia': '', 'endereco': '', 'bairro': '', 'cep': '', 'cidade': '', 'estado': '', 'fone': '', 'email': '', 'assessor': '', 'vendedor': '', 'whats': '', 'entrega': '', 'bairroEntrega': '', 'cepEntrega': '', 'cidadeEntrega': '', 'estadoEntrega': '', vinculo: '' })
    const [storeowners, setStoreowners] = useState([])
    const setCnpjInfo = { setStoreowner, storeowner, setStoreowners }
    // Other Infos
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [foundStoreowner, setFoundStoreowner] = useState(false)
    const [searchedName, setSearchedName] = useState('')
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
    const [copyResultText, setCopyResultText] = useState('')
    const [copyResultStatus, setCopyResultStatus] = useState(true)
    const [link, setLink] = useState('')
    const [linkList, setLinkList] = useState([])
    const setState = { setAffiliateName, setAffiliateCpf, setAdvisor, setSalesman, setStoreowner, setLink, storeowner }
    const state = { affiliateName, affiliateCpf, advisor, salesman, storeowner, link, ...setState }
    const statesList = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']
    const validations = [
        {
            name: 'affiliate',
            validation: value => value === 'NENHUM' || affiliates.find(affiliate => affiliate[1] === value),
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
        }, {
            name: 'link',
            validation: value => linkList.includes(value),
            value: link,
            message: 'Vínculo inválido'
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
            if (user[8] === cnpj) {
                pos = index
            }
        })
        return pos + 1
    }

    const formatCorporateName = (corporateName) => {
        if (corporateName) {
            let cleanString = corporateName.replace(/[\.,-]/g, '')
            return cleanString.replace(/  /g, ' ').split(' ').join('-')
        } else return 'N/A'
    }

    const storeownerHandleSuccess = async person => {
        setFoundStoreowner(true)
        const partAddress = person[23] ? person[23].split(', ') : []
        setNewName(person[1] ? person[1].split(' ')[0] : '')
        setNewSurname(person[1] ? person[1].split(' ').slice(1).join(' ') : '')
        setNewBirthDate(person[6] ? person[6] : '')
        setNewInsta(person[7] ? person[7] : '')
        setNewIe(person[9] ? person[9] : '')
        setAffiliateName(person[18] ? person[18] : '')
        setAffiliateCpf(person[19] ? person[19] : '')
        setAdvisor(person[20] ? person[20] : '')
        setSalesman(person[21] ? person[21] : '')
        setNewRg(person[4] ? person[4] : '')
        setNewCpf(person[5] ? person[5] : '')
        setNewFone(person[17] ? person[17] : '')
        setNewWhats(person[2] ? person[2] : '')
        setNewStreet(partAddress[0] ? partAddress[0] : '')
        setNewNumber(partAddress[1] ? partAddress[1] : '')
        setNewComplement(partAddress.length === 3 ? partAddress[2] : '')
        setNewNeighborhood(person[24] ? person[24] : '')
        setNewCep(person[25] ? person[25] : '')
        setNewCity(person[26] ? person[26] : '')
        setNewState(person[27] ? person[27] : '')
        setTextArea(person[8] ? `https://interno.ziro.app/show-info?doc=${person[8]}&razao=${formatCorporateName(person[10])}` : '')
        setLink(person[22] ? person[22] : '')
        setStoreowner(Object.assign({ 'cadastro': person[0] ? person[0] : '', 'afiliado': person[18] ? person[18] : '', 'afiliado_cpf': person[19] ? person[19] : '', 'lojista': person[1] ? person[1] : '', 'rg': person[4] ? person[4] : '', 'cpf': person[5] ? person[5] : '', 'nascimento': person[6] ? person[6] : '', 'instagram': person[7] ? person[7] : '', 'cnpj': person[8] ? person[8] : '', 'ie': person[9] ? person[9] : '', 'razao': person[10] ? person[10] : '', 'fantasia': person[11] ? person[11] : '', 'endereco': person[12] ? person[12] : '', 'bairro': person[13] ? person[13] : '', 'cep': person[14] ? person[14] : '', 'cidade': person[15] ? person[15] : '', 'estado': person[16] ? person[16] : '', 'fone': person[17] ? person[17] : '', 'email': person[3] ? person[3] : '', 'assessor': person[20] ? person[20] : '', 'vendedor': person[21] ? person[21] : '', 'whats': person[2] ? person[2] : '', 'entrega': person[23] ? person[23] : '', 'bairroEntrega': person[24] ? person[24] : '', 'cepEntrega': person[25] ? person[25] : '', 'cidadeEntrega': person[26] ? person[26] : '', 'estadoEntrega': person[27] ? person[27] : '', 'vinculo': person[22] ? person[22] : '' }))
        if (person[8]) {
            let row = await findStoreownerRow(person[8])
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
        setNewWhats('')
        setNewStreet('')
        setNewNumber('')
        setNewComplement('')
        setNewNeighborhood('')
        setNewCep('')
        setNewCity('')
        setNewState('')
        setTextArea('')
        setLink('')
        setStoreowner({ 'cadastro': '', 'afiliado': '', 'afiliado_cpf': '', 'lojista': '', 'rg': '', 'cpf': '', 'nascimento': '', 'instagram': '', 'cnpj': '', 'ie': '', 'razao': '', 'fantasia': '', 'endereco': '', 'bairro': '', 'cep': '', 'cidade': '', 'estado': '', 'fone': '', 'email': '', 'assessor': '', 'vendedor': '', 'whats': '', 'entrega': '', 'bairroEntrega': '', 'cepEntrega': '', 'cidadeEntrega': '', 'estadoEntrega': '', 'vinculo': '' })
        setStoreownerRow('')
    }

    useEffect(() => fetch(setIsLoading, setIsError, setStoreowners, setAdvisors, setAffiliates, setSellers, setLinkList), [])

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
    const validateBirthDate = () => {
        if (newBirthDate === '' || /^(?:(?:31(\/)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/.test(newBirthDate)) {
            setErrorBirthDate('')
            return true
        } else {
            setErrorBirthDate('Data inválida')
            return false
        }
    }
    const validateCpf = () => {
        if (newCpf === '' || /(^\d{3}\.\d{3}\.\d{3}\-\d{2}$)|(^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$)/.test(newCpf) && (process.env.HOMOLOG ? true : validateDocuments(newCpf))) {
            setErrorCpf('')
            return true
        } else {
            setErrorCpf('CPF inválido')
            return false
        }
    }
    const validateFone = () => {
        if (newFone === '' || newFone.length <= 14 && /(^\(\d{2}\) \d{4}\-\d{4}$)/.test(newFone)
            || newFone.length === 15 && /(^\(\d{2}\) \d{5}\-\d{4}$)/.test(newFone)) {
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
    const validateCep = () => {
        if (newCep === '' || /(^\d{2}\.\d{3}\-\d{3}$)/.test(newCep)) {
            setErrorCep('')
            return true
        } else {
            setErrorCep('CEP inválido')
            return false
        }
    }
    const validateState = () => {
        if (newState === '' || /(^\D{2}$)/.test(newState) & statesList.includes(newState)) {
            setErrorState('')
            return true
        } else {
            setErrorState('Valor inválido')
            return false
        }
    }
    const copyToClipboard = (e) => {
        if (document.queryCommandSupported('copy')) {
            try {
                e.preventDefault()
                textAreaRef.current.select()
                document.execCommand('copy')
                setCopyResultStatus(true)
                setCopyResultText('Link copiado com sucesso!')
                setTimeout(() => {
                    setCopyResultText('')
                }, 2500)
            } catch (error) {
                console.log(error)
                setCopyResultStatus(false)
                setCopyResultText('Ocorreu um erro, tente novamente.')
                setTimeout(() => {
                    setCopyResultText('')
                }, 2500)
            }
        } else {
            setCopyResultStatus(false)
            setCopyResultText('Seu navegador não suporta o recurso de cópia.')
            setTimeout(() => {
                setCopyResultText('')
            }, 2500)
        }

    }

    if (isLoading) return <div style={{ display: 'grid' }}><Spinner size='5rem' /></div>
    if (isError) return <Error />
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Dropdown
                value={searchedName}
                onChange={({ target: { value } }) => {
                    if (value !== '') {
                        setSearchedName(value)
                        let person = storeowners.find(element => element[10] === value)
                        if (person) storeownerHandleSuccess(person)
                        else setFoundStoreowner(false)
                    } else storeownerHandleError()
                }}
                onChangeKeyboard={element => {
                    if (element) {
                        setSearchedName(element.value)
                        let person = storeowners.find(storeowner => storeowner[10] === element.value)
                        if (person) storeownerHandleSuccess(person)
                        else setFoundStoreowner(false)
                    } else storeownerHandleError()
                }}
                list={storeowners.map(storeowner => `${Object.values(storeowner)[10]}`).sort()}
                placeholder="Pesquise o lojista"
            />
            <input type="text" style={{ position: 'absolute', left: '-9999px' }} value={textArea} ref={textAreaRef} readOnly />
            {foundStoreowner ? <>
                <div style={{ padding: '20px 0 10px' }} >
                    <Button
                        type="button"
                        cta="Compartilhar"
                        template="regular"
                        click={copyToClipboard}
                    />
                </div>
                {errorMsg ? (
                    <Modal boxStyle={modalBox} isOpen={errorMsg} setIsOpen={() => { }}>
                        <div style={container}>
                            <div style={svg} ><Illustration type="paymentError" size={200} /></div>
                            <label style={titleError}>{errorMsg || 'Erro ao tentar consultar a receita'}</label>
                            <label>Solicite suporte se necessário</label>
                            <div style={{ marginBottom: '15px' }}>
                                <Button type='link' cta='Tentar novamente' navigate={() => setErrorMsg(false)} />
                            </div>
                        </div>
                    </Modal>
                ) : (
                        <div style={{ marginBottom: '20px' }}>
                            <GetCnpj cnpj={storeowner.cnpj} setState={setCnpjInfo} setErrorMsg={setErrorMsg} />
                        </div>
                    )}
                {copyResultText ?
                    <div style={{ padding: '5px 0 0', fontSize: '15px', color: copyResultStatus ? successColor : alertColor, textAlign: 'center' }} >
                        <span>{copyResultText}</span>
                    </div>
                    : <div style={{ height: '26px' }}>&nbsp;</div>
                }
                {storeowner.vinculo && storeowner.vinculo !== 'NENHUM' ? <InputEdit
                    name="Vínculo"
                    value={storeowner.vinculo}
                    onChange={() => { }}
                    validateInput={() => { }}
                    submit={() => { }}
                    setError={() => { }}
                    error={''}
                    editable={false}
                    isLoading={false}
                /> : <></>}
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
                    submit={inputEditUpdate(storeowner.cnpj, 'B', storeownerRow, { 'fname': newName }, `${newName} ${newSurname}`, setLoadingName, setErrorName)}
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
                    submit={inputEditUpdate(storeowner.cnpj, 'B', storeownerRow, { 'lname': newSurname }, `${newName} ${newSurname}`, setLoadingSurname, setErrorSurname)}
                    setError={() => { }}
                    error={errorSurname}
                    editable={true}
                    isLoading={loadingSurname}
                />
                <InputEdit
                    name="RG"
                    value={newRg}
                    onChange={({ target: { value } }) => setNewRg(value)}
                    validateInput={() => true}
                    submit={inputEditUpdate(storeowner.cnpj, 'E', storeownerRow, { 'rg': newRg }, newRg, setLoadingRg, setErrorRg)}
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
                    submit={inputEditUpdate(storeowner.cnpj, 'F', storeownerRow, { 'cpf': newCpf }, newCpf, setLoadingCpf, setErrorCpf)}
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
                    submit={inputEditUpdate(storeowner.cnpj, 'G', storeownerRow, { 'nascimento': newBirthDate }, newBirthDate, setLoadingBirthDate, setErrorBirthDate)}
                    setError={() => { }}
                    error={errorBirthDate}
                    editable={true}
                    isLoading={loadingBirthDate}
                />
                <InputEdit
                    name="Instagram da loja"
                    value={newInsta}
                    onChange={({ target: { value } }) => setNewInsta(value)}
                    validateInput={() => true}
                    submit={inputEditUpdate(storeowner.cnpj, 'H', storeownerRow, { 'instagram': newInsta.replace('@', '').trim().toLowerCase() }, newInsta.replace('@', '').trim().toLowerCase(), setLoadingInsta, setErrorInsta)}
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
                    validateInput={() => true}
                    submit={inputEditUpdate(storeowner.cnpj, 'J', storeownerRow, { 'ie': newIe }, newIe, setLoadingIe, setErrorIe)}
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
                    value={storeowner.endereco.split(', ')[2] ? storeowner.endereco.split(', ')[2] : ''}
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
                    validateInput={() => true}
                    submit={inputEditUpdate(storeowner.cnpj, 'X', storeownerRow, { 'entrega': newComplement ? (newStreet ? `${newStreet}, ` : '') + (newNumber ? `${newNumber}, ` : '') + newComplement : (newStreet ? `${newStreet}, ` : '') + (newNumber ? `${newNumber}` : '') }, newComplement ? (newStreet ? `${newStreet}, ` : '') + (newNumber ? `${newNumber}, ` : '') + newComplement : (newStreet ? `${newStreet}, ` : '') + (newNumber ? `${newNumber}` : ''), setLoadingStreet, setErrorStreet)}
                    setError={() => { }}
                    error={errorStreet}
                    editable={true}
                    isLoading={loadingStreet}
                />
                <InputEdit
                    name="Número (entrega)"
                    value={newNumber}
                    onChange={({ target: { value } }) => setNewNumber(value)}
                    validateInput={() => true}
                    submit={inputEditUpdate(storeowner.cnpj, 'X', storeownerRow, { 'entrega': newComplement ? (newStreet ? `${newStreet}, ` : '') + (newNumber ? `${newNumber}, ` : '') + newComplement : (newStreet ? `${newStreet}, ` : '') + (newNumber ? `${newNumber}` : '') }, newComplement ? (newStreet ? `${newStreet}, ` : '') + (newNumber ? `${newNumber}, ` : '') + newComplement : (newStreet ? `${newStreet}, ` : '') + (newNumber ? `${newNumber}` : ''), setLoadingNumber, setErrorNumber)}
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
                    submit={inputEditUpdate(storeowner.cnpj, 'X', storeownerRow, { 'entrega': newComplement ? (newStreet ? `${newStreet}, ` : '') + (newNumber ? `${newNumber}, ` : '') + newComplement : (newStreet ? `${newStreet}, ` : '') + (newNumber ? `${newNumber}` : '') }, newComplement ? (newStreet ? `${newStreet}, ` : '') + (newNumber ? `${newNumber}, ` : '') + newComplement : (newStreet ? `${newStreet}, ` : '') + (newNumber ? `${newNumber}` : ''), setLoadingComplement, setErrorComplement)}
                    setError={() => { }}
                    error={errorComplement}
                    editable={true}
                    isLoading={loadingComplement}
                />
                <InputEdit
                    name="Bairro (entrega)"
                    value={newNeighborhood ? newNeighborhood : ''}
                    onChange={({ target: { value } }) => setNewNeighborhood(value.toUpperCase())}
                    validateInput={() => true}
                    submit={inputEditUpdate(storeowner.cnpj, 'Y', storeownerRow, { 'bairroEntrega': newNeighborhood }, newNeighborhood, setLoadingNeighborhood, setErrorNeighborhood)}
                    setError={() => { }}
                    error={errorNeighborhood}
                    editable={true}
                    isLoading={loadingNeighborhood}
                />
                <InputEdit
                    name="Cep (entrega)"
                    value={newCep}
                    onChange={({ target: { value } }) => setNewCep(maskInput(value, '##.###-###', true))}
                    validateInput={validateCep}
                    submit={inputEditUpdate(storeowner.cnpj, 'Z', storeownerRow, { 'cepEntrega': newCep }, newCep, setLoadingCep, setErrorCep)}
                    setError={() => { }}
                    error={errorCep}
                    editable={true}
                    isLoading={loadingCep}
                />
                <InputEdit
                    name="Cidade (entrega)"
                    value={newCity}
                    onChange={({ target: { value } }) => setNewCity(value.toUpperCase())}
                    validateInput={() => true}
                    submit={inputEditUpdate(storeowner.cnpj, 'AA', storeownerRow, { 'cidadeEntrega': newCity }, newCity, setLoadingCity, setErrorCity)}
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
                    submit={inputEditUpdate(storeowner.cnpj, 'AB', storeownerRow, { 'estadoEntrega': newState }, newState, setLoadingState, setErrorState)}
                    setError={() => { }}
                    error={errorState}
                    editable={true}
                    isLoading={loadingState}
                />
                <InputEdit
                    name="Telefone"
                    value={newFone}
                    onChange={({ target: { value } }) => {
                        let mask = value.length <= 14 ? '(##) ####-####' : '(##) #####-####'
                        setNewFone(maskInput(value, mask, true))
                    }}
                    validateInput={validateFone}
                    submit={inputEditUpdate(storeowner.cnpj, 'R', storeownerRow, { 'fone': newFone }, newFone, setLoadingFone, setErrorFone)}
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
                    submit={inputEditUpdate(storeowner.cnpj, 'C', storeownerRow, { 'whatsapp': newWhats }, newWhats, setLoadingWhats, setErrorWhats)}
                    setError={() => { }}
                    error={errorWhats}
                    editable={true}
                    isLoading={loadingWhats}
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
                    sendToBackend={formUpdate ? formUpdate(state, storeowner.cnpj, storeownerRow) : null}
                    inputs={[
                        <FormInput name='affiliate' label='Afiliado(a)' input={
                            <Dropdown
                                value={affiliateName}
                                onChange={({ target: { value } }) => {
                                    if (value !== '' && value !== 'NENHUM') {
                                        let person = affiliates.find(element => element[1] === value)
                                        if (person) {
                                            setAffiliateCpf(person[0])
                                            setAffiliateName(person[1])
                                        }
                                    } else {
                                        setAffiliateCpf('')
                                        setAffiliateName(value === 'NENHUM' ? 'NENHUM' : '')
                                    }
                                }}
                                onChangeKeyboard={element => {
                                    if (element && element.value !== 'NENHUM') {
                                        let person = affiliates.find(affiliate => affiliate[1] === element.value)
                                        if (person) {
                                            setAffiliateCpf(person[0])
                                            setAffiliateName(person[1])
                                        }
                                    } else {
                                        setAffiliateCpf('')
                                        setAffiliateName(element.value === 'NENHUM' ? 'NENHUM' : '')
                                    }
                                }
                                }
                                list={affiliates.map(affiliate => affiliate === 'NENHUM' ? 'NENHUM' : Object.values(affiliate)[1])}
                                placeholder="Nome do(a) afiliado(a)"
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
                            />
                        } />,
                        <FormInput name='link' label='Vínculo' input={
                            <Dropdown
                                value={link}
                                onChange={({ target: { value } }) => setLink(value.toUpperCase())}
                                onChangeKeyboard={element =>
                                    element ? setLink(element.value) : null
                                }
                                list={linkList}
                                placeholder="Razão social vinculada"
                            />
                        } />
                    ]}
                />
            </> : <></>}
        </motion.div>
    )
}

export default UpdateStoreowner
