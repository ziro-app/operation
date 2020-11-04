const toNumeric = (num) => {
  return Number(num.replace('R$ ', '').replace('.', '').replace(',', '.'))
}

const fetchGraph = (state) => {
    const {paymentResume, setArrayParcela1, setArrayParcela2, setCategories, setIsLoading, setError, nickname, ano} = state
	const run = async () => {
        try {
            setIsLoading(true)
            const providerData = paymentResume.filter(row => row.apelido === nickname && row.ano === Number(ano))
            setArrayParcela1(providerData.map(item => toNumeric(item.parcela1)))
            setArrayParcela2(providerData.map(item => toNumeric(item.parcela2)))
            setCategories(providerData.map(item => item.mes))
        } catch (error) {
            setError(true)
            console.log(error)
        }
        finally{
          if(paymentResume[0].mes){
            setIsLoading(false)
          }
        }
    }
    run()
}

export default fetchGraph