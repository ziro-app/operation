const axios = require('axios')
const arrayObject = require('@ziro/array-object')
const getSheet = require('./getSheet')
const postSheet= require('./postSheet')
const dataPostBatch = require('./dataPostBatch')
const {db} = require('../../../../Firebase')

const updateReceita = async (cnpj, obj, setErrorMsg, setState) => {
    const {setRazao, setRua, setNumero, setComplemento, setCidade, setEstado,setBairro} = setState
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
                    await setRazao(razao)
                    await setNumero(numero)
                    await setComplemento(complemento)
                    await setCidade(cidade)
                    await setEstado(estado)
                    await setBairro(bairro)
                    await setRua(logradouro)
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