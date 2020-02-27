import React, { useState, useContext } from 'react'
import { get } from 'axios'
import { userContext } from '../appContext'
import InputEdit from '@bit/vitorbarbosa19.ziro.input-edit'
import { containerWithPadding } from '@ziro/theme'
import maskInput from '@ziro/mask-input'
import capitalize from '@ziro/capitalize'
import sendToBackend from './sendToBackend'

const UpdateUserInfo = () => {
    const { uid, userPos, name, nickname, cpf, height, emergencyContact, initialDate, scope, maritalStatus, github, paymentModel, birthDate, emergencyName, issuingBody, kinship, weight, rg, shippingDate, personalPhone, amountCharged, cep, city, cityState, address } = useContext(userContext)
    const [newName, setNewName] = useState(name)
    const [errorName, setErrorName] = useState('')
    const [loadingName, setLoadingName] = useState(false)
    const [newNickname, setNewNickname] = useState(nickname)
    const [errorNickname, setErrorNickname] = useState('')
    const [loadingNickname, setLoadingNickname] = useState(false)
    const [newBirthDate, setNewBirthDate] = useState(birthDate)
    const [errorBirthDate, setErrorBirthDate] = useState('')
    const [loadingBirthDate, setLoadingBirthDate] = useState(false)
    const [newPersonalPhone, setNewPersonalPhone] = useState(personalPhone.split('+55 ')[1])
    const [errorPersonalPhone, setErrorPersonalPhone] = useState('')
    const [loadingPersonalPhone, setLoadingPersonalPhone] = useState(false)
    const [newGithub, setNewGithub] = useState(github)
    const [errorGithub, setErrorGithub] = useState('')
    const [loadingGithub, setLoadingGithub] = useState(false)
    const [newAmountCharged, setNewAmountCharged] = useState(amountCharged)
    const [errorAmountCharged, setErrorAmountCharged] = useState('')
    const [loadingAmountCharged, setLoadingAmountCharged] = useState(false)
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
    const [newEmergencyContact, setNewEmergencyContact] = useState(emergencyContact.split('+55 ')[1])
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
    const [street, setStreet] = useState(address.split(', ')[0])
    const [errorStreet, setErrorStreet] = useState('')
    const [loadingStreet, setLoadingStreet] = useState(false)
    const [number, setNumber] = useState(address.split(', ')[1])
    const [errorNumber, setErrorNumber] = useState('')
    const [loadingNumber, setLoadingNumber] = useState(false)
    const [complement, setComplement] = useState(address.split(', ')[2])
    const [errorComplement, setErrorComplement] = useState('')
    const [loadingComplement, setLoadingComplement] = useState(false)
    const [neighborhood, setNeighborhood] = useState(address.split(', ')[3])
    const [errorNeighborhood, setErrorNeighborhood] = useState('')
    const [loadingNeighborhood, setLoadingNeighborhood] = useState(false)
    const [searchingCep, isSearchingCep] = useState(false)
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
    const validateNick = () => {
        if (newNickname !== '') {
            setErrorNickname('')
            return true
        } else {
            setErrorNickname('Valor inválido')
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
    const validateAmountCharged = () => {
        if (newAmountCharged !== '') {
            setErrorAmountCharged('')
            return true
        } else {
            setErrorAmountCharged('Valor inválido')
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
        if (/(^\D{2}$)/.test(cityState) & statesList.includes(cityState)) {
            setErrorCityState('')
            return true
        } else {
            setErrorCityState('Estado inválido')
            return false
        }
    }


    const cepHandleChange = async (e) => {
        const cep = maskInput(e.target.value, '#####-###', true)
        setNewCep(cep)
        if (cep.length === 9) {
            isSearchingCep(true)
            try {
                const { data } = await get(`https://viacep.com.br/ws/${cep}/json/`)
                setStreet(data.logradouro.toUpperCase())
                setNeighborhood(data.bairro.toUpperCase())
                setComplement(data.complemento.toUpperCase())
                setNewCity(data.localidade.toUpperCase())
                setNewCityState(data.uf.toUpperCase())
            } finally {
                isSearchingCep(false)
            }
        }
    }

    return (
        <div style={containerWithPadding}>
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
                value={newNickname}
                onChange={({ target: { value } }) => setNewNickname(capitalize(value))}
                validateInput={validateNick}
                submit={sendToBackend(uid, 'D', userPos, { 'apelido': newNickname }, newNickname, setLoadingNickname, setErrorNickname)}
                setError={() => { }}
                error={errorNickname}
                placeholder="digite aqui..."
                editable={true}
                isLoading={loadingNickname}
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
                name="Telefone pessoal"
                value={newPersonalPhone}
                onChange={({ target: { value } }) => setNewPersonalPhone(maskInput(value, '(##) #####-####', true))}
                validateInput={validatePersonalPhone}
                submit={sendToBackend(uid, 'K', userPos, { 'telefone': '+55 ' + newPersonalPhone }, '+55 ' + newPersonalPhone, setLoadingPersonalPhone, setErrorPersonalPhone)}
                setError={() => { }}
                error={errorPersonalPhone}
                placeholder="digite aqui..."
                editable={true}
                isLoading={loadingPersonalPhone}
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
                onChange={(e) => cepHandleChange(e)}
                validateInput={validateCep}
                submit={sendToBackend(uid, 'O', userPos, { 'cep': newCep }, newCep, setLoadingCep, setErrorCep)}
                setError={() => { }}
                error={errorCep}
                placeholder="digite aqui..."
                editable={!searchingCep}
                isLoading={loadingCep}
            />
            <InputEdit
                name="Rua"
                value={street}
                onChange={({ target: { value } }) => setStreet(value.toUpperCase())}
                validateInput={validateStreet}
                submit={sendToBackend(uid, 'N', userPos, { 'endereco': `${street}, ${number}, ${complement}, ${neighborhood}` }, `${street}, ${number}, ${complement}, ${neighborhood}`, setLoadingStreet, setErrorStreet)}
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
                submit={sendToBackend(uid, 'N', userPos, { 'endereco': `${street}, ${number}, ${complement}, ${neighborhood}` }, `${street}, ${number}, ${complement}, ${neighborhood}`, setLoadingNumber, setErrorNumber)}
                setError={() => { }}
                error={errorNumber}
                placeholder="digite aqui..."
                editable={true}
                isLoading={loadingNumber}
            />
            <InputEdit
                name="Complemento"
                value={complement}
                onChange={({ target: { value } }) => setComplement(value.toUpperCase())}
                validateInput={() => true}
                submit={sendToBackend(uid, 'N', userPos, { 'endereco': `${street}, ${number}, ${complement}, ${neighborhood}` }, `${street}, ${number}, ${complement}, ${neighborhood}`, setLoadingComplement, setErrorComplement)}
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
                submit={sendToBackend(uid, 'N', userPos, { 'endereco': `${street}, ${number}, ${complement}, ${neighborhood}` }, `${street}, ${number}, ${complement}, ${neighborhood}`, setLoadingNeighborhood, setErrorNeighborhood)}
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
            />
            <InputEdit
                name="Valor cobrado"
                value={newAmountCharged}
                onChange={({ target: { value } }) => setNewAmountCharged(maskInput(value, '#####', true))}
                validateInput={validateAmountCharged}
                submit={sendToBackend(uid, 'U', userPos, { 'valorCobrado': newAmountCharged }, newAmountCharged, setLoadingAmountCharged, setErrorAmountCharged)}
                setError={() => { }}
                error={errorAmountCharged}
                placeholder="digite aqui..."
                editable={true}
                isLoading={loadingAmountCharged}
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
                submit={sendToBackend(uid, 'AA', userPos, { 'contatoEmergencia': '+55 ' + newEmergencyContact }, '+55 ' + newEmergencyContact, setLoadingEmergencyContact, setErrorEmergencyContact)}
                setError={() => { }}
                error={errorEmergencyContact}
                placeholder="digite aqui..."
                editable={true}
                isLoading={loadingEmergencyContact}
            />
        </div>
    )
}

export default UpdateUserInfo