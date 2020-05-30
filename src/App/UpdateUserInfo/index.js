import React, { useState, useContext } from 'react'
import { motion } from 'framer-motion'
import { userContext } from '../appContext'
import InputEdit from '@bit/vitorbarbosa19.ziro.input-edit'
import maskInput from '@ziro/mask-input'
import capitalize from '@ziro/capitalize'
import currencyFormat from '@ziro/currency-format'
import sendToBackend from './sendToBackend'

const UpdateUserInfo = () => {
    const { uid, userPos, name, nickname, cpf, height, emergencyContact, initialDate, maritalStatus, github, birthDate, emergencyName, issuingBody, kinship, weight, rg, shippingDate, personalPhone, amountCharged, cep, city, cityState, address, bankNumber, accountNumber, agency } = useContext(userContext)
    const partAddress = address ? address.split(', ') : []
    const [newName, setNewName] = useState(name)
    const [errorName, setErrorName] = useState('')
    const [loadingName, setLoadingName] = useState(false)
    const [newBirthDate, setNewBirthDate] = useState(birthDate)
    const [errorBirthDate, setErrorBirthDate] = useState('')
    const [loadingBirthDate, setLoadingBirthDate] = useState(false)
    const [newPersonalPhone, setNewPersonalPhone] = useState(personalPhone.split('55 ')[1])
    const [errorPersonalPhone, setErrorPersonalPhone] = useState('')
    const [loadingPersonalPhone, setLoadingPersonalPhone] = useState(false)
    const [newGithub, setNewGithub] = useState(github)
    const [errorGithub, setErrorGithub] = useState('')
    const [loadingGithub, setLoadingGithub] = useState(false)
    const [newHeight, setNewHeight] = useState(height)
    const [errorHeight, setErrorHeight] = useState('')
    const [loadingHeight, setLoadingHeight] = useState(false)
    const [newWeight, setNewWeight] = useState(weight)
    const [errorWeight, setErrorWeight] = useState('')
    const [loadingWeight, setLoadingWeight] = useState(false)
    const [newEmergencyName, setNewEmergencyName] = useState(emergencyName)
    const [errorEmergencyName, setErrorEmergencyName] = useState('')
    const [loadingEmergencyName, setLoadingEmergencyName] = useState(false)
    const [newKinship, setNewKinship] = useState(kinship)
    const [errorKinship, setErrorKinship] = useState('')
    const [loadingKinship, setLoadingKinship] = useState(false)
    const [newEmergencyContact, setNewEmergencyContact] = useState(emergencyContact.split('55 ')[1])
    const [errorEmergencyContact, setErrorEmergencyContact] = useState('')
    const [loadingEmergencyContact, setLoadingEmergencyContact] = useState(false)
    const [newCep, setNewCep] = useState(cep)
    const [errorCep, setErrorCep] = useState('')
    const [loadingCep, setLoadingCep] = useState(false)
    const [newCity, setNewCity] = useState(city)
    const [errorCity, setErrorCity] = useState('')
    const [loadingCity, setLoadingCity] = useState(false)
    const [newCityState, setNewCityState] = useState(cityState)
    const [errorCityState, setErrorCityState] = useState('')
    const [loadingCityState, setLoadingCityState] = useState(false)
    const [street, setStreet] = useState(partAddress[0])
    const [errorStreet, setErrorStreet] = useState('')
    const [loadingStreet, setLoadingStreet] = useState(false)
    const [number, setNumber] = useState(partAddress[1])
    const [errorNumber, setErrorNumber] = useState('')
    const [loadingNumber, setLoadingNumber] = useState(false)
    const [complement, setComplement] = useState(partAddress.length === 4 ? address.split(', ')[2] : '')
    const [errorComplement, setErrorComplement] = useState('')
    const [loadingComplement, setLoadingComplement] = useState(false)
    const [neighborhood, setNeighborhood] = useState(partAddress.length === 4 ? address.split(', ')[3] : address.split(', ')[2])
    const [errorNeighborhood, setErrorNeighborhood] = useState('')
    const [loadingNeighborhood, setLoadingNeighborhood] = useState(false)
    const [newBankNumber, setNewBankNumber] = useState(bankNumber ? bankNumber : '')
    const [errorBankNumber, setErrorBankNumber] = useState('')
    const [loadingBankNumber, setLoadingBankNumber] = useState(false)
    const [newAccountNumber, setNewAccountNumber] = useState(accountNumber ? accountNumber : '')
    const [errorAccountNumber, setErrorAccountNumber] = useState('')
    const [loadingAccountNumber, setLoadingAccountNumber] = useState(false)
    const [newAgency, setNewAgency] = useState(agency ? agency : '')
    const [errorAgency, setErrorAgency] = useState('')
    const [loadingAgency, setLoadingAgency] = useState(false)
    const [newMaritalStatus, setNewMaritalStatus] = useState(maritalStatus)
    const [errorMaritalStatus, setErrorMaritalStatus] = useState('')
    const [loadingMaritalStatus, setLoadingMaritalStatus] = useState(false)
    const maritalStatusList = ['Casado(a)', 'Divorciado(a)', 'Separado(a)', 'Solteiro(a)', 'Viúvo(a)']
    const statesList = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']

    const validateName = () => {
        if (newName !== '') {
            setErrorName('')
            return true
        } else {
            setErrorName('Valor inválido')
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
    const validatePersonalPhone = () => {
        if (/(^\(\d{2}\) \d{5}\-\d{4}$)/.test(newPersonalPhone)) {
            setErrorPersonalPhone('')
            return true
        } else {
            setErrorPersonalPhone('Telefone inválido')
            return false
        }
    }
    const validateGithub = () => {
        if (newGithub !== '') {
            setErrorGithub('')
            return true
        } else {
            setErrorGithub('Valor inválido')
            return false
        }
    }
    const validateHeight = () => {
        if ((/((^\d{1}\.\d{2}$))/.test(newHeight) | /((^\d{1}\.\d{1}$))/.test(newHeight)) && parseFloat(newHeight) <= 2.5) {
            setErrorHeight('')
            return true
        } else {
            setErrorHeight('Valor inválido')
            return false
        }
    }
    const validateWeight = () => {
        if (parseInt(newWeight) >= 30 && parseInt(newWeight) <= 300) {
            setErrorWeight('')
            return true
        } else {
            setErrorWeight('Valor inválido')
            return false
        }
    }
    const validateEmergencyName = () => {
        if (newEmergencyName !== '') {
            setErrorEmergencyName('')
            return true
        } else {
            setErrorEmergencyName('Valor inválido')
            return false
        }
    }
    const validateKinship = () => {
        if (newKinship !== '') {
            setErrorKinship('')
            return true
        } else {
            setErrorKinship('Valor inválido')
            return false
        }
    }
    const validateEmergencyContact = () => {
        if (/(^\(\d{2}\) \d{5}\-\d{4}$)/.test(newEmergencyContact)) {
            setErrorEmergencyContact('')
            return true
        } else {
            setErrorEmergencyContact('Telefone inválido')
            return false
        }
    }
    const validateCep = () => {
        if (/(^\d{5}\-\d{3}$)/.test(newCep)) {
            setErrorCep('')
            return true
        } else {
            setErrorCep('Cep inválido')
            return false
        }
    }
    const validateStreet = () => {
        if (street !== '') {
            setErrorStreet('')
            return true
        } else {
            setErrorStreet('Valor inválido')
            return false
        }
    }
    const validateNumber = () => {
        if (number !== '') {
            setErrorNumber('')
            return true
        } else {
            setErrorNumber('Valor inválido')
            return false
        }
    }
    const validateNeighborhood = () => {
        if (neighborhood !== '') {
            setErrorNeighborhood('')
            return true
        } else {
            setErrorNeighborhood('Valor inválido')
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
    const validateCityState = () => {
        if (statesList.includes(newCityState)) {
            setErrorCityState('')
            return true
        } else {
            setErrorCityState('Estado inválido')
            return false
        }
    }
    const validateMaritalStatus = () => {
        if (maritalStatusList.includes(newMaritalStatus)) {
            setErrorMaritalStatus('')
            return true
        } else {
            setErrorMaritalStatus('Valor inválido')
            return false
        }
    }
    const validateBank = () => {
        if (newBankNumber !== '') {
            setErrorBankNumber('')
            return true
        } else {
            setErrorBankNumber('Valor inválido')
            return false
        }
    }
    const validateAccount = () => {
        if (newAccountNumber !== '') {
            setErrorAccountNumber('')
            return true
        } else {
            setErrorAccountNumber('Valor inválido')
            return false
        }
    }
    const validateAgency = () => {
        if (newAgency !== '') {
            setErrorAgency('')
            return true
        } else {
            setErrorAgency('Valor inválido')
            return false
        }
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <InputEdit
                name="Nome Completo"
                value={newName}
                onChange={({ target: { value } }) => setNewName(capitalize(value))}
                validateInput={validateName}
                submit={sendToBackend(uid, 'C', userPos, { 'nome': newName }, newName, setLoadingName, setErrorName)}
                setError={() => { }}
                error={errorName}
                placeholder="digite aqui..."
                editable={true}
                isLoading={loadingName}
            />
            <InputEdit
                name="Apelido"
                value={nickname}
                onChange={() => { }}
                validateInput={() => { }}
                submit={() => { }}
                setError={() => { }}
                error={''}
                placeholder=""
                editable={false}
                isLoading={false}
            />
            <InputEdit
                name="Nascimento"
                value={newBirthDate}
                onChange={({ target: { value } }) => setNewBirthDate(maskInput(value, '##/##/####', true))}
                validateInput={validateBirthDate}
                submit={sendToBackend(uid, 'E', userPos, { 'nascimento': newBirthDate }, newBirthDate, setLoadingBirthDate, setErrorBirthDate)}
                setError={() => { }}
                error={errorBirthDate}
                placeholder="digite aqui..."
                editable={true}
                isLoading={loadingBirthDate}
                inputMode='numeric'
            />
            <InputEdit
                name="CPF"
                value={cpf}
                onChange={() => { }}
                validateInput={() => { }}
                submit={() => { }}
                setError={() => { }}
                error={''}
                editable={false}
                isLoading={false}
                inputMode='numeric'
            />
            <InputEdit
                name="RG"
                value={rg}
                onChange={() => { }}
                validateInput={() => { }}
                submit={() => { }}
                setError={() => { }}
                error={''}
                editable={false}
                isLoading={false}
                inputMode='numeric'
            />
            <InputEdit
                name="Órgão expeditor"
                value={issuingBody}
                onChange={() => { }}
                validateInput={() => { }}
                submit={() => { }}
                setError={() => { }}
                error={''}
                editable={false}
                isLoading={false}
            />
            <InputEdit
                name="Data de expedição"
                value={shippingDate}
                onChange={() => { }}
                validateInput={() => { }}
                submit={() => { }}
                setError={() => { }}
                error={''}
                editable={false}
                isLoading={false}
            />
            <InputEdit
                name="Estado Civil"
                value={newMaritalStatus}
                onChange={({ target: { value } }) => setNewMaritalStatus(capitalize(value))}
                validateInput={validateMaritalStatus}
                submit={sendToBackend(uid, 'J', userPos, { 'estadoCivil': newMaritalStatus }, newMaritalStatus, setLoadingMaritalStatus, setErrorMaritalStatus)}
                setError={() => { }}
                error={errorMaritalStatus}
                placeholder="Solteiro(a)"
                editable={true}
                isLoading={loadingMaritalStatus}
            />
            <InputEdit
                name="Telefone pessoal"
                value={newPersonalPhone}
                onChange={({ target: { value } }) => setNewPersonalPhone(maskInput(value, '(##) #####-####', true))}
                validateInput={validatePersonalPhone}
                submit={sendToBackend(uid, 'K', userPos, { 'telefone': '55 ' + newPersonalPhone }, '55 ' + newPersonalPhone, setLoadingPersonalPhone, setErrorPersonalPhone)}
                setError={() => { }}
                error={errorPersonalPhone}
                placeholder="digite aqui..."
                editable={true}
                isLoading={loadingPersonalPhone}
                inputMode='tel'
            />
            <InputEdit
                name="Github"
                value={newGithub}
                onChange={({ target: { value } }) => setNewGithub(value)}
                validateInput={validateGithub}
                submit={sendToBackend(uid, 'M', userPos, { 'github': newGithub }, newGithub, setLoadingGithub, setErrorGithub)}
                setError={() => { }}
                error={errorGithub}
                placeholder="digite aqui..."
                editable={true}
                isLoading={loadingGithub}
            />
            <InputEdit
                name="Cep"
                value={newCep}
                onChange={({ target: { value } }) => setNewCep(maskInput(value, '#####-###', true))}
                validateInput={validateCep}
                submit={sendToBackend(uid, 'O', userPos, { 'cep': newCep }, newCep, setLoadingCep, setErrorCep)}
                setError={() => { }}
                error={errorCep}
                placeholder="digite aqui..."
                editable={true}
                isLoading={loadingCep}
                inputMode='numeric'
            />
            <InputEdit
                name="Rua"
                value={street}
                onChange={({ target: { value } }) => setStreet(value.toUpperCase())}
                validateInput={validateStreet}
                submit={sendToBackend(uid, 'N', userPos, { 'endereco': street + ', ' + number + ', ' + (complement ? complement + ', ' : '') + neighborhood }, street + ', ' + number + ', ' + (complement ? complement + ', ' : '') + neighborhood, setLoadingStreet, setErrorStreet)}
                setError={() => { }}
                error={errorStreet}
                placeholder="digite aqui..."
                editable={true}
                isLoading={loadingStreet}
            />
            <InputEdit
                name="Número"
                value={number}
                onChange={({ target: { value } }) => setNumber(value)}
                validateInput={validateNumber}
                submit={sendToBackend(uid, 'N', userPos, { 'endereco': street + ', ' + number + ', ' + (complement ? complement + ', ' : '') + neighborhood }, street + ', ' + number + ', ' + (complement ? complement + ', ' : '') + neighborhood, setLoadingNumber, setErrorNumber)}
                setError={() => { }}
                error={errorNumber}
                placeholder="digite aqui..."
                editable={true}
                isLoading={loadingNumber}
                inputMode='numeric'
            />
            <InputEdit
                name="Complemento"
                value={complement}
                onChange={({ target: { value } }) => setComplement(value.toUpperCase())}
                validateInput={() => true}
                submit={sendToBackend(uid, 'N', userPos, { 'endereco': street + ', ' + number + ', ' + (complement ? complement + ', ' : '') + neighborhood }, street + ', ' + number + ', ' + (complement ? complement + ', ' : '') + neighborhood, setLoadingComplement, setErrorComplement)}
                setError={() => { }}
                error={errorComplement}
                placeholder="digite aqui..."
                editable={true}
                isLoading={loadingComplement}
            />
            <InputEdit
                name="Bairro"
                value={neighborhood}
                onChange={({ target: { value } }) => setNeighborhood(value.toUpperCase())}
                validateInput={validateNeighborhood}
                submit={sendToBackend(uid, 'N', userPos, { 'endereco': street + ', ' + number + ', ' + (complement ? complement + ', ' : '') + neighborhood }, street + ', ' + number + ', ' + (complement ? complement + ', ' : '') + neighborhood, setLoadingNeighborhood, setErrorNeighborhood)}
                setError={() => { }}
                error={errorNeighborhood}
                placeholder="digite aqui..."
                editable={true}
                isLoading={loadingNeighborhood}
            />
            <InputEdit
                name="Cidade"
                value={newCity}
                onChange={({ target: { value } }) => setNewCity(value.toUpperCase())}
                validateInput={validateCity}
                submit={sendToBackend(uid, 'P', userPos, { 'cidade': newCity }, newCity, setLoadingCity, setErrorCity)}
                setError={() => { }}
                error={errorCity}
                placeholder="digite aqui..."
                editable={true}
                isLoading={loadingCity}
            />
            <InputEdit
                name="Estado"
                value={newCityState}
                onChange={({ target: { value } }) => setNewCityState(maskInput(value.toUpperCase(), '##', false))}
                validateInput={validateCityState}
                submit={sendToBackend(uid, 'Q', userPos, { 'estado': newCityState }, newCityState, setLoadingCityState, setErrorCityState)}
                setError={() => { }}
                error={errorCityState}
                placeholder="digite aqui..."
                editable={true}
                isLoading={loadingCityState}
            />
            <InputEdit
                name="Data de início"
                value={initialDate}
                onChange={() => { }}
                validateInput={() => { }}
                submit={() => { }}
                setError={() => { }}
                error={''}
                placeholder="digite aqui..."
                editable={false}
                isLoading={false}
                inputMode='numeric'
            />
            <InputEdit
                name="Valor cobrado"
                value={currencyFormat(parseFloat(amountCharged) * 100)}
                onChange={() => { }}
                validateInput={() => { }}
                submit={() => { }}
                setError={() => { }}
                error={''}
                placeholder="digite aqui..."
                editable={false}
                isLoading={false}
            />
            <InputEdit
                name="Altura em metros"
                value={newHeight}
                onChange={({ target: { value } }) => setNewHeight(maskInput(value, '#.##', true))}
                validateInput={validateHeight}
                submit={sendToBackend(uid, 'W', userPos, { 'altura': newHeight }, newHeight, setLoadingHeight, setErrorHeight)}
                setError={() => { }}
                error={errorHeight}
                placeholder="digite aqui..."
                editable={true}
                isLoading={loadingHeight}
                inputMode='numeric'
            />
            <InputEdit
                name="Peso em quilogramas"
                value={newWeight}
                onChange={({ target: { value } }) => setNewWeight(maskInput(value, '###', true))}
                validateInput={validateWeight}
                submit={sendToBackend(uid, 'X', userPos, { peso: newWeight }, newWeight, setLoadingWeight, setErrorWeight)}
                setError={() => { }}
                error={errorWeight}
                placeholder="digite aqui..."
                editable={true}
                isLoading={loadingWeight}
                inputMode='numeric'
            />
            <InputEdit
                name="Nome contato de emergência"
                value={newEmergencyName}
                onChange={({ target: { value } }) => setNewEmergencyName(value)}
                validateInput={validateEmergencyName}
                submit={sendToBackend(uid, 'Y', userPos, { 'nomeEmergencia': newEmergencyName }, newEmergencyName, setLoadingEmergencyName, setErrorEmergencyName)}
                setError={() => { }}
                error={errorEmergencyName}
                placeholder="digite aqui..."
                editable={true}
                isLoading={loadingEmergencyName}
            />
            <InputEdit
                name="Parentesco"
                value={newKinship}
                onChange={({ target: { value } }) => setNewKinship(value)}
                validateInput={validateKinship}
                submit={sendToBackend(uid, 'Z', userPos, { 'parentesco': newKinship }, newKinship, setLoadingKinship, setErrorKinship)}
                setError={() => { }}
                error={errorKinship}
                placeholder="digite aqui..."
                editable={true}
                isLoading={loadingKinship}
            />
            <InputEdit
                name="Contato de emergência"
                value={newEmergencyContact}
                onChange={({ target: { value } }) => setNewEmergencyContact(maskInput(value, '(##) #####-####', true))}
                validateInput={validateEmergencyContact}
                submit={sendToBackend(uid, 'AA', userPos, { 'contatoEmergencia': '55 ' + newEmergencyContact }, '55 ' + newEmergencyContact, setLoadingEmergencyContact, setErrorEmergencyContact)}
                setError={() => { }}
                error={errorEmergencyContact}
                placeholder="digite aqui..."
                editable={true}
                isLoading={loadingEmergencyContact}
                inputMode='tel'
            />
            <InputEdit
                name="Número do Banco"
                value={newBankNumber}
                onChange={({ target: { value } }) => setNewBankNumber(maskInput(value, '###', false))}
                validateInput={validateBank}
                submit={sendToBackend(uid, 'AB', userPos, { 'banco': newBankNumber }, newBankNumber, setLoadingBankNumber, setErrorBankNumber)}
                setError={() => { }}
                error={errorBankNumber}
                placeholder="digite aqui..."
                editable={true}
                isLoading={loadingBankNumber}
                inputMode='numeric'
            />
            <InputEdit
                name="Número da Conta"
                value={newAccountNumber}
                onChange={({ target: { value } }) => setNewAccountNumber(value)}
                validateInput={validateAccount}
                submit={sendToBackend(uid, 'AC', userPos, { 'conta': newAccountNumber }, newAccountNumber, setLoadingAccountNumber, setErrorAccountNumber)}
                setError={() => { }}
                error={errorAccountNumber}
                placeholder="digite aqui..."
                editable={true}
                isLoading={loadingAccountNumber}
                inputMode='numeric'
            />
            <InputEdit
                name="Agência"
                value={newAgency}
                onChange={({ target: { value } }) => setNewAgency(value)}
                validateInput={validateAgency}
                submit={sendToBackend(uid, 'AD', userPos, { 'agencia': newAgency }, newAgency, setLoadingAgency, setErrorAgency)}
                setError={() => { }}
                error={errorAgency}
                placeholder="digite aqui..."
                editable={true}
                isLoading={loadingAgency}
                inputMode='numeric'
            />
        </motion.div>
    )
}

export default UpdateUserInfo
