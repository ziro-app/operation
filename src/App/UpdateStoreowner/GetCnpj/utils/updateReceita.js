const axios = require('axios')
const arrayObject = require('@ziro/array-object')
const getSheet = require('./getSheet')
const postSheet= require('./postSheet')
const dataPostBatch = require('./dataPostBatch')
const {db} = require('../../../../Firebase')

const updateReceita = async (cnpj, obj, setErrorMsg, setState) => {
    const {setStoreowner, storeowner, setStoreowners} = setState
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
        }
    }
    const {cep, city:cidade, complement:complemento,cityState:estado, reason: razao, neighborhood:bairro, number:numero, street:logradouro} = obj
    try {
        const endereco = complemento ? `${logradouro}, ${numero}, ${complemento}` : `${logradouro}, ${numero}`
        const requestSheet = await axios(getSheet(['Base!A:W']))
        const objectSheet = await arrayObject(requestSheet.data.valueRanges[0])
        const updateObj = {
            razao,
            endereco,
            bairro,
            estado,
            cidade
        }
        const arrayUpdate = dataPostBatch(objectSheet, 'cnpj', cnpj, updateObj, 'Base')
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
                    const newObj = {...storeowner, razao, endereco, cidade, estado, bairro}
                    await setStoreowner(newObj)
                    try {
                        const dataStoreowners = await axios(config)
                        const [, ...listStoreowners] = dataStoreowners.data.values
                        setStoreowners(listStoreowners)
                    } catch (error) {
                        setErrorMsg('Erro ao fazer update na listagem do googleSheets')
                        throw({msg:'erro storeoweners'})
                    }
                } catch (error) {
                    setErrorMsg('Erro ao atualizar os parametros, favor recarregar a página')
                    throw({msg:'erro setState'}) 
                }
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