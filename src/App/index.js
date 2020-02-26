import React, { useState, useEffect } from 'react'
import { post } from 'axios'
import { auth, db } from '../Firebase/index'
import { userContext } from './appContext'
import InitialLoader from '@bit/vitorbarbosa19.ziro.initial-loader'
import Error from '@bit/vitorbarbosa19.ziro.error'
import ErrorBoundary from '@bit/vitorbarbosa19.ziro.error-boundary'
import Router from './Router'

export const App = () => {
	const [loading, setLoading] = useState(true)
	const [errorLoading, setErrorLoading] = useState(false)
	const [uid, setUid] = useState(null)
	const [name, setName] = useState(null)
	const [nickname, setNickname] = useState(null)
	const [cpf, setCpf] = useState(null)
	const [height, setHeight] = useState(null)
	const [cep, setCep] = useState(null)
	const [city, setCity] = useState(null)
	const [emergencyContact, setEmergencyContact] = useState(null)
	const [initialDate, setInitialDate] = useState(null)
	const [address, setAddress] = useState(null)
	const [cityState, setCityState] = useState(null)
	const [scope, setScope] = useState(null)
	const [maritalStatus, setMaritalStatus] = useState(null)
	const [github, setGithub] = useState(null)
	const [paymentModel, setPaymentModel] = useState(null)
	const [birthDate, setBirthDate] = useState(null)
	const [emergencyName, setEmergencyName] = useState(null)
	const [issuingBody, setIssuingBody] = useState(null)
	const [kinship, setKinship] = useState(null)
	const [weight, setWeight] = useState(null)
	const [rg, setRg] = useState(null)
	const [shippingDate, setShippingDate] = useState(null)
	const [personalPhone, setPersonalPhone] = useState(null)
	const [amountCharged, setAmountCharged] = useState(null)
	const [userPos, setUserPos] = useState(null)
	const url = process.env.SHEET_URL
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
		"spreadsheetId": process.env.SHEET_ID
	}

	useEffect(() => {
		return auth.onAuthStateChanged(async user => {
			if (user && user.emailVerified) {
				setUid(user.uid)
				setName(user.nome)
				setNickname(user.apelido)
				setCpf(user.cpf)
				setHeight(user.altura)
				setCep(user.cep)
				setCity(user.cidade)
				setEmergencyContact(user.contatoEmergencia)
				setInitialDate(user.dataInicio)
				setAddress(user.endereco)
				setCityState(user.estado)
				setScope(user.escopo)
				setMaritalStatus(user.estadoCivil)
				setGithub(user.github)
				setPaymentModel(user.modeloPagamento)
				setBirthDate(user.nascimento)
				setEmergencyName(user.nomeEmergencia)
				setIssuingBody(user.orgExp)
				setKinship(user.parentesco)
				setWeight(user.peso)
				setRg(user.rg)
				setShippingDate(user.shippingDate)
				setPersonalPhone(user.telefone)
				setAmountCharged(user.valorCobrado)
			} else {
				setUid('')
				setName('')
				setNickname('')
				setCpf('')
				setHeight('')
				setCep('')
				setCity('')
				setEmergencyContact('')
				setInitialDate('')
				setAddress('')
				setCityState('')
				setScope('')
				setMaritalStatus('')
				setGithub('')
				setPaymentModel('')
				setEmergencyName('')
				setIssuingBody('')
				setKinship('')
				setWeight('')
				setRg('')
				setShippingDate('')
				setPersonalPhone('')
				setAmountCharged('')
			}
		})
	}, [])
	useEffect(() => {
		const getUserData = async () => {
			if (uid) {
				try {
					const docRef = await db.collection('team').where('uid', '==', uid).get()
					if (!docRef.empty) {
						docRef.forEach(async doc => {
							const data = doc.data()
							setName(data.nome)
							setNickname(data.apelido)
							setCpf(data.cpf)
							setHeight(data.altura)
							setCep(data.cep)
							setCity(data.cidade)
							setEmergencyContact(data.contatoEmergencia)
							setInitialDate(data.dataInicio)
							setAddress(data.endereco)
							setCityState(data.estado)
							setScope(data.escopo)
							setMaritalStatus(data.estadoCivil)
							setGithub(data.github)
							setPaymentModel(data.modeloPagamento)
							setBirthDate(data.nascimento)
							setEmergencyName(data.nomeEmergencia)
							setIssuingBody(data.orgExp)
							setKinship(data.parentesco)
							setWeight(data.peso)
							setRg(data.rg)
							setShippingDate(data.shippingDate)
							setPersonalPhone(data.telefone)
							setAmountCharged(data.valorCobrado)
							if (userPos === null || userPos === '') {
								const { data: { values } } = await post(url, body, config)
								values.map((user, index) => {
									if (user[11] === data.email) {
										setUserPos(index + 1)
									}
								})
							}
						})
					}
				} catch (error) {
					if (error.response) console.log(error.response)
					else console.log(error)
					setErrorLoading(true)
				}
			}
			if (uid !== null) setLoading(false) // wait uid to be set to either a value or ''
		}
		getUserData()
	}, [uid])
	const userData = { uid, userPos, name, nickname, cpf, height, cep, city, emergencyContact, initialDate, address, cityState, scope, maritalStatus, github, paymentModel, birthDate, emergencyName, issuingBody, kinship, weight, rg, shippingDate, personalPhone, amountCharged }
	if (loading) return <InitialLoader />
	if (errorLoading) return <Error />
	return (
		<ErrorBoundary>
			<userContext.Provider value={userData}>
				<Router isLogged={!!uid} />
			</userContext.Provider>
		</ErrorBoundary>
	)
}