const axios = require('axios')
const arrayObject = require('@ziro/array-object')
const getSheet = require('./utils/getSheet')
const postSheet= require('./utils/postSheet')
const dataPostBatch = require('./utils/dataPostBatch')
const {db} = require('../../Firebase')

const updateReceita = async (cnpj, setLoadCnpj) => {
    const configCnpj = (ignoreDb) => {
        return {
            method: 'POST',
            url:process.env.CNPJ_URL,
            data:{
                cnpj,
                "ignore_db": ignoreDb
            },
            headers:{
                'Content-Type':'application/json',
                'Authorization': process.env.CNPJ_TOKEN
            }
        }
    }
    try {
        await setLoadCnpj(true)
        await axios(configCnpj(true))
        await setTimeout(async () => {
            const requestCnpj = await axios(configCnpj(false))
            const {nome:razao,logradouro,numero,complemento,bairro,cep,municipio:cidade,uf:estado, telefone:fone} = requestCnpj.data.result
            console.log(razao)
            const endereco = complemento ? `${logradouro}, ${numero}, ${complemento}` : `${logradouro}, ${numero}`
            const requestSheet = await axios(getSheet(['BaseTeste!A:W']))
            const objectSheet = await arrayObject(requestSheet.data.valueRanges[0])
            const updateObj = {
                razao,
                fone,
                endereco,
                bairro,
                estado,
                cep,
                cidade
            }
            const arrayUpdate = dataPostBatch(objectSheet, 'cnpj', cnpj, updateObj, 'BaseTeste')
            await axios(postSheet(arrayUpdate))
            const query = db.collection('storeowners').where('cnpj', '==', cnpj)
            const idFirebase = []
            const snapshot = await query.get()
            snapshot.forEach(doc => {
                if(doc.data().cnpj === cnpj){
                    idFirebase.push(doc.id)
                }
            })
            await db.collection('storeowners').doc(idFirebase[0]).update(updateObj)
            await setLoadCnpj(false)
        }, 3000)
    } catch (error) {
        console.log(error)
        await setLoadCnpj(false)
    }
}

export default updateReceita