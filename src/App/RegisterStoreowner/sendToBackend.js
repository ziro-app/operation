import { db } from '../../Firebase/index'
import { post } from 'axios'

const sendToBackend = state => () => {
    const { affiliateName, affiliateCpf, advisor, salesman, fname, lname, rg, cpf, birth, insta, cnpj, ie, razao, fantasia,
        rua, numero, complemento, bairro, cep, cidade, estado, fone, email, setAffiliateName, setAffiliateCpf, setFname, setLname, setRg, setCpf,
        setAdvisor, setSalesman, setBirth, setInsta, setCnpj, setIe, setRazao, setFantasia, setRua, setNumero, setComplemento, setBairro,
        setCep, setCidade, setEstado, setFone, setEmail, cnpjValid } = state
    const instaTrim = insta ? insta.replace('@', '').trim().toLowerCase() : ''
    const fnameTrim = fname ? fname.trim() : ''
    const lnameTrim = lname ? lname.trim() : ''
    const today = new Date()
    const url = process.env.SHEET_URL
    const body = {
        apiResource: 'values',
        apiMethod: 'append',
        spreadsheetId: '1x6T_309HUNijByr1B_2Ofi0oFG3USyTAWH66QV-6L-0',
        range: 'Base!A1',
        resource: {
            values: [
                [today, affiliateName, affiliateCpf, `${fnameTrim} ${lnameTrim}`, rg, cpf, birth, instaTrim,
                    cnpj, ie, razao, fantasia, `${rua}, ${numero}, ${complemento}`, bairro, cep, cidade,
                    estado, fone, email, advisor, salesman]
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
                        nomeAfiliado: affiliateName,
                        cpfAfiliado: affiliateCpf,
                        lojista: `${fnameTrim} ${lnameTrim}`,
                        rg,
                        cpf,
                        nascimento: birth,
                        insta: instaTrim,
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
                        email,
                        assessor: advisor,
                        vendedor: salesman
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
                setSalesman('')
                // resolve Promise with message to user
                resolve('Lojista adicionado com sucesso !')
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