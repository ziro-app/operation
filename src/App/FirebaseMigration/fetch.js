import { db } from '../../Firebase/index'
import axios from 'axios'

// CÓDIGO QUE SERÁ UTILIZADO PARA FAZER A MIGRAÇÃO DOS LOJISTAS DA PLANILHA PARA O FIREBASE

const fetch = (setIsLoading, setIsError, setResult) => {
    const source = axios.CancelToken.source()
    const storeowners = []
    const cnpjInCollection = []
    const run = async () => {
        const config = {
            method: 'POST',
            url: process.env.SHEET_URL,
            data: {
                apiResource: 'values',
                apiMethod: 'get',
                spreadsheetId: process.env.SHEET_STOREOWNERS_ID,
                range: 'Base'
            },
            headers: {
                'Authorization': process.env.SHEET_TOKEN,
                'Content-Type': 'application/json'
            },
            cancelToken: source.token
        }
        try {
            const documents = await db.collection('storeowners').get()
            documents.forEach(document => {
                if (document.data().cnpj !== '')
                    cnpjInCollection.push(document.data().cnpj)
            })

            const dataStoreowners = await axios(config)
            const [, ...listStoreowners] = dataStoreowners.data.values
            listStoreowners.map(storeowner => { //cnpj -> storeowner[8]
                if (!cnpjInCollection.includes(storeowner[8])) {
                    await db.collection('storeowners').add({
                        cadastro: new Date(),
                        nomeAfiliado: storeowner[18] ? storeowner[18] : 'NENHUM',
                        cpfAfiliado: storeowner[19] ? storeowner[19] : '',
                        fname: storeowner[1] ? storeowner[1].split(' ')[0] : '',
                        lname: storeowner[1] ? storeowner[1].split(' ').slice(1).join(' ') : '',
                        rg: storeowner[4] ? storeowner[4] : '',
                        cpf: storeowner[5] ? storeowner[5] : '',
                        nascimento: storeowner[6] ? storeowner[6] : '',
                        instagram: storeowner[7] ? storeowner[7] : '',
                        cnpj: storeowner[8] ? storeowner[8] : '',
                        ie: storeowner[9] ? storeowner[9] : '',
                        razao: storeowner[10] ? storeowner[10] : '',
                        fantasia: storeowner[11] ? storeowner[11] : '',
                        endereco: storeowner[12] ? storeowner[12] : '',
                        bairro: storeowner[13] ? storeowner[13] : '',
                        cep: storeowner[14] ? storeowner[14] : '',
                        cidade: storeowner[15] ? storeowner[15] : '',
                        estado: storeowner[16] ? storeowner[16] : '',
                        fone: storeowner[17] ? storeowner[17] : '',
                        whatsapp: storeowner[2] ? storeowner[2] : '',
                        email: storeowner[3] ? storeowner[3].toLowerCase() : '',
                        assessor: storeowner[20] ? storeowner[20] : '',
                        vendedor: storeowner[21] ? storeowner[21] : ''
                    })
                    cnpjInCollection.push(storeowner[8])
                    storeowners.push(storeowner)
                }
            })

            /*let userFirebase = await db.collection('storeowners').add({
                cadastro: new Date(),
                nomeAfiliado: storeowner[18]? storeowner[18] : 'NENHUM',
                cpfAfiliado: storeowner[19]? storeowner[19] : '',
                fname: storeowner[1] ? storeowner[1].split(' ')[0] : '',
                lname: storeowner[1] ? storeowner[1].split(' ').slice(1).join(' ') : '',
                rg: storeowner[4] ? storeowner[4] : '',
                cpf: storeowner[5] ? storeowner[5] : '',
                nascimento: storeowner[6] ? storeowner[6] : '',
                instagram: storeowner[7] ? storeowner[7] : '',
                cnpj: storeowner[8] ? storeowner[8] : '',
                ie: storeowner[9] ? storeowner[9] : '',
                razao: storeowner[10] ? storeowner[10] : '',
                fantasia: storeowner[11] ? storeowner[11] : '',
                endereco: storeowner[12] ? storeowner[12] : '',
                bairro: storeowner[13] ? storeowner[13] : '',
                cep: storeowner[14] ? storeowner[14] : '',
                cidade: storeowner[15] ? storeowner[15] : '',
                estado: storeowner[16] ? storeowner[16] : '',
                fone: storeowner[17] ? storeowner[17] : '',
                whatsapp: storeowner[2] ? storeowner[2] : '',
                email: storeowner[3] ? storeowner[3].toLowerCase() : '',
                assessor: storeowner[20] ? storeowner[20] : '',
                vendedor: storeowner[21] ? storeowner[21] : ''
            })*/

            setResult(`Um total de ${storeowners.length} usuários adicionados ao Firebase com sucesso.`)
        } catch (error) {
            if (error.response) console.log(error.response)
            else console.log(error)
            setIsError(true)
            setResult(`Erro ao adicionar usuários ao Firebase.`)
        } finally {
            setIsLoading(false)
        }
    }
    run()
    return () => source.cancel('Canceled fetch request. Component unmounted')
}

export default fetch
