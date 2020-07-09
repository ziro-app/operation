const axios = require('axios')
const arrayObject = require('@ziro/array-object')
const getSheet = require('./getSheet')
const postSheet= require('./postSheet')
const dataPostBatch = require('./dataPostBatch')
const {db} = require('../../../../Firebase')

const updateReceita = async (cnpj, obj) => {
    const {cep, city:cidade, complement:complemento,cityState:estado, fone, reason: razao, neighborhood:bairro, number:numero, street:logradouro} = obj
    try {
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
    } catch (error) {
        console.log(error)
    }
}

export default updateReceita