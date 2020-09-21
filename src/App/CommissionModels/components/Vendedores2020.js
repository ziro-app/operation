import React, { useState } from 'react';
import ModelDetails from './ModelDetails'
import calculoVendedores2020 from '../utils/calculoVendedores2020'

const Vendedores2020 = ({dataProviders}) => {
        const [qtd_cadastros, setQtd_cadastros] = useState('')
        const [qtd_mais_quinhentos, setQtd_mais_quinhentos] = useState('')
        const [qtd_10k, setQtd_10k] = useState('')
        const [qtd_100k, setQtd_100k] = useState('')
        const block = [
            {
                header: 'Calculo Vendedores 2020',
                body: [
                    {
                        title: 'Cadastros completos',
                        content: 'qtd_cadastros*10'
                    },
                    {
                        title: 'Preimeira acima de 500',
                        content: 'qtd_mais_quinhentos*20'
                    },
                    {
                        title: 'Chegou a 10k',
                        content: 'qtd_10k*100'
                    },
                    {
                        title: 'Chegou a 100k',
                        content: 'qtd_100k*100'
                    }
                ]
            }
        ]
        const arrayInputs = [{state:qtd_cadastros, setState:setQtd_cadastros, title:'Cadastros Completos do Mes', placeholder:'Qtd de cadastros completos'}, {state:qtd_mais_quinhentos, setState:setQtd_mais_quinhentos, title:'Mais Quinhentos do Mes', placeholder:'Qtd de transações +500'}, {state:qtd_10k, setState:setQtd_10k, title:'Primeiros 10k do Mes', placeholder:'Qtd de primeiros 10k'}, {state:qtd_100k, setState:setQtd_100k, title:'Primeiros 100k do Mes', placeholder:'Qtd de primeiros 100k'}]
        const blockCalc = [
            {
                header: 'Resumo',
                body: [
                    {
                        title: 'Parcela 2',
                        content: `R$ ${calculoVendedores2020(qtd_cadastros,qtd_mais_quinhentos,qtd_10k,qtd_100k).toLocaleString()}`
                    }
                ]
            }
        ]
        return (
            <ModelDetails dataProviders={dataProviders} block={block} arrayInputs={arrayInputs} blockCalc={blockCalc} modeloParcela2='vendedores2020' numeric/>
        )
}

export default Vendedores2020