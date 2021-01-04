import axios from 'axios'
import arrayMonth from './utils/arrayMonth'
import fetchGraph from './fetchGraph'
import {convertMMMToMM} from './utils/convertToMMM'

const removeDuplicates = arrayWithDuplicates => {
	if (!arrayWithDuplicates) throw new Error('function removeDuplicates must receive an array')
	if (!(arrayWithDuplicates instanceof Array)) throw new Error('function removeDuplicates must receive an array')
	return arrayWithDuplicates.flat().reduce((accumulated, current) => {
		if (accumulated.includes(current)) return accumulated
		return [...accumulated, current]
	}, [])
}

const fetch = (state) => {
    const  {setIsLoading, setError, setSeries, setSectores, sector, setData} = state
	const run = async () => {
        const options = {
            'method' : 'GET',
            'url':process.env.URL_PROVIDERS,
            'headers' : {
                'Authorization':process.env.TOKEN_PROVIDERS
            }
        }
        try {
            setIsLoading(true)
            const result = await axios(options)
            const object = result.data
            const filtrado = object.filter(item => {
                return item.parcela2 !== 0
            })
            const setores = removeDuplicates(filtrado.map(item => item.escopo).filter(Boolean))
            if(setores.includes(sector)){
                const sectorFilter = object.filter(item => {
                    return item.parcela2 !== 0 && item.escopo === sector
                })
                const apelidos = removeDuplicates(sectorFilter.map(item => item.apelido).filter(Boolean))
                const geralParcela2 = apelidos.map(apelido => {
                    const sumWithMonth = arrayMonth().map(month => {
                        const filtrado2 = sectorFilter.filter(item => item.apelido === apelido && item.mes === convertMMMToMM(month))
                        if(filtrado2[0]){
                            const soma = filtrado2.map(item => item.parcela2).reduce((accumulator, currentValue) => accumulator + currentValue)
                            return Math.round(soma*100)/100
                        }
                            return 0
                        
                    })
                    return {name:apelido, data:sumWithMonth}
                })
                setSeries(geralParcela2)
            }else{
                const escopos = removeDuplicates(filtrado.map(item => item.escopo).filter(Boolean))
                const geralParcela2 = escopos.map(escopo => {
                    const sumWithMonth = arrayMonth().map(month => {
                        const filtrado2 = filtrado.filter(item => item.escopo === escopo && item.mes === convertMMMToMM(month))
                        if(filtrado2[0]){
                            const soma = filtrado2.map(item => item.parcela2).reduce((accumulator, currentValue) => accumulator + currentValue)
                            return Math.round(soma*100)/100
                        }
                            return 0
                        
                    })
                    return {name:escopo, data:sumWithMonth}
                })
                setSeries(geralParcela2)
            }
            fetchGraph(state)
            setData(object.filter(item => item.ano))
            setSectores(setores)
        } catch (error) {
            setError(true)
            console.log(error)
        }
        finally{
            setIsLoading(false)
        }
    }
    run()
}

export default fetch