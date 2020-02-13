import React, { useState, useEffect } from 'react'
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
	useEffect(() => {
		return auth.onAuthStateChanged(async user => {
			if (user && user.emailVerified) {
				setUid(user.uid)
				setName(user.nome)
				setNickname(user.apelido)
				setCpf(user.cpf)
			} else {
				setUid('')
				setName('')
				setNickname('')
				setCpf('')
			}
		})
	}, [])
	useEffect(() => {
		const getUserData = async () => {
			if (uid) {
				try {
					const docRef = await db.collection('team').where('uid', '==', uid).get()
					if (!docRef.empty) {
						docRef.forEach(doc => {
							const data = doc.data()
							setName(data.nome)
							setNickname(data.apelido)
							setCpf(data.cpf)
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
	const userData = { uid, name, nickname, cpf }
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