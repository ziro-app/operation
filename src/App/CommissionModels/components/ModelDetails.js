import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'
import Details from '@bit/vitorbarbosa19.ziro.details';
import InputText from '@bit/vitorbarbosa19.ziro.input-text';
import Button from '@bit/vitorbarbosa19.ziro.button';
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown';
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import maskInput from '@ziro/mask-input'
import currencyFormat from '@ziro/currency-format';
import filterProviders from '../utils/filterProviders'
import removeDuplicates from '../utils/removeDuplicate'

const ModelDetails = ({dataProviders, block, arrayInputs, blockCalc, modeloParcela2, numeric}) => {
    const [calcule, setCalcule] = useState(false)
    const [provider, setProvider] = useState('')
    const [blockModel, setBlockModel] = useState('')
    const [blockPrevisao, setBlockPrevisao] = useState('')
    const [arrayProviders, setArrayProviders] = useState('')
    const [arrayDatas, setArrayDatas] = useState('')
    const [mes, setMes] = useState('')
    useEffect(() => {
        const valueProviders = dataProviders.filter((item) => {
            return item.modeloParcela2 === modeloParcela2
        }).map(filtrado => {
            return filtrado.apelido
        })
        const valueDatas = dataProviders.filter((item) => {
            if(provider){
                return item.modeloParcela2 === modeloParcela2 && item.apelido === provider
            }
            return item.modeloParcela2 === modeloParcela2
        }).map(filtrado => {
            return `${filtrado.mes}/${filtrado.ano}`
        })
        setArrayProviders(removeDuplicates(valueProviders))
        setArrayDatas(removeDuplicates(valueDatas))
    },[provider])
    const filterInfo = {dataProviders, setBlockModel, mes, provider, model:modeloParcela2}
        return (
                <motion.div style={{marginTop:'20px'}} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Details blocks={block} />
                <div style={{marginTop:'20px', marginBottom:'20px'}}>
                    <Dropdown
                        value={calcule || ''}
                        list={['Simulação', 'Recebido']}
                        placeholder="Escolha o que deseja ver"
                        onChange={({ target: { value } }) => {setCalcule(value)}}
                        onChangeKeyboard={element => element ? setCalcule(element.value) : null}
                    />
                </div>
                {calcule === 'Simulação' && (
                    <>
                        {arrayInputs.map(inputInfo => {
                            if(!numeric){
                                return (
                                    <FormInput key={inputInfo.title} name={inputInfo.title} label={inputInfo.title} input={
                                        <InputText
                                        value={currencyFormat(inputInfo.state)}
                                        onChange={({ target: { value } }) => {
                                            const toInteger = parseInt(value.replace(/[R$\.,]/g, ''), 10);
                                            return inputInfo.setState(maskInput(toInteger, '##########', true)); 
                                        }}
                                        placeholder={inputInfo.placeholder}
                                        />
                                    } />
                                )
                            }
                                return(
                                    <FormInput key={inputInfo.title} name={inputInfo.title} label={inputInfo.title} input={
                                        <InputText
                                        value={inputInfo.state}
                                        onChange={({ target: { value } }) => {
                                            return inputInfo.setState(maskInput(value, '###', false)) 
                                        }}
                                        placeholder={inputInfo.placeholder}
                                        />
                                    } />
                                )
                            
                        })}
                        {blockPrevisao && (
                            <Details blocks={blockPrevisao} />
                        )}
                        <div style={{marginTop:'20px'}}>
                            <Button type="button" cta="Calcular" click={() => setBlockPrevisao(blockCalc)}
                        />
                        </div>
                        <div style={{marginTop:'20px'}}>
                            <Button template="light" type="button" cta="Limpar" click={() => {
                                    arrayInputs.map(inputInfo => {
                                        return inputInfo.setState('')
                                    })
                                    setBlockPrevisao('')
                                    setBlockModel('')
                                }}/>
                        </div>
                    </>
                )}
                {calcule === 'Recebido' && (
                    <>
                        <div style ={{marginTop:'20px'}}>
                            <FormInput name='colaborador' label='Colaborador' input={
                                <Dropdown
                                value={provider || ''}
                                list={arrayProviders}
                                placeholder="Escolha uma pessoa"
                                onChange={({ target: { value } }) => {setProvider(value)}}
                                onChangeKeyboard={element => element ? setProvider(element.value) : null}
                                />
                            } />
                            <FormInput name='meseano' label='Mês e Ano' input={
                                <Dropdown
                                input='Mês e Ano'
                                value={mes || ''}
                                list={arrayDatas}
                                placeholder="Escolha uma data"
                                onChange={({ target: { value } }) => {setMes(value)}}
                                onChangeKeyboard={element => element ? setMes(element.value) : null}
                                />
                            } />
                        </div>
                        {blockModel && (
                            <Details blocks={blockModel} />
                        )}
                        <div style={{marginTop:'20px'}}>
                            <Button type="button" cta="Calcular" click={() => {
                                if(mes && provider){
                                    filterProviders(filterInfo)
                                }else{
                                    console.log('Digita tudo!!')
                                }
                            }}/>
                        </div>
                        <div style={{marginTop:'20px'}}>
                            <Button template="light" type="button" cta="Limpar" click={() => {
                                    setMes('')
                                    setProvider('')
                                    setBlockPrevisao('')
                                    setBlockModel('')
                                }}/>
                        </div>
                    </>
                )}
            </motion.div>
        )

}

export default ModelDetails