import { db } from '../../Firebase/index'
import { post } from 'axios'
import { dateHourFormatterUTC3 } from '../utils'

const sendToBackend = state => () => {
    const { affiliateName, affiliateCpf, advisor, salesman, fname, lname, rg, cpf, birth, insta, cnpj, ie, razao, fantasia,
        rua, numero, complemento, bairro, cep, cidade, estado, fone, whats, email, setSearchedName, setAffiliateName, setAffiliateCpf, setFname, setLname, setRg, setCpf,
        setAdvisor, setSalesman, setBirth, setInsta, setCnpj, setIe, setRazao, setFantasia, setRua, setNumero, setComplemento, setBairro,
        setCep, setCidade, setEstado, setFone, setWhats, setEmail, cnpjValid } = state
    const instaTrim = insta ? insta.replace('@', '').trim().toLowerCase() : ''
    const fnameTrim = fname ? fname.trim() : ''
    const lnameTrim = lname ? lname.trim() : ''
    const nomeAfiliado = affiliateName.split(' - ')[1]? affiliateName.split(' - ')[1] : 'NENHUM'
    const today = new Date()
    const url = process.env.SHEET_URL
    const body = {
        apiResource: 'values',
        apiMethod: 'append',
        spreadsheetId: process.env.SHEET_STOREOWNERS_ID,
        range: 'Base!A1',
        resource: {
            values: [
                [dateHourFormatterUTC3(today), `${fnameTrim} ${lnameTrim}`, rg, cpf, birth, instaTrim,
                    cnpj, ie, razao, fantasia, `${rua}, ${numero}, ${complemento}`, bairro, cep, cidade,
                    estado, fone, whats, email.toLowerCase(), nomeAfiliado, affiliateCpf, advisor, salesman]
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
                        cadastro: today,
                        nomeAfiliado,
                        cpfAfiliado: affiliateCpf,
                        lojista: `${fnameTrim} ${lnameTrim}`,
                        rg,
                        cpf,
                        nascimento: birth,
                        instagram: instaTrim,
                        cnpj,
                        ie,
                        razao,
                        fantasia,
                        endereco: `${rua}, ${numero}, ${complemento}`,
                        bairro,
                        cep,
                        cidade,
                        estado,
                        fone,
                        whatsapp: whats,
                        email: email.toLowerCase(),
                        assessor: advisor,
                        vendedor: salesman
                    })

                    // clear all fields after submission
                    setSearchedName('')
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
                    setWhats('')
                    setEmail('')
                    setAffiliateName('')
                    setAffiliateCpf('')
                    setAdvisor('')
                    setSalesman('')
                    // resolve Promise with message to user
                    resolve('Lojista adicionado com sucesso !')
                } catch (error) {
                    console.log(error)
                    if (error.response) console.log(error.response)
                    throw 'Erro ao salvar na Firestore'
                }
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
