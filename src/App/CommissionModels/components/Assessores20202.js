import React, { useState, useEffect } from 'react';
import ModelDetails from './ModelDetails'
import calculoAssessores20202 from '../utils/calculoAssessores20202'


const Assessores20202 = ({dataProviders}) => {
        const [receitaMes, setReceitaMes] = useState('')
        const block = [
            {
                header: 'Calculo Comissão Assessoria 20202',
                body: [
                    {
                        title: 'Valor de receita',
                        content: '(receita * 0,12)'
                    }
                ]
            }
        ]
        const arrayInputs = [{state:receitaMes, setState:setReceitaMes, title:'Receita Mês', placeholder:'Receita do mês'}]
        const blockCalc = [
            {
                header: 'Resumo',
                body: [
                    {
                        title: 'Parcela 2',
                        content: `R$ ${calculoAssessores20202(receitaMes/100).toLocaleString()}`
                    }
                ]
            }
        ]
        return (
            <ModelDetails dataProviders={dataProviders} block={block} arrayInputs={arrayInputs} blockCalc={blockCalc} modeloParcela2='assessores20202'/>
        )
        
}

export default Assessores20202