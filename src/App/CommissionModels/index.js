import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import Error from '@bit/vitorbarbosa19.ziro.error'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import ComissionConditional from './CommisionConditionals'
import fetchProviders from './fetchProviders';

const CommissionModels = () => {
    const [modeloParcela2, setModeloParcela2] = useState('')
    const [dataProviders, setDataProviders] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(false)
    const state = {setDataProviders, setIsLoading, setError}
    useEffect(() => fetchProviders(state),[])
    const listModeloParcela2 = ['assessores2020', 'assessoresCOVID', 'atendimento2020', 'cobranca2019', 'logistica2019', 'prospeccao2020', 'vendas2019']
    if(error) return <Error />
    if(isLoading) return <Spinner />
    return(
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Dropdown
                    value={modeloParcela2 || ''}
                    list={listModeloParcela2}
                    placeholder="Escolha o Modelo de Parcela"
                    onChange={({ target: { value } }) => {setModeloParcela2(value)}}
                    onChangeKeyboard={element => element ? setModeloParcela2(element.value) : null}
                />
            <ComissionConditional model={modeloParcela2} dataProviders={dataProviders}/>
        </motion.div>
    )
}

export default CommissionModels