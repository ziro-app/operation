import React from 'react';
import Assessores2020 from './components/Assessores2020'
import AssessoresCOVID from './components/AssessoresCOVID'
import Atendimento2020 from './components/Atendimento2020'
import Cobranca2019 from './components/Cobranca2019'
import Logistica2019 from './components/Logistica2019'
import Prospeccao2020 from './components/Prospeccao2020'
import Vendas2019 from './components/Vendas2019'

const CommisionConditionals = ({model, dataProviders}) => {
    if(model === 'assessores2020') return <Assessores2020 dataProviders={dataProviders}/>
    if(model === 'assessoresCOVID') return <AssessoresCOVID dataProviders={dataProviders}/>
    if(model === 'atendimento2020') return <Atendimento2020 dataProviders={dataProviders}/>
    if(model === 'cobranca2019') return <Cobranca2019 dataProviders={dataProviders}/>
    if(model === 'logistica2019') return <Logistica2019 dataProviders={dataProviders}/>
    if(model === 'prospeccao2020') return <Prospeccao2020 dataProviders={dataProviders}/>
    if(model === 'vendas2019') return <Vendas2019 dataProviders={dataProviders}/>
    return null
}

export default CommisionConditionals