import { auth, db } from '../../Firebase/index'
import { post } from 'axios'

const sendToBackend = state => () => {
	const { fName, lName, documento, email, pass } = state
	const fnameTrim = fName ? fName.trim().toLowerCase() : ''
	const lnameTrim = lName ? lName.trim().toLowerCase() : ''
	const url = process.env.SHEET_URL
	const body = {
		apiResource: 'values',
		apiMethod: 'append',
		spreadsheetId: process.env.SHEET_ID,
		range: 'Team!A1:E1',
		resource: {
			values: [
				[new Date(), fnameTrim, lnameTrim, documento, email]
			]
		},
		valueInputOption: 'raw'
	}
	const config = {
		headers: {
			'Content-type': 'application/json',
			'Authorization': process.env.SHEET_TOKEN
		}
	}
	return new Promise(async (resolve, reject) => {
		try {
			await post(url, body, config)
			try {
				const { user } = await auth.createUserWithEmailAndPassword(email, pass)
				try {
					await auth.currentUser.sendEmailVerification({ url: `${process.env.CONTINUE_URL}` })
					try {
						await db.collection('team').add({
							cadastro: new Date(),
							uid: user.uid,
							fname: fnameTrim,
							lname: lnameTrim,
							documento,
							email
						})
						await db.collection('users').add({ email, app: 'operation' })
						try {
							await auth.signOut() // user needs to validate email before signing in to app
						} catch (error) {
							console.log(error)
							if (error.response) console.log(error.response)
							throw 'Erro ao fazer signOut'
						}
					} catch (error) {
						console.log(error)
						if (error.response) console.log(error.response)
						throw 'Erro ao salvar na Firestore'
					}
				} catch (error) {
					console.log(error)
					if (error.response) console.log(error.response)
					throw 'Erro ao enviar email de verificação'
				}
			} catch (error) {
				console.log(error)
				if (error.code) {
					switch (error.code) {
						case 'auth/network-request-failed': throw { msg: 'Sem conexão com a rede', customError: true }
						case 'auth/invalid-email': throw { msg: 'Email inválido', customError: true }
						case 'auth/email-already-in-use': throw { msg: 'Email já cadastrado', customError: true }
						case 'auth/operation-not-allowed': throw { msg: 'Operação não permitida', customError: true }
						case 'auth/weak-password': throw { msg: 'Senha fraca. Mínimo 6 caracteres', customError: true }
					}
				}
				throw 'Erro ao criar usuário'
			}
			window.location.assign('/confirmar-email')
		} catch (error) {
			if (error.customError) reject(error)
			else {
				console.log(error)
				if (error.response) console.log(error.response)
				reject(error)
			}
		}
	})
}

export default sendToBackend