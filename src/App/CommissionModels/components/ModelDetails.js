import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'
import Details from '@bit/vitorbarbosa19.ziro.details';
import InputText from '@bit/vitorbarbosa19.ziro.input-text';
import Button from '@bit/vitorbarbosa19.ziro.button';
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown';
import maskInput from '@ziro/mask-input'
import currencyFormat from '@ziro/currency-format';
import filterProviders from '../utils/filterProviders'
import removeDuplicates from '../utils/removeDuplicate'

const ModelDetails = ({dataProviders, block, arrayInputs, blockCalc, modeloParcela2}) => {
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
                <div style={{marginTop:'20px'}}>
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
                            return (
                                <div key={inputInfo.title}>
                                    <h2>{inputInfo.title}</h2>
                                    <InputText
                                    value={currencyFormat(inputInfo.state)}
                                    onChange={({ target: { value } }) => {
                                        const toInteger = parseInt(value.replace(/[R$\.,]/g, ''), 10);
                                        return inputInfo.setState(maskInput(toInteger, '##########', true)); 
                                    }}
                                    placeholder={inputInfo.placeholder}
                                    />
                                </div>
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
                            <h2>Colaborador</h2>
                            <Dropdown
                            value={provider || ''}
                            list={arrayProviders}
                            placeholder="Escolha um assessor"
                            onChange={({ target: { value } }) => {setProvider(value)}}
                            onChangeKeyboard={element => element ? setProvider(element.value) : null}
                            />
                            <h2>Mês e Ano</h2>
                            <Dropdown
                            value={mes || ''}
                            list={arrayDatas}
                            placeholder="Escolha uma data"
                            onChange={({ target: { value } }) => {setMes(value)}}
                            onChangeKeyboard={element => element ? setMes(element.value) : null}
                            />
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