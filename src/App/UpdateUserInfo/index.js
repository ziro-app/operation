import React, { useState, useContext } from 'react'
import { userContext } from '../appContext'
import InputEdit from '@bit/vitorbarbosa19.ziro.input-edit'
import DropdownEdit from '@bit/vitorbarbosa19.ziro.dropdown-edit'
import { containerWithPadding } from '@ziro/theme'
import maskInput from '@ziro/mask-input'
import capitalize from '@ziro/capitalize'
import sendToBackend from './sendToBackend'

const UpdateUserInfo = () => {
    const { uid, userPos, name, nickname, cpf, height, emergencyContact, initialDate, scope, maritalStatus, github, paymentModel, birthDate, emergencyName, issuingBody, kinship, weight, rg, shippingDate, personalPhone, amountCharged } = useContext(userContext)
    const [newName, setNewName] = useState(name)
    const [errorName, setErrorName] = useState('')
    const [loadingName, setLoadingName] = useState(false)
    const [newNickname, setNewNickname] = useState(nickname)
    const [errorNickname, setErrorNickname] = useState('')
    const [loadingNickname, setLoadingNickname] = useState(false)
    const [newBirthDate, setNewBirthDate] = useState(birthDate)
    const [errorBirthDate, setErrorBirthDate] = useState('')
    const [loadingBirthDate, setLoadingBirthDate] = useState(false)
    const [newMaritalStatus, setNewMaritalStatus] = useState(maritalStatus)
    const [newPersonalPhone, setNewPersonalPhone] = useState(personalPhone.split('+55 ')[1])
    const [errorPersonalPhone, setErrorPersonalPhone] = useState('')
    const [loadingPersonalPhone, setLoadingPersonalPhone] = useState(false)
    const [newGithub, setNewGithub] = useState(github)
    const [errorGithub, setErrorGithub] = useState('')
    const [loadingGithub, setLoadingGithub] = useState(false)
    const [newScope, setNewScope] = useState(scope)
    const [newAmountCharged, setNewAmountCharged] = useState(amountCharged)
    const [errorAmountCharged, setErrorAmountCharged] = useState('')
    const [loadingAmountCharged, setLoadingAmountCharged] = useState(false)
    const [newPaymentModel, setNewPaymentModel] = useState(paymentModel)
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
    const maritalStatusList = ['Casado(a)', 'Divorciado(a)', 'Separado(a)', 'Solteiro(a)', 'Viúvo(a)']
    const scopeList = ['Assessoria', 'Logística', 'Vendas', 'Dev', 'Dados', 'Processos']
    const paymentModelList = ['assessoria2019', 'assessoria2020', 'cobranca2019', 'logistica2019', 'nenhum', 'vendas2019', 'vendas2020']

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
            <DropdownEdit
                name="Estado civil"
                value={newMaritalStatus}
                onChange={({ target: { value } }) => setNewMaritalStatus(value)}
                onChangeKeyboard={element =>
                    element ? setNewMaritalStatus(element.value) : null
                }
                list={maritalStatusList}
                placeholder="Solteiro(a)"
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
            <DropdownEdit
                name="Escopo"
                value={newScope}
                onChange={({ target: { value } }) => setNewScope(value)}
                onChangeKeyboard={element =>
                    element ? setNewScope(element.value) : null
                }
                list={scopeList}
                placeholder="digite aqui..."
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
            <DropdownEdit
                name="Modelo de pagamento"
                value={newPaymentModel}
                onChange={({ target: { value } }) => setNewPaymentModel(value)}
                onChangeKeyboard={element =>
                    element ? setNewPaymentModel(element.value) : null
                }
                list={paymentModelList}
                placeholder="digite aqui..."
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