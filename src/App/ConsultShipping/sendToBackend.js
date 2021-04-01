import axios from 'axios'
import currencyFormat from '@ziro/currency-format';

const sendToBackend = state => async () => {
	const { setCotacaoSedex, servico, lojista, peso, valor, setPrazoSedex, setEndereco,setError,setLoad, setCotacaoPac, setPrazoPac, setSeguro } = state
	setError(false)
	setLoad(true)
		const pesoNumber = peso.replace(',','.')
		const dimensoes = (peso) => {
			if(Number(peso)){
				if(peso <= 1.850 && peso >= 0){
					return {
						comprimento:'20',
						largura: '20',
						altura: '20'
					}
				}
				if(peso <= 3.750){
					return {
						comprimento:'25',
						largura: '25',
						altura: '35'
					}
				}
				if(peso <= 7.550){
					return{
						comprimento:'30',
						largura: '30',
						altura: '40',
					}
				}
				if(peso <= 13.450){
					return {
						comprimento:'40',
						largura: '40',
						altura: '50',
					}
				}
					return 'Utilizar o peso correto'
				
			}
				return 'Número invalido'
			
		}
		if(valor/100 <= 20 || valor/100 >=7501 && valor !== ''){
			setError('Favor utilizar valores entre R$21,00 e R$7.500,00 reais')
			setLoad(false)
			return 'Utilizar valores corretos de moeda'
		}
		const {comprimento, altura, largura} = dimensoes(pesoNumber)
		if(!comprimento){
			setLoad(false)
			setError('Peso tem que ter valores positivos e menores que 13.45kg')
			return 'Utilizar o peso correto'
		}
			const config = (servico) => {
				return {
					method:'POST',
					url: process.env.URL_CORREIOS,
					data:{
						'servico':servico,
						'cep':lojista,
						'peso':pesoNumber,
						'comprimento':comprimento,
						'altura':altura,
						'largura':largura,
						'valor':String(valor/100)
					},
					headers: {
						'Authorization': process.env.TOKEN_CORREIOS,
                        'Content-Type': 'application/json',
                        'Origin':'https://ziro.app'
					}
				}
			}
			const configCEP = {
				method: 'GET',
				url: `https://viacep.com.br/ws/${lojista}/json/`,
				headers:{
                    'Content-Type': 'application/json'
				}
			}
        try {
					const objValues = (valorSeguro, valorSemSeguro) => {
						const changeToNumber = (valor) => Math.round(Number(valor.replace(',','.').trim()) * 100)/100
						const newValorSemSeguro = Math.round(Number(valorSemSeguro.replace(',','.').trim()) * 0.93 * 100)/100
						const newValorSeguro = changeToNumber(valorSeguro)
						const newValorTotal = newValorSemSeguro + newValorSeguro
						return {
							valorTotal: currencyFormat(newValorTotal*100),
							valorSeguro: `R$ ${String(newValorSeguro)?.replace('.',',')}`,
							valorSem: currencyFormat(newValorSemSeguro*100)
						}
					}
					const requestSedex = await axios(config('sedex'))
					const requestPac = await axios(config('pac'))
					const {PrazoEntrega:prazoSedex, ValorValorDeclarado:declaroSedex, ValorSemAdicionais:semAdicionarSedex} = requestSedex.data.Servicos.cServico
					const {PrazoEntrega:prazoPac, ValorValorDeclarado:declaroPac, ValorSemAdicionais:semAdicionarPac} = requestPac.data.Servicos.cServico
					const newCotacaoSedex = objValues(declaroSedex._text, semAdicionarSedex._text)
					const newCotacaoPac = objValues(declaroPac._text, semAdicionarPac._text)
					setCotacaoSedex({ prazo:prazoSedex._text, ...newCotacaoSedex})
					setCotacaoPac({prazo:prazoPac._text, ...newCotacaoPac})
			try {
				const requestVia = await axios(configCEP)
				if(!requestVia.data.erro){
					const {logradouro, localidade, uf} = requestVia.data
					setEndereco(`${logradouro}-${localidade}/${uf}`)
					setLoad(false)
					return 'consulta feita com sucesso'
				}
					setError('CEP não encontrado')
					setLoad(false)
					return 'CEP não encontrado'
				
			} catch (error) {
				setError('CEP não encontrado')
				setLoad(false)
				return 'CEP não encontrado'
			}
        } catch (error) {
            if (error.customError){
				setLoad(false)
				return error
			}
            
                console.log(error)
				if (error.response) console.log(error.response)
				setLoad(false)
				setError('Sistema está fora do ar')
                return 'Erro ao consutltar!'
            
        }
}

export default sendToBackend