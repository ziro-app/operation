import React, { useState } from 'react';
import ModelDetails from './ModelDetails'
import calculoLogistica2019 from '../utils/calculoLogistica2019'

const Logistica2019 = ({dataProviders}) => {
        const [receitaMes, setReceitaMes] = useState('')
        const block = [
            {
                header: 'Calculo Logística 2019',
                body: [
                    {
                        title: 'Valor de receita',
                        content: 'receita_mes_ziro * 0.005'
                    }
                ]
            }
        ]
        const arrayInputs = [{state:receitaMes, setState:setReceitaMes, title:'Receita Mês', placeholder:'receita do mes'}]
        const blockCalc = [
            {
                header: 'Resumo',
                body: [
                    {
                        title: 'Parcela 2',
                        content: `R$ ${calculoLogistica2019(receitaMes/100).toLocaleString()}`
                    }
                ]
            }
        ]
        return (
            <ModelDetails dataProviders={dataProviders} block={block} arrayInputs={arrayInputs} blockCalc={blockCalc} modeloParcela2='logistica2019'/>
        )
}

export default Logistica2019