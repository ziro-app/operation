import React, { useState, useContext } from 'react'
import sendToBackend from './sendToBackend'
import fetch from './fetch'
import searchCnpj from './searchCnpj'
import { userContext } from '../appContext'
import FormRegisterStoreowner from '@bit/vitorbarbosa19.ziro.form-register-storeowner'
import { containerWithPadding } from '@ziro/theme'

const RegisterStoreowner = () => {
    const [isLoading, setIsLoading] = useState(false)
    const { name, cpf } = useContext(userContext)

    return (
        <div style={containerWithPadding}>
            <FormRegisterStoreowner isLoading={isLoading} setIsLoading={setIsLoading} sendToBackend={sendToBackend} affiliateName={name} affiliateCpf={cpf} searchCnpj={searchCnpj} fetch={fetch} hasAdvisor={true} hasAffiliated={true} haveSalesman={true} />
        </div>
    )
}

export default RegisterStoreowner