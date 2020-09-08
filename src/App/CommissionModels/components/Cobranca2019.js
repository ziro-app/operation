import React, { useState } from 'react';
import ModelDetails from './ModelDetails'
import calculoCobranca2019 from '../utils/calculoCobranca2019'

const Cobranca2019 = ({dataProviders}) => {
        const [cobrancasMes, setCobrancasMes] = useState('')
        const block = [
            {
                header: 'Calculo Cobrança 2019',
                body: [
                    {
                        title: 'Valor Recebido',
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
                        content: `R$ ${calculoCobranca2019(cobrancasMes/100).toLocaleString()}`
                    }
                ]
            }
        ]
        return (
            <ModelDetails dataProviders={dataProviders} block={block} arrayInputs={arrayInputs} blockCalc={blockCalc} modeloParcela2='cobranca2019'/>
        )
}

export default Cobranca2019