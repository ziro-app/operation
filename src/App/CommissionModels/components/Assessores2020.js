import React, { useState, useEffect } from 'react';
import ModelDetails from './ModelDetails'
import calculoAssessores2020 from '../utils/calculoAssessor2020'


const Assessores2020 = ({dataProviders}) => {
        const [transacoesMes, setTransacoesMes] = useState('')
        const [receitaMes, setReceitaMes] = useState('')
        const block = [
            {
                header: 'Calculo Comissão Assessoria 2020',
                body: [
                    {
                        title: 'Acima de R$ 400k',
                        content: '(receita * 0,1) + 1400'
                    },
                    {
                        title: 'Acima de R$ 300k',
                        content: '(receita * 0,1) + 1200'
                    },
                    {
                        title: 'Acima de R$ 200k',
                        content: '(receita * 0,1) + 900'
                    },
                    {
                        title: 'Acima de R$ 100k',
                        content: '(receita * 0,1) + 500'
                    },
                ]
            }
        ]
        const arrayInputs = [{state:transacoesMes, setState:setTransacoesMes, title:'Transações Mês', placeholder:'Transacionado no mês'},{state:receitaMes, setState:setReceitaMes, title:'Receita Mês', placeholder:'Receita do mês'}]
        const blockCalc = [
            {
                header: 'Resumo',
                body: [
                    {
                        title: 'Parcela 2',
                        content: `R$ ${calculoAssessores2020(transacoesMes/100,receitaMes/100).toLocaleString()}`
                    }
                ]
            }
        ]
        return (
            <ModelDetails dataProviders={dataProviders} block={block} arrayInputs={arrayInputs} blockCalc={blockCalc} modeloParcela2='assessoria2020'/>
        )
        
}

export default Assessores2020