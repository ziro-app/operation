import axios from 'axios'
import arrayObject  from '@ziro/array-object'
import getSheet  from './getSheet'
import postSheet  from './postSheet'
import dataPostBatch  from './dataPostBatch'

const baseUrl = process.env.SHEET_URL
const sheetAuth = process.env.SHEET_TOKEN

const update = async (sheetId, rangeGet,paramWhere, valueWhere, updateObj) => {
    if(baseUrl || sheetAuth){
        try {
            if(rangeGet.includes('!')){
                const aba = rangeGet.split('!')[0]
                const requestSheet = await axios(getSheet([rangeGet], baseUrl, sheetId, sheetAuth))
                const objectSheet = await arrayObject(requestSheet.data.valueRanges[0])
                const arrayUpdate = dataPostBatch(objectSheet, paramWhere, valueWhere, updateObj, aba)
                await axios(postSheet(baseUrl, sheetId, sheetAuth, arrayUpdate))
                return arrayUpdate
            }
                console.log('Digite corretamente o range')
            
        } catch (error) {
            console.log(error.response.data)
        }
    }else{
        console.log('Insira os campos de requisição corretamente')
    }
}

export default update