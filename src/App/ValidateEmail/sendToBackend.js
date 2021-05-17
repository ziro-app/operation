import { db } from '../../Firebase/index'
import { post } from 'axios'

const sendToBackend = state => () => {
    const { email, setEmail, setUid, setIsOpen, setResendingEmail, setResendStatus, setFinished, nickname } = state
    const nome = nickname ? nickname.trim() : ''
    const allowedUsers = ['Uiller', 'Vitor', 'Cesar', 'Wermeson', 'Ronaldo', 'Claudia', 'Fernanda']
    const url = `${process.env.FIREBASE_AUTH_URL}checkEmail`
    const config = {
        headers: {
            'Content-type': 'application/json',
            'Authorization': process.env.FIREBASE_AUTH_TOKEN
        },
    }

    return new Promise(async (resolve, reject) => {
        try {
            if (process.env.HOMOLOG ? true : allowedUsers.includes(nome)) {
                const doc = await db.collection('users').where('email', '==', email).get()
                if (!doc.empty) {
                    const body = { email }
                    const {
                        data: { ok, uid },
                    } = await post(url, body, config)
                    if (ok) {
                        setEmail('')
                        setUid('')
                        setResendStatus('')
                        setResendingEmail(false)
                        setFinished(false)
                        setIsOpen(false)
                        resolve('Email já está validado')
                    } else {
                        resolve()
                        setUid(uid)
                        setResendStatus('Email não validado. Deseja validar este email ?')
                        setResendingEmail(false)
                        setFinished(false)
                        setIsOpen(true)
                    }
                } else throw { msg: 'Usuário não encontrado', customError: true }
            } else throw { msg: 'Permissão insuficiente', customError: true }
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}

export default sendToBackend
