import { db } from '../../Firebase/index'
import { post } from 'axios'
import { formatDateUTC3 } from '@ziro/format-date-utc3'
import maskInput from '@ziro/mask-input'

const sendToBackend = state => () => {
    const cnpjInCollection = []
    const { affiliateName, affiliateCpf, advisor, salesman, fname, lname, rg, cpf, birth, insta, cnpj, ie, reason, fantasia,
        street, number, complement, neighborhood, cep, city, cityState, fone, whats, email, setSearchedName, setAffiliateName, setAffiliateCpf, setFname, setLname, setRg, setCpf,
        setAdvisor, setSalesman, setBirth, setInsta, setCnpj, setIe, setReason, setFantasia, setStreet, setNumber, setComplement, setNeighborhood,
        setCep, setCity, setCityState, setFone, setWhats, setEmail, cnpjValid } = state
    const instaTrim = insta ? insta.replace('@', '').trim().toLowerCase() : ''
    const fnameTrim = fname ? fname.trim() : ''
    const lnameTrim = lname ? lname.trim() : ''
    const nomeAfiliado = affiliateName.split(' - ')[1] ? affiliateName.split(' - ')[1] : 'NENHUM'
    const formattedCep = cep? maskInput(cep, '##.###-###', true) : ''
    const today = new Date()
    const url = process.env.SHEET_URL
    const config = {
        headers: {
            'Content-type': 'application/json',
            'Authorization': process.env.SHEET_TOKEN
        }
    }
    return new Promise(async (resolve, reject) => {
        try {
            let oldEmail
            if (cnpjValid) {
                const documents = await db.collection('storeowners').get()
                documents.forEach(document => {
                    if (document.data().cnpj !== '')
                        cnpjInCollection.push({ [document.data().cnpj]: document.id })
                });

                try {
                    const exists = cnpjInCollection.find(data => Object.keys(data).includes(cnpj))
                    if (exists) {
                        await db.collection('storeowners').doc(exists[cnpj]).get().then(doc => {
                            if (doc.exists) {
                                oldEmail = doc.data().email
                            }
                        })
                        await db.collection('storeowners').doc(exists[cnpj]).update({
                            nomeAfiliado,
                            cpfAfiliado: affiliateCpf,
                            fname: fnameTrim,
                            lname: lnameTrim,
                            rg,
                            cpf,
                            nascimento: birth,
                            instagram: instaTrim,
                            cnpj,
                            ie,
                            razao: reason,
                            fantasia,
                            endereco: complement ? `${street}, ${number}, ${complement}` : `${street}, ${number}`,
                            bairro: neighborhood,
                            cep: formattedCep,
                            cidade: city,
                            estado: cityState,
                            fone,
                            whatsapp: whats,
                            email: oldEmail ? oldEmail : email.toLowerCase(),
                            assessor: advisor,
                            vendedor: salesman
                        })
                    } else {
                        await db.collection('storeowners').add({
                            cadastro: today,
                            nomeAfiliado,
                            cpfAfiliado: affiliateCpf,
                            fname: fnameTrim,
                            lname: lnameTrim,
                            rg,
                            cpf,
                            nascimento: birth,
                            instagram: instaTrim,
                            cnpj,
                            ie,
                            razao: reason,
                            fantasia,
                            endereco: complement ? `${street}, ${number}, ${complement}` : `${street}, ${number}`,
                            bairro: neighborhood,
                            cep: formattedCep,
                            cidade: city,
                            estado: cityState,
                            fone,
                            whatsapp: whats,
                            email: email.toLowerCase(),
                            assessor: advisor,
                            vendedor: salesman
                        })
                    }
                    const body = {
                        apiResource: 'values',
                        apiMethod: 'append',
                        spreadsheetId: process.env.SHEET_STOREOWNERS_ID,
                        range: 'Base!A1',
                        resource: {
                            values: [
                                [formatDateUTC3(today), `${fnameTrim} ${lnameTrim}`, whats, oldEmail ? oldEmail : email.toLowerCase(), rg, cpf, birth, instaTrim,
                                    cnpj, ie, reason, fantasia, complement ? `${street}, ${number}, ${complement}` : `${street}, ${number}`, neighborhood, formattedCep, city,
                                    cityState, fone, nomeAfiliado, affiliateCpf, advisor, salesman, 'NENHUM']
                            ]
                        },
                        valueInputOption: 'user_entered'
                    }
                    await post(url, body, config)

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
                    setReason('')
                    setFantasia('')
                    setStreet('')
                    setNumber('')
                    setComplement('')
                    setNeighborhood('')
                    setCep('')
                    setCity('')
                    setCityState('')
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
