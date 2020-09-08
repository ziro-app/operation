import React, { useState } from 'react';
import ModelDetails from './ModelDetails'
import calculoVendas2019 from '../utils/calculoVendas2019'

const Vendas2019 = ({dataProviders}) => {
        const [transacaoMesAfiliado, setTransacaoMesAfiliado] = useState('')
        const [receitaMesNovoAfiliado, setReceitaMesNovoAfiliado] = useState('')
        const [receitaMesAntigoAfiliado, setReceitaMesAntigoAfiliado] = useState('')
        const block = [
            {
                header: 'Calculo Vendas 2019',
                body: [
                    {
                        title: 'Transacionado até R$ 100k',
                        content: 'novo*0.2 + antigo*0.1'
                    },
                    {
                        title: 'Transacionado acima de R$ 100k',
                        content: 'novo*0.2 + antigo*0.1 + 1k'
                    }
                ]
            }
        ]
        const arrayInputs = [{state:transacaoMesAfiliado, setState:setTransacaoMesAfiliado, title:'Transacionado Afiliado', placeholder:'Transações no nome do afiliado'},{state:receitaMesNovoAfiliado, setState:setReceitaMesNovoAfiliado, title:'Receita Novo Cliente', placeholder:'Receita de novos clientes'},{state:receitaMesAntigoAfiliado, setState:setReceitaMesAntigoAfiliado, title:'Receita Cliente Antigo', placeholder:'Receita de clientes antigos'}]
        const blockCalc = [
            {
                header: 'Resumo',
                body: [
                    {
                        title: 'Parcela 2',
                        content: `R$ ${calculoVendas2019(transacaoMesAfiliado/100, receitaMesNovoAfiliado/100, receitaMesAntigoAfiliado/100 ).toLocaleString()}`
                    }
                ]
            }
        ]
        return (
            <ModelDetails dataProviders={dataProviders} block={block} arrayInputs={arrayInputs} blockCalc={blockCalc} modeloParcela2='vendas2019'/>
        )
}

export default Vendas2019