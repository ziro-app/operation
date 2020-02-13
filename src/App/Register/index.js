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
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import { containerWithPadding } from '@ziro/theme'
import currencyFormat from '@ziro/currency-format'
import capitalize from '@ziro/capitalize'
import maskInput from '@ziro/mask-input'

const Register = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [isError, setIsError] = useState(false)
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
	const [address, setAddress] = useState('')
	const [cep, setCep] = useState('')
	const [city, setCity] = useState('')
	const [cityState, setCityState] = useState('')
	const [initialDate, setInitialDate] = useState('')
	const [scope, setScope] = useState('')
	const [amountCharged, setAmountCharged] = useState('')
	const [paymentModel, setPaymentModel] = useState('')
	const [height, setHeight] = useState('')
	const [weight, setWeight] = useState('')
	const [emergencyName, setEmergencyName] = useState('')
	const [kinship, setKinship] = useState('')
	const [emergencyContact, setEmergencyContact] = useState('')
	const [pass, setPass] = useState('')
	const [confirmPass, setConfirmPass] = useState('')
	const [searchingCep, isSearchingCep] = useState(false)
	const maritalStatusList = ['Casado(a)', 'Divorciado(a)', 'Separado(a)', 'Solteiro(a)', 'Viúvo(a)']
	const scopeList = ['Assessoria', 'Logística', 'Vendas', 'Dev', 'Dados', 'Processos']
	const paymentModelList = ['assessoria2019', 'assessoria2020', 'cobranca2019', 'logistica2019', 'nenhum', 'vendas2019', 'vendas2020']
	const statesList = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']

	const state = {
		name, nickname, birthDate, cpf, rg, issuingBody, shippingDate,
		maritalStatus, personalPhone, email, github, address, cep, city, cityState, initialDate,
		scope, amountCharged, paymentModel, height, weight, emergencyName, kinship,
		emergencyContact, pass
	}
	const validations = [
		{
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
			validation: value => /(^\d{3}\.\d{3}\.\d{3}\-\d{2}$)|(^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$)/.test(value),
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
			name: 'address',
			validation: value => /[a-zA-Z]+/g.test(value),
			value: address,
			message: 'Campo obrigatório'
		}, {
			name: 'city',
			validation: value => /[a-zA-Z]+/g.test(value),
			value: city,
			message: 'Campo obrigatória'
		}, {
			name: 'cityState',
			validation: value => /(^\D{2}$)/.test(value) & statesList.includes(value),
			value: cityState,
			message: 'Campo obrigatória'
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
			validation: value => /[a-zA-Z]+/g.test(value),
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
			validation: value => (/((^\d{3}\.\d{2}$))/.test(value) | /((^\d{2}\.\d{2}$))/.test(value) | /((^\d{2}\.\d{1}$))/.test(value)) && parseFloat(value) <= 200.0,
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
				setAddress(data.logradouro ? `${data.logradouro}, nº , ${data.bairro}` : '')
				setCity(data.localidade)
				setCityState(data.uf)
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
					<FormInput name='name' label='Nome Completo' input={
						<InputText
							value={name}
							onChange={({ target: { value } }) => setName(capitalize(value))}
							placeholder='Para armazenamento interno'
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
						/>
					} />,
					<FormInput name='cpf' label='CPF' input={
						<InputText
							value={cpf}
							onChange={({ target: { value } }) => setCpf(maskInput(value, '###.###.###-##', true))}
							placeholder='000.111.222-33'
						/>
					} />,
					<FormInput name='rg' label='RG' input={
						<InputText
							value={rg}
							onChange={({ target: { value } }) => setRg(value)}
							placeholder='000.111.222'
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
						<InputText
							value={personalPhone}
							onChange={({ target: { value } }) => setPersonalPhone(maskInput(value, '(##) #####-####', true))}
							placeholder='(86) 99743-6822'
						/>
					} />,
					<FormInput name='github' label='Github' input={
						<InputText
							value={github}
							onChange={({ target: { value } }) => setGithub(value)}
							placeholder='Apenas usuário'
						/>
					} />,
					<FormInput name='cep' label='CEP' input={
						<InputText
							value={cep}
							disabled={searchingCep}
							submitting={searchingCep}
							onChange={(e) => cepHandleChange(e)}
							placeholder='00000-111'
						/>
					} />,
					<FormInput name='address' label='Endereço' input={
						<InputText
							value={address}
							onChange={({ target: { value } }) => setAddress(value)}
							placeholder='Rua Lubavitch, nº 71, Bom Retiro'
						/>
					} />,
					<FormInput name='city' label='Cidade' input={
						<InputText
							value={city}
							onChange={({ target: { value } }) => setCity(capitalize(value))}
							placeholder='São Paulo'
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
						<InputText
							value={initialDate}
							onChange={({ target: { value } }) => setInitialDate(maskInput(value, '##/##/####', true))}
							placeholder='01/10/1990'
						/>
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
						<InputText
							value={amountCharged}
							onChange={({ target: { value } }) => {
								setAmountCharged(value)
								value = value.replace('R', '').replace('$', '').replace(',', '')
								setAmountCharged(currencyFormat(parseInt(value)))
							}}
							placeholder='Valor cobrado pelo trabalho'
						/>
					} />,
					<FormInput name='paymentModel' label='Modelo de Pagamento' input={
						<Dropdown
							value={paymentModel}
							onChange={({ target: { value } }) => setPaymentModel(value)}
							onChangeKeyboard={element =>
								element ? setScope(element.value) : null
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
						/>
					} />,
					<FormInput name='weight' label='Peso em quilogramas' input={
						<InputText
							value={weight}
							onChange={({ target: { value } }) => setWeight(maskForKg(value))}
							placeholder='Para contrato de seguro'
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
						<InputText
							value={emergencyContact}
							onChange={({ target: { value } }) => setEmergencyContact(maskInput(value, '(##) #####-####', true))}
							placeholder='Número para contato'
						/>
					} />,
					<FormInput name='email' label='Email' input={
						<InputText
							value={email}
							onChange={({ target: { value } }) => setEmail(value.toLowerCase())}
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