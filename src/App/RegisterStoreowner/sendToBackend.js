import { db } from '../../Firebase/index'
import { post } from 'axios'

const sendToBackend = state => () => {
    const { affiliateName, affiliateCpf, advisor, fname, lname, rg, cpf, birth, insta, cnpj, ie, razao, fantasia,
        rua, numero, complemento, bairro, cep, cidade, estado, fone, email, setAffiliateName, setAffiliateCpf, setFname, setLname, setRg, setCpf,
        setAdvisor, setBirth, setInsta, setCnpj, setIe, setRazao, setFantasia, setRua, setNumero, setComplemento, setBairro,
        setCep, setCidade, setEstado, setFone, setEmail, cnpjValid } = state
    const instaTrim = insta ? insta.replace('@', '').trim().toLowerCase() : ''
    const fnameTrim = fname ? fname.trim() : ''
    const lnameTrim = lname ? lname.trim() : ''
    const today = new Date()
    const url = process.env.SHEET_URL
    const body = {
        apiResource: 'values',
        apiMethod: 'append',
        spreadsheetId: process.env.SHEET_STOREOWNERS_ID,
        range: 'Base!A1',
        resource: {
            values: [
                [today, affiliateName, affiliateCpf, `${fnameTrim} ${lnameTrim}`, rg, cpf, birth, instaTrim,
                    cnpj, ie, razao, fantasia, `${rua}, ${numero}, ${complemento}`, bairro, cep, cidade,
                    estado, fone, email, advisor]
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
            if (cnpjValid) {
                await post(url, body, config)
                try {
                    await db.collection('storeowners').add({
                        cadastro: today, affiliateName, affiliateCpf, storeowner: `${fnameTrim} ${lnameTrim}`,
                        rg, cpf, birth, insta: instaTrim, cnpj, ie, razao, fantasia,
                        endereco: `${rua}, ${numero}, ${complemento}`, bairro, cep, cidade,
                        estado, fone, email, advisor
                    })
                } catch (error) {
                    console.log(error)
                    if (error.response) console.log(error.response)
                    throw 'Erro ao salvar na Firestore'
                }
                // clear all fields after submission
                setFname('')
                setLname('')
                setRg('')
                setCpf('')
                setBirth('')
                setInsta('')
                setCnpj('')
                setIe('')
                setRazao('')
                setFantasia('')
                setRua('')
                setNumero('')
                setComplemento('')
                setBairro('')
                setCep('')
                setCidade('')
                setEstado('')
                setFone('')
                setEmail('')
                setAffiliateName('')
                setAffiliateCpf('')
                setAdvisor('')
                // resolve Promise with message to user
                resolve('Lojista adicionado com sucesso!')
            } else throw { msg: 'Cnpj não validado', customError: true }
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