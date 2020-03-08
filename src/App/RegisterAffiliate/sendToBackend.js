import { auth, db } from '../../Firebase/index'
import { post } from 'axios'

const sendToBackend = state => () => {
    const { brand, branch, insta, fname, lname, cpf, whats } = state
    const branchTrim = branch ? branch.trim() : ''
    const instaTrim = insta ? insta.replace('@', '').trim().toLowerCase() : ''
    const fnameTrim = fname ? fname.trim() : ''
    const lnameTrim = lname ? lname.trim() : ''
    const url = process.env.SHEET_URL
    const body = {
        apiResource: 'values',
        apiMethod: 'append',
        spreadsheetId: process.env.SHEET_ID_AFFILIATES,
        range: 'Afiliados!A1',
        resource: {
            values: [
                [new Date(), cpf, fnameTrim, lnameTrim, whats, '', brand, branchTrim, instaTrim]
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
                await db.collection('affiliates').add({
                    cadastro: new Date(), uid: '', brand, branch: branchTrim, insta: instaTrim,
                    fname: fnameTrim, lname: lnameTrim, cpf, whats, email: ''
                })
                resolve('Afiliado criado com sucesso.')
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
