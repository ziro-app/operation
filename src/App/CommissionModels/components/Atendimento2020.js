import React, { useState } from 'react';
import ModelDetails from './ModelDetails'
import calculoAtendimento2020 from '../utils/calculoAtendimento2020'

const Atendimento2020 = ({dataProviders}) => {
        const [transacionadoMes, setTransacionadoMes] = useState('')
        const block = [
            {
                header: 'Calculo Atendimento 2020',
                body: [
                    {
                        title: 'Até R$ 1MI',
                        content: 'transacionado_mes*0.0015'
                    },
                    {
                        title: 'Até R$ 2MI',
                        content: '1500 + ((transacionado-1000000)*0.0010)'
                    },
                    {
                        title: 'Até R$ 3MI',
                        content: '2500 + ((transacionado-2000000)*0.0005)'
                    },
                ]
            }
        ]
        const arrayInputs = [{state:transacionadoMes, setState:setTransacionadoMes, title:'Transacionado Mês', placeholder:'Transacionado no mês'}]
        const blockCalc = [
            {
                header: 'Resumo',
                body: [
                    {
                        title: 'Parcela 2',
                        content: `R$ ${calculoAtendimento2020(transacionadoMes/100).toLocaleString()}`
                    }
                ]
            }
        ]
        return (
            <ModelDetails dataProviders={dataProviders} block={block} arrayInputs={arrayInputs} blockCalc={blockCalc} modeloParcela2='atendimento2020'/>
        )
}

export default Atendimento2020