import React, { useState } from 'react';
import ModelDetails from './ModelDetails'
import calculoLogistica2020 from '../utils/calculoLogistica2020'

const Logistica2020 = ({dataProviders}) => {
        const [transacionadoMes, setTransacionadoMes] = useState('')
        const block = [
            {
                header: 'Calculo Logística 2020',
                body: [
                    {
                        title: 'Valor de receita',
                        content: 'transacionado_mes * 0.0003'
                    }
                ]
            }
        ]
        const arrayInputs = [{state:transacionadoMes, setState:setTransacionadoMes, title:'Transacionado Mês', placeholder:'transacionado recebido no mes'}]
        const blockCalc = [
            {
                header: 'Resumo',
                body: [
                    {
                        title: 'Parcela 2',
                        content: `R$ ${calculoLogistica2020(transacionadoMes/100).toLocaleString()}`
                    }
                ]
            }
        ]
        return (
            <ModelDetails dataProviders={dataProviders} block={block} arrayInputs={arrayInputs} blockCalc={blockCalc} modeloParcela2='logistica2020'/>
        )
}

export default Logistica2020