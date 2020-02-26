import { auth, db } from '../../Firebase/index'
import { post } from 'axios'
import md5 from 'md5';

const sendToBackend = state => () => {
	const { name, nickname, birthDate, cpf, rg, issuingBody, shippingDate, maritalStatus,
		personalPhone, email, github, street, number, complement, neighborhood, cep, city, cityState, initialDate, scope, amountCharged,
		paymentModel, height, weight, emergencyName, kinship, emergencyContact, pass } = state
	const nome = name ? name.trim() : ''
	const apelido = nickname ? nickname.trim() : ''
	const rgTrim = rg ? rg.trim() : ''
	const orgExp = issuingBody ? issuingBody.trim() : ''
	const telefone = personalPhone ? '+55 ' + personalPhone.trim() : ''
	const emailTrim = email ? email.trim().toLowerCase() : ''
	const githubTrim = github ? github.trim() : ''
	const endereco = street.trim() + ', ' + number + (complement ? ', ' + complement.trim() : '') + ', ' + neighborhood
	const cidade = city ? city.trim() : ''
	const estado = cityState ? cityState.trim() : ''
	const valorCobrado = amountCharged ? amountCharged.trim() : ''
	const nomeEmergencia = emergencyName ? emergencyName.trim() : ''
	const parentesco = kinship ? kinship.trim() : ''
	const contatoEmergencia = emergencyContact ? '+55 ' + emergencyContact.trim() : ''

	const url = process.env.SHEET_URL

	const body = {
		apiResource: 'values',
		apiMethod: 'append',
		spreadsheetId: process.env.SHEET_ID,
		range: 'Base!A1',
		resource: {
			values: [
				[new Date(), md5(emailTrim), nome, apelido, birthDate, cpf, rgTrim,
					orgExp, shippingDate, maritalStatus, telefone, emailTrim, githubTrim,
					endereco, cep, cidade, estado, initialDate, '-', scope,
					valorCobrado, paymentModel, height, weight, nomeEmergencia,
					parentesco, contatoEmergencia]
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
						await db.collection('team').doc(user.uid).set({
							cadastro: new Date(),
							uid: user.uid,
							nome,
							apelido,
							nascimento: birthDate,
							cpf,
							rg: rgTrim,
							orgExp,
							shippingDate,
							estadoCivil: maritalStatus,
							telefone,
							email: emailTrim,
							github: githubTrim,
							endereco,
							cep,
							cidade,
							estado,
							dataInicio: initialDate,
							dataFim: '-',
							escopo: scope,
							valorCobrado,
							modeloPagamento: paymentModel,
							altura: height,
							peso: weight,
							nomeEmergencia,
							parentesco,
							contatoEmergencia
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