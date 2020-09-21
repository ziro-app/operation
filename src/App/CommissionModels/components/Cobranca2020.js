import React, { useState } from 'react';
import ModelDetails from './ModelDetails'
import calculoCobranca2020 from '../utils/calculoCobranca2020'

const Cobranca2020 = ({dataProviders}) => {
        const [cobrancasMes, setCobrancasMes] = useState('')
        const block = [
            {
                header: 'Calculo Cobrança 2020',
                body: [
                    {
                        title: 'Cobrança do mes maior que 40k',
                        content: 'cobrancas_mes * 0.007'
                    }
                ]
            }
        ]
        const arrayInputs = [{state:cobrancasMes, setState:setCobrancasMes, title:'Cobranças Mês', placeholder:'Cobrado no mês'}]
        const blockCalc = [
            {
                header: 'Resumo',
                body: [
                    {
                        title: 'Parcela 2',
                        content: `R$ ${calculoCobranca2020(cobrancasMes/100).toLocaleString()}`
                    }
                ]
            }
        ]
        return (
            <ModelDetails dataProviders={dataProviders} block={block} arrayInputs={arrayInputs} blockCalc={blockCalc} modeloParcela2='cobranca2020'/>
        )
}

export default Cobranca2020