import React, { useState } from 'react'
import { get } from 'axios'

import sendToBackend from './sendToBackend'
import { welcome, marker } from './styles'

import InitialLoader from '@bit/vitorbarbosa19.ziro.initial-loader'
import Error from '@bit/vitorbarbosa19.ziro.error'
import HeaderHome from '@bit/vitorbarbosa19.ziro.header-home'
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import InputText from '@bit/vitorbarbosa19.ziro.input-text'
import InputPhone from '@bit/vitorbarbosa19.ziro.input-phone'
import InputEmail from '@bit/vitorbarbosa19.ziro.input-email'
import InputMoney from '@bit/vitorbarbosa19.ziro.input-money'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import Calendar from '@bit/vitorbarbosa19.ziro.calendar'
import { containerWithPadding } from '@ziro/theme'
import capitalize from '@ziro/capitalize'
import maskInput from '@ziro/mask-input'
import currencyFormat from '@ziro/currency-format'
import validateDocuments from '../utils/validateDocuments'

const Register = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [token, setToken] = useState('')
    const [name, setName] = useState('')
    const [nickname, setNickname] = useState('')
    const [birthDate, setBirthDate] = useState('')
    const [cpf, setCpf] = useState('')
    const [rg, setRg] = useState('')
    const [issuingBody, setIssuingBody] = useState('')
    const [shippingDate, setShippingDate] = useState('')
    const [maritalStatus, setMaritalStatus] = useState('')
    const [personalPhone, setPersonalPhone] = useState('')
    const [email, setEmail] = useState('')
    const [github, setGithub] = useState('')
    const [street, setStreet] = useState('')
    const [number, setNumber] = useState('')
    const [complement, setComplement] = useState('')
    const [neighborhood, setNeighborhood] = useState('')
    const [cep, setCep] = useState('')
    const [city, setCity] = useState('')
    const [cityState, setCityState] = useState('')
    const [initialDate, setInitialDate] = useState('')
    const [focused, setFocused] = useState(false)
    const [scope, setScope] = useState('')
    const [amountCharged, setAmountCharged] = useState('')
    const [paymentModel, setPaymentModel] = useState('')
    const [height, setHeight] = useState('')
    const [weight, setWeight] = useState('')
    const [emergencyName, setEmergencyName] = useState('')
    const [kinship, setKinship] = useState('')
    const [emergencyContact, setEmergencyContact] = useState('')
    const [bankNumber, setBankNumber] = useState('')
    const [accountNumber, setAccountNumber] = useState('')
    const [agency, setAgency] = useState('')
    const [pass, setPass] = useState('')
    const [confirmPass, setConfirmPass] = useState('')
    const [searchingCep, isSearchingCep] = useState(false)
    const maritalStatusList = ['Casado(a)', 'Divorciado(a)', 'Separado(a)', 'Solteiro(a)', 'Viúvo(a)']
    const scopeList = ['Assessoria','Customer Success','Dev','Financeiro','Logística','Produto','Vendas']
    const paymentModelList = ['nenhum', 'assessoria2019', 'assessoria2020', 'cobranca2019', 'logistica2019', 'vendas2019', 'vendas2020', 'atendimento2020']
    const statesList = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']

    const state = {
        token, name, nickname, birthDate, cpf, rg, issuingBody, shippingDate,
        maritalStatus, personalPhone, email, github, street, number, complement, neighborhood, cep, city, cityState, initialDate,
        scope, amountCharged, paymentModel, height, weight, emergencyName, kinship,
        emergencyContact, bankNumber, accountNumber, agency, pass
    }
    const validations = [
        {
            name: 'token',
            validation: value => value.length === 10,
            value: token,
            message: 'Token inválido'
        }, {
            name: 'name',
            validation: value => !/^.{0,2}$/g.test(value), // tests for min length of 3 char
            value: name,
            message: 'Mínimo 3 caracteres'
        }, {
            name: 'nickname',
            validation: value => !/^.{0,2}$/g.test(value), // tests for min length of 3 char
            value: nickname,
            message: 'Mínimo 3 caracteres'
        }, {
            name: 'birthDate',
            // Regex retirada do fórum: https://stackoverflow.com/questions/15491894/regex-to-validate-date-format-dd-mm-yyyy
            validation: value => /^(?:(?:31(\/)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/.test(value),
            value: birthDate,
            message: 'Data inválida'
        }, {
            name: 'cpf',
            validation: value => /(^\d{3}\.\d{3}\.\d{3}\-\d{2}$)|(^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$)/.test(value) && (process.env.HOMOLOG ? true : validateDocuments(value)),
            value: cpf,
            message: 'Documento inválido'
        }, {
            name: 'rg',
            validation: value => /[0-9]+/g.test(value),
            value: rg,
            message: 'Documento inválido'
        }, {
            name: 'issuingBody',
            validation: value => /[a-zA-Z]+/g.test(value),
            value: issuingBody,
            message: 'Campo obrigatório'
        }, {
            name: 'shippingDate',
            validation: value => /^(?:(?:31(\/)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/.test(value),
            value: shippingDate,
            message: 'Data inválida'
        }, {
            name: 'maritalStatus',
            validation: value => maritalStatusList.includes(value),
            value: maritalStatus,
            message: 'Estado civil inválido'
        }, {
            name: 'personalPhone',
            validation: value => /(^\(\d{2}\) \d{5}\-\d{4}$)/.test(value),
            value: personalPhone,
            message: 'Telefone inválido'
        }, {
            name: 'cep',
            validation: value => /(^\d{5}\-\d{3}$)/.test(value),
            value: cep,
            message: 'CEP inválido'
        }, {
            name: 'street',
            validation: value => !!value,
            value: street,
            message: 'Campo obrigatório'
        }, {
            name: 'neighborhood',
            validation: value => !!value,
            value: neighborhood,
            message: 'Campo obrigatório'
        }, {
            name: 'city',
            validation: value => /[a-zA-Z]+/g.test(value),
            value: city,
            message: 'Campo obrigatório'
        }, {
            name: 'cityState',
            validation: value => /(^\D{2}$)/.test(value) & statesList.includes(value),
            value: cityState,
            message: 'Campo obrigatório'
        }, {
            name: 'initialDate',
            validation: value => /^(?:(?:31(\/)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/.test(value),
            value: initialDate,
            message: 'Data inválida'
        }, {
            name: 'scope',
            validation: value => scopeList.includes(value),
            value: scope,
            message: 'Campo obrigatório'
        }, {
            name: 'amountCharged',
            validation: value => !!value,
            value: amountCharged,
            message: 'Campo obrigatório'
        }, {
            name: 'paymentModel',
            validation: value => paymentModelList.includes(value),
            value: paymentModel,
            message: 'Modelo de pagamento inválido'
        }, {
            name: 'height',
            validation: value => (/((^\d{1}\.\d{2}$))/.test(value) | /((^\d{1}\.\d{1}$))/.test(value)) && parseFloat(value) <= 2.5,
            value: height,
            message: 'Altura inválida'
        }, {
            name: 'weight',
            validation: value => !!value && value >= 30 && value <= 300,
            value: weight,
            message: 'Peso inválido'
        }, {
            name: 'emergencyName',
            validation: value => /[a-zA-Z]+/g.test(value),
            value: emergencyName,
            message: 'Campo obrigatório'
        }, {
            name: 'kinship',
            validation: value => /[a-zA-Z]+/g.test(value),
            value: kinship,
            message: 'Campo obrigatório'
        }, {
            name: 'emergencyContact',
            validation: value => /(^\(\d{2}\) \d{5}\-\d{4}$)/.test(value),
            value: emergencyContact,
            message: 'Número de telefone inválido'
        }, {
            name: 'bankNumber',
            validation: value => !!value,
            value: bankNumber,
            message: 'Campo obrigatório'
        }, {
            name: 'accountNumber',
            validation: value => !!value,
            value: accountNumber,
            message: 'Campo obrigatório'
        }, {
            name: 'agency',
            validation: value => !!value,
            value: agency,
            message: 'Campo obrigatório'
        }, {
            name: 'email',
            validation: value => /^\S+@\S+\.\S+$/g.test(value), // tests for pattern a@b.c
            value: email,
            message: 'Formato inválido'
        }, {
            name: 'pass',
            validation: value => !/^.{0,5}$/g.test(value), // tests for min length of 6 char
            value: pass,
            message: 'Mínimo 6 caracteres'
        }, {
            name: 'confirmPass',
            validation: value => value === pass,
            value: confirmPass,
            message: 'Deve ser igual ao campo anterior'
        }
    ]

    const cepHandleChange = async (e) => {
        const cep = maskInput(e.target.value, '#####-###', true)
        setCep(cep)
        if (cep.length === 9) {
            isSearchingCep(true)
            try {
                const { data } = await get(`https://viacep.com.br/ws/${cep}/json/`)
                setStreet(data.logradouro.toUpperCase())
                setNeighborhood(data.bairro.toUpperCase())
                setComplement(data.complemento.toUpperCase())
                setCity(data.localidade.toUpperCase())
                setCityState(data.uf.toUpperCase())
            } finally {
                isSearchingCep(false)
            }
        }
    }

    const maskForKg = value => {
        if (value.length <= 5) {
            return value
                .replace(/\D/g, '')
                .replace(/(\d{2})(\d)/, '$1.$2')
                .replace(/(\.\d{2})\d+?$/, '$1');
        } else {
            return value
                .replace(/\D/g, '')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\.\d{2})\d+?$/, '$1');
        }
    }

    if (isLoading) return <InitialLoader />
    if (isError) return <Error />
    return (
        <div style={containerWithPadding}>
            <HeaderHome linkPath='/login' linkText='Tem cadastro? LOGIN' />
            <h1 style={welcome}>
                Crie sua conta de <span style={marker}>{`Membro`}</span>,
			</h1>
            <Form
                validations={validations}
                sendToBackend={sendToBackend ? sendToBackend(state) : () => null}
                inputs={[
                    <FormInput name='token' label='Token' input={
                        <InputText
                            value={token}
                            onChange={({ target: { value } }) => setToken(maskInput(value, '##########', false))}
                            placeholder='Token de acesso'
                        />
                    } />,
                    <FormInput name='name' label='Nome Completo' input={
                        <InputText
                            value={name}
                            onChange={({ target: { value } }) => setName(capitalize(value))}
                            placeholder='Seu nome'
                        />
                    } />,
                    <FormInput name='nickname' label='Apelido' input={
                        <InputText
                            value={nickname}
                            onChange={({ target: { value } }) => setNickname(capitalize(value))}
                            placeholder='Como quer ser chamado'
                        />
                    } />,
                    <FormInput name='birthDate' label='Nascimento' input={
                        <InputText
                            value={birthDate}
                            onChange={({ target: { value } }) => setBirthDate(maskInput(value, '##/##/####', true))}
                            placeholder='01/10/1990'
                            inputMode='numeric'
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
                    <FormInput name='rg' label='RG' input={
                        <InputText
                            value={rg}
                            onChange={({ target: { value } }) => setRg(maskInput(value, '##############', false))}
                            placeholder='000.111.222'
                            inputMode='numeric'
                        />
                    } />,
                    <FormInput name='issuingBody' label='Órgão Expeditor' input={
                        <InputText
                            value={issuingBody}
                            onChange={({ target: { value } }) => setIssuingBody(value.toUpperCase())}
                            placeholder='SSP - PI'
                        />
                    } />,
                    <FormInput name='shippingDate' label='Data de Expedição' input={
                        <InputText
                            value={shippingDate}
                            onChange={({ target: { value } }) => setShippingDate(maskInput(value, '##/##/####', true))}
                            placeholder='01/10/1990'
                            inputMode='numeric'
                        />
                    } />,
                    <FormInput name='maritalStatus' label='Estado Civil' input={
                        <Dropdown
                            value={maritalStatus}
                            onChange={({ target: { value } }) => setMaritalStatus(value)}
                            onChangeKeyboard={element =>
                                element ? setMaritalStatus(element.value) : null
                            }
                            list={maritalStatusList}
                            placeholder="Solteiro(a)"
                        />
                    } />,
                    <FormInput name='personalPhone' label='Telefone Pessoal' input={
                        <InputPhone
                            value={personalPhone}
                            setValue={setPersonalPhone}
                        />
                    } />,
                    <FormInput name='github' label='Github' input={
                        <InputText
                            value={github}
                            onChange={({ target: { value } }) => setGithub(value)}
                            placeholder='Ex.: vitorbarbosa19'
                        />
                    } />,
                    <FormInput name='cep' label='CEP' input={
                        <InputText
                            value={cep}
                            disabled={searchingCep}
                            submitting={searchingCep}
                            onChange={(e) => cepHandleChange(e)}
                            placeholder='00000-111'
                            inputMode='numeric'
                        />
                    } />,
                    <FormInput name='street' label='Rua' input={
                        <InputText
                            value={street}
                            onChange={({ target: { value } }) => setStreet(value.toUpperCase())}
                            placeholder='R HERMELINO CARDOSO'
                        />
                    } />,
                    <FormInput name='number' label='Número' input={
                        <InputText
                            value={number}
                            onChange={({ target: { value } }) => setNumber(maskInput(value.toUpperCase(), '######', true))}
                            placeholder='1283'
                            inputMode='numeric'
                        />
                    } />,
                    <FormInput name='complement' label='Complemento' input={
                        <InputText
                            value={complement}
                            onChange={({ target: { value } }) => setComplement(value.toUpperCase())}
                            placeholder='BLOCO K'
                        />
                    } />,
                    <FormInput name='neighborhood' label='Bairro' input={
                        <InputText
                            value={neighborhood}
                            onChange={({ target: { value } }) => setNeighborhood(value.toUpperCase())}
                            placeholder='COHAB'
                        />
                    } />,
                    <FormInput name='city' label='Cidade' input={
                        <InputText
                            value={city}
                            onChange={({ target: { value } }) => setCity(value.toUpperCase())}
                            placeholder='SÃO PAULO'
                        />
                    } />,
                    <FormInput name='cityState' label='Estado' input={
                        <InputText
                            value={cityState}
                            onChange={({ target: { value } }) => setCityState(maskInput(value.toUpperCase(), '##', false))}
                            placeholder='SP'
                        />
                    } />,
                    <FormInput name='initialDate' label='Data de Início' input={
                        <Calendar inputDate={initialDate} setInputDate={setInitialDate} focused={focused} setFocused={setFocused} placeholder={'01/10/1990'} readOnly={true} />
                    } />,
                    <FormInput name='scope' label='Escopo' input={
                        <Dropdown
                            value={scope}
                            onChange={({ target: { value } }) => setScope(value)}
                            onChangeKeyboard={element =>
                                element ? setScope(element.value) : null
                            }
                            list={scopeList}
                            placeholder="Área de atuação"
                        />
                    } />,
                    <FormInput name='amountCharged' label='Valor Cobrado' input={
                        <InputMoney
                            value={amountCharged}
                            setValue={setAmountCharged}
                            placeholder='Valor cobrado pelo trabalho'
                        />
                    } />,
                    <FormInput name='paymentModel' label='Modelo de Pagamento' input={
                        <Dropdown
                            value={paymentModel}
                            onChange={({ target: { value } }) => setPaymentModel(value)}
                            onChangeKeyboard={element =>
                                element ? setPaymentModel(element.value) : null
                            }
                            list={paymentModelList}
                            placeholder="'nenhum' caso não haja"
                        />
                    } />,
                    <FormInput name='height' label='Altura em metros' input={
                        <InputText
                            value={height}
                            onChange={({ target: { value } }) => setHeight(maskInput(value, '#.##', true))}
                            placeholder='Para contrato de seguro'
                            inputMode='numeric'
                        />
                    } />,
                    <FormInput name='weight' label='Peso em quilogramas' input={
                        <InputText
                            value={weight}
                            onChange={({ target: { value } }) => setWeight(maskInput(value, '###', true))}
                            placeholder='Para contrato de seguro'
                            inputMode='numeric'
                        />
                    } />,
                    <FormInput name='emergencyName' label='Nome do Contato de Emergência' input={
                        <InputText
                            value={emergencyName}
                            onChange={({ target: { value } }) => setEmergencyName(capitalize(value))}
                            placeholder='Para situações de emergência'
                        />
                    } />,
                    <FormInput name='kinship' label='Parentesco' input={
                        <InputText
                            value={kinship}
                            onChange={({ target: { value } }) => setKinship(value)}
                            placeholder='Grau de parentesco'
                        />
                    } />,
                    <FormInput name='emergencyContact' label='Contato de Emergência' input={
                        <InputPhone
                            value={emergencyContact}
                            setValue={setEmergencyContact}
                        />
                    } />,
                    <FormInput name='bankNumber' label='Número do Banco' input={
                        <InputText
                            value={bankNumber}
                            onChange={({ target: { value } }) => setBankNumber(maskInput(value, '###', false))}
                            placeholder='Ex.: 260'
                            inputMode='numeric'
                        />
                    } />,
                    <FormInput name='accountNumber' label='Número da Conta' input={
                        <InputText
                            value={accountNumber}
                            onChange={({ target: { value } }) => setAccountNumber(value)}
                            placeholder='Ex.: 9472156-8'
                            inputMode='numeric'
                        />
                    } />,
                    <FormInput name='agency' label='Agência' input={
                        <InputText
                            value={agency}
                            onChange={({ target: { value } }) => setAgency(value)}
                            placeholder='Ex.: 0001'
                            inputMode='numeric'
                        />
                    } />,
                    <FormInput name='email' label='Email' input={
                        <InputEmail
                            value={email}
                            setValue={setEmail}
                            placeholder='Para acesso ao app'
                        />
                    } />,
                    <FormInput name='pass' label='Senha' input={
                        <InputText
                            value={pass}
                            onChange={({ target: { value } }) => setPass(value)}
                            placeholder='Mínimo 6 caracteres'
                            type='password'
                        />
                    } />,
                    <FormInput name='confirmPass' label='Confirme a senha' input={
                        <InputText
                            value={confirmPass}
                            onChange={({ target: { value } }) => setConfirmPass(value)}
                            placeholder='Igual ao campo anterior'
                            type='password'
                        />
                    } />
                ]}
            />
        </div>
    )
}

export default Register
