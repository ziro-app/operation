import React, { useState } from 'react'
import currencyFormat from '@ziro/currency-format'
import {motion} from 'framer-motion'
import maskInput from '@ziro/mask-input'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner';
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import Details from '@bit/vitorbarbosa19.ziro.details';
import InputText from '@bit/vitorbarbosa19.ziro.input-text'
import Button from '@bit/vitorbarbosa19.ziro.button'
import { useLocation } from 'wouter'
import sendToBackend from './sendToBackend'

const ConsultShipping = ( {envio} ) => {
    const [peso, setPeso] = useState('')
    const [lojista, setLojista] = useState('')
	const [servico, setServico] = useState('')
	const [valor, setValor] = useState('')
	const [agencia, setAgencia] = useState('')
	const [precoFinal, setPrecoFinal] = useState('')
	const [cotacaoSedex, setCotacaoSedex] = useState(false)
	const [errorEnvio, setErrorEnvio] = useState(false)
	const [valorComSeguro, setValorComSeguro] = useState(true)
	const [prazoSedex, setPrazoSedex] = useState(false)
	const [cotacaoPac, setCotacaoPac] = useState(false)
	const [prazoPac, setPrazoPac] = useState(false)
	const [endereco, setEndereco] = useState(false)
	const [error, setError] = useState(false)
	const [load, setLoad] = useState(false)
	const [, setLocation] = useLocation();
	const state = {peso, servico, valor,endereco, agencia,precoFinal, valorComSeguro, setPeso, lojista, setLojista, setCotacaoSedex, setServico, setPrazoSedex, setEndereco, setError, setLoad, setPrazoPac, setCotacaoPac, lojista}
    const block = [
            {
                header: 'Serviços Disponíveis',
                body: [
                    {
                        title: '',
                        content: []
                    }
                ]
            }
		]
		const limpar = () => {
			setLojista('')
			setValor('')
			setPeso('')
			setServico('')
			setCotacaoPac('')
			setCotacaoSedex('')
			setAgencia('')
			setValorComSeguro(true)
		}
	return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
			<FormInput
					name='cepLojista'
					label='cep'
					input={
						<InputText
						value={lojista}
						onChange={({ target: { value } }) => setLojista(maskInput(value, '#####-###', true))}
						placeholder='12345-678'
					/>
					}
				/>
			<FormInput
					name='Valor da Venda'
					label='valor'
					input={
						<InputText
						value={currencyFormat(valor)}
						onChange={({ target: { value } }) => {
							const toInteger = parseInt(value.replace(/[R$\.,]/g, ''), 10)
							return setValor(maskInput(toInteger, '######', true))
						}}
						placeholder='R$2.000,00'
					/>
					}
				/>
			<FormInput
				name='peso'
				label='Peso da mercadoria (Kg)'
				input={
					<InputText
						value={peso}
						onChange={({ target: { value } }) => {
							setPeso(value)
						}}
						placeholder='2,32'
					/>
				}
			/>
			{load ? (
					<div style={{marginTop:'35px', display:'flex', justifyContent:'center'}}>
					<Spinner size="5.5rem"/>
					</div>
				):(
					<div style={{textAlign: 'center'}}>
						{(lojista || valor || peso ||servico || cotacaoPac || cotacaoSedex) && (
							<div style={{marginBottom:'5%'}}><a onClick={() => limpar()}>Limpar</a></div>
							)
						}
						<Button 
						type="button"
						cta="Calcular"
						template="regular"
						click={sendToBackend(state)}
						/>
					</div>
				)
			}
			{cotacaoPac && cotacaoSedex && !error && !load &&
				<div style={{marginTop:'35px'}}>
				<Details blocks={block} />
				<form style={{display:'flex', flexDirection:'column'}}>
						<label>Sedex</label>
						<div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
						<input type="radio" id="sedex" name="sedex" value='sedex' checked={agencia.servico === 'sedex'} onChange={() => {
							setAgencia('')
							setAgencia({
								servico:'sedex',
								valor:cotacaoSedex,
								prazo:cotacaoSedex.prazo
							})
							}}/>
						<div style={{display:'flex', justifyContent:'space-between', flexDirection:'column', width:'85%'}}>
						<div style ={{display:'flex', justifyContent:'space-between'}}><p >Prazo</p> <p>{`${cotacaoSedex.prazo} dias`}</p></div>
						{valorComSeguro && (
						<>
						<div style ={{display:'flex', justifyContent:'space-between'}}><p>Seguro</p> <p>{cotacaoSedex.valorSeguro}</p></div>
						<div style ={{display:'flex', justifyContent:'space-between'}}><p>Envio</p> <p>{cotacaoSedex.valorSem}</p></div>
						</>
						)}
						<div style ={{display:'flex', justifyContent:'space-between'}}><p>{valorComSeguro ? 'Valor Total' : 'Valor Sem Seguro'}</p> <p>{valorComSeguro ? cotacaoSedex.valorTotal : cotacaoSedex.valorSem}</p></div>
						</div>
					</div>
					<label>Pac</label>
						<div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
						<input type="radio" id="pac" name="pac" value='pac' checked={agencia.servico === 'pac'} onChange={() => {
							setAgencia('')
							setAgencia({
								servico:'pac',
								valor:cotacaoPac,
								prazo:cotacaoPac.prazo
							})
							}}/>
						<div style={{display:'flex', justifyContent:'space-between', flexDirection:'column', width:'85%'}}>
						<div style ={{display:'flex', justifyContent:'space-between'}}><p >Prazo</p> <p>{`${cotacaoPac.prazo} dias`}</p></div>
						{valorComSeguro && (
							<>
							<div style ={{display:'flex', justifyContent:'space-between'}}><p>Seguro</p> <p>{cotacaoPac.valorSeguro}</p></div>
							<div style ={{display:'flex', justifyContent:'space-between'}}><p>Envio</p> <p>{cotacaoPac.valorSem}</p></div>
							</>
						)}
						<div style ={{display:'flex', justifyContent:'space-between'}}><p>{valorComSeguro ? 'Valor Total' : 'Valor Sem Seguro'}</p> <p>{valorComSeguro ? cotacaoPac.valorTotal : cotacaoPac.valorSem}</p></div>
						</div>
					</div>
					<div style={{display:'flex', justifyContent: 'space-between', marginTop:'6%'}}>
					<div>
					<p>Não declarar valor</p>
					<label style={{fontSize:'10px'}}>*Enviar a mercadoria sem seguro significa não ter garantia sobre a entrega</label>
					</div>
					<input style={{marginTop:'2.0%'}} type="checkbox" id="_checkbox" name="seguro" value='seguro' onChange={() => {
							if(valorComSeguro === false){
								setValorComSeguro(true)
							}else{
								setValorComSeguro(false)
							}
							}}/>
					</div>
				</form>
				{errorEnvio &&
						<h2 style={{textAlign:'center', marginTop:'35px', color:'red'}}>Favor selecione todos os campos!</h2>
				}
				</div>
			}
			{error &&
				<h2 style={{textAlign:'center', marginTop:'35px', color:'red'}}>{error}</h2>
			}
            </motion.div>
	)
}

export default ConsultShipping