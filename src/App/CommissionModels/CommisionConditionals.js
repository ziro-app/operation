import React from 'react';
import Assessores2020 from './components/Assessores2020'
import AssessoresCOVID from './components/AssessoresCOVID'
import Atendimento2020 from './components/Atendimento2020'
import Cobranca2019 from './components/Cobranca2019'
import Logistica2019 from './components/Logistica2019'
import Prospeccao2020 from './components/Prospeccao2020'
import Vendas2019 from './components/Vendas2019'
import Assessores20202 from './components/Assessores20202'
import Logistica2020 from './components/Logistica2020'
import Cobranca2020 from './components/Cobranca2020'
import Vendedores2020 from './components/Vendedores2020'

const CommisionConditionals = ({model, dataProviders}) => {
    if(model === 'assessores2020') return <Assessores2020 dataProviders={dataProviders}/>
    if(model === 'assessoresCOVID') return <AssessoresCOVID dataProviders={dataProviders}/>
    if(model === 'atendimento2020') return <Atendimento2020 dataProviders={dataProviders}/>
    if(model === 'cobranca2019') return <Cobranca2019 dataProviders={dataProviders}/>
    if(model === 'logistica2019') return <Logistica2019 dataProviders={dataProviders}/>
    if(model === 'prospeccao2020') return <Prospeccao2020 dataProviders={dataProviders}/>
    if(model === 'vendas2019') return <Vendas2019 dataProviders={dataProviders}/>
    if(model === 'assessores20202') return <Assessores20202 dataProviders={dataProviders}/>
    if(model === 'logistica2020') return <Logistica2020 dataProviders={dataProviders}/>
    if(model === 'cobranca2020') return <Cobranca2020 dataProviders={dataProviders}/>
    if(model === 'vendedores2020') return <Vendedores2020 dataProviders={dataProviders}/>
    return null
}

export default CommisionConditionals