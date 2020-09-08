import React, { useState } from 'react';
import ModelDetails from './ModelDetails'
import calculoProspeccao2020 from '../utils/calculoProspeccao2020'

const Prospeccao2020 = ({dataProviders}) => {
        const [receitaMes, setReceitaMes] = useState('')
        const block = [
            {
                header: 'Calculo Prospeccao 2020',
                body: [
                    {
                        title: 'Receita recebida',
                        content: 'receita_mes_ziro * 0.01'
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
                        content: `R$ ${calculoProspeccao2020(receitaMes/100).toLocaleString()}`
                    }
                ]
            }
        ]
        return (
            <ModelDetails dataProviders={dataProviders} block={block} arrayInputs={arrayInputs} blockCalc={blockCalc} modeloParcela2='prospeccao2020'/>
        )
}

export default Prospeccao2020