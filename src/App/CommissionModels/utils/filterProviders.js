const filterProviders = async (fetchInfo) => {
    const {dataProviders, setBlockModel, mes, provider, model, numeric} = fetchInfo
    const [realMes, realAno] = mes.split('/')
    const conditionalMes = (mes) => {
        if(mes.startsWith(0)){
            return Number(mes[1])
        }
            return Number(mes)
        
    }
    try {
        const data = dataProviders.filter(item => {
            const {apelido, ano, mes, modeloParcela2} = item
            return modeloParcela2 === model && apelido === provider && conditionalMes(realMes) === mes && Number(realAno) === ano
        })
        const {parcela2} = data[0]
        const block = [
            {
                header: 'Resumo',
                body: [
                    {
                        title: 'Parcela 2',
                        content: `R$ ${parcela2 ? parcela2.toLocaleString() : 0}`
                    },
                ]
            }
        ]
        setBlockModel(block)
    } catch (error) {
        console.log(error)
    }
}

export default filterProviders