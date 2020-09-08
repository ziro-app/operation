import React, { useState } from 'react';
import ModelDetails from './ModelDetails'
import calculoAssessoresCOVID from '../utils/calculoAssessoresCOVID'


const AssessoresCOVID = ({dataProviders}) => {
        const [transacoesMes, setTransacoesMes] = useState('')
        const [receitaMes, setReceitaMes] = useState('')
        const block = [
            {
                header: 'Calculo Assessores COVID 2020',
                body: [
                    {
                        title: 'Acima de R$ 400k',
                        content: '(receita * 0,1) + 700'
                    },
                    {
                        title: 'Acima de R$ 300k',
                        content: '(receita * 0,1) + 600'
                    },
                    {
                        title: 'Acima de R$ 200k',
                        content: '(receita * 0,1) + 450'
                    },
                    {
                        title: 'Acima de R$ 100k',
                        content: '(receita * 0,1) + 250'
                    },
                    {
                        title: 'Acima de R$ 100k',
                        content: '(receita * 0,1) + 125'
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
                        content: `R$ ${calculoAssessoresCOVID(transacoesMes/100,receitaMes/100).toLocaleString()}`
                    }
                ]
            }
        ]
        return (
            <ModelDetails dataProviders={dataProviders} block={block} arrayInputs={arrayInputs} blockCalc={blockCalc} modeloParcela2='assessoresCOVID'/>
        )
        
}

export default AssessoresCOVID