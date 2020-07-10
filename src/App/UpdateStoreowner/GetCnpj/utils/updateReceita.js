const axios = require('axios')
const arrayObject = require('@ziro/array-object')
const getSheet = require('./getSheet')
const postSheet= require('./postSheet')
const dataPostBatch = require('./dataPostBatch')
const {db} = require('../../../../Firebase')

const updateReceita = async (cnpj, obj, setErrorMsg, setState, objStoreowner) => {
    const {cep, city:cidade, complement:complemento,cityState:estado, reason: razao, neighborhood:bairro, number:numero, street:logradouro} = obj
    try {
        const endereco = complemento ? `${logradouro}, ${numero}, ${complemento}` : `${logradouro}, ${numero}`
        const requestSheet = await axios(getSheet(['BaseTeste!A:W']))
        const objectSheet = await arrayObject(requestSheet.data.valueRanges[0])
        const updateObj = {
            razao,
            endereco,
            bairro,
            estado,
            cep,
            cidade
        }
        const arrayUpdate = dataPostBatch(objectSheet, 'cnpj', cnpj, updateObj, 'BaseTeste')
        await axios(postSheet(arrayUpdate))
        try {
            const query = db.collection('storeowners').where('cnpj', '==', cnpj)
            const idFirebase = []
            const snapshot = await query.get()
            snapshot.forEach(doc => {
                if(doc.data().cnpj === cnpj){
                    idFirebase.push(doc.id)
                }
            })
            if(idFirebase[0]){
                await db.collection('storeowners').doc(idFirebase[0]).update(updateObj)
                try {
                    objStoreowner.razao = updateObj.razao
                    objStoreowner.endereco = updateObj.endereco
                    objStoreowner.bairro = updateObj.bairro
                    objStoreowner.estado = updateObj.estado
                    objStoreowner.cep = updateObj.cep
                    objStoreowner.cidade = updateObj.cidade
                    await setState(objStoreowner)
                } catch (error) {
                    setErrorMsg('Erro ao atualizar os parametros, favor recarregar a página')
                    throw({msg:'erro setState'}) 
                }
            }else{
                setErrorMsg('Planilha Salva, Erro ao salvar no Banco de Dados')
                throw({msg:'erro ao o cnpj no firebase'})
            }
        } catch (error) {
            setErrorMsg('Planilha Salva, Erro ao salvar no Banco de Dados')
            console.log(error)
        }
    } catch (error) {
        setErrorMsg('Erro ao salvar na Planilha e no Banco de Dados')
        console.log(error)
    }
}

export default updateReceita