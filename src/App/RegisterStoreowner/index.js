import React, { useState } from 'react'
import sendToBackend from './sendToBackend'
import fetch from './fetch'
import searchCnpj from './searchCnpj'
import FormRegisterStoreowner from '@bit/vitorbarbosa19.ziro.form-register-storeowner'

const RegisterStoreowner = () => {
    const [isLoading, setIsLoading] = useState(false)

    return (
        <FormRegisterStoreowner isLoading={isLoading} setIsLoading={setIsLoading} sendToBackend={sendToBackend} searchCnpj={searchCnpj} fetch={fetch} hasAdvisor={true} hasAffiliated={true} haveSalesman={true} />
    )
}

export default RegisterStoreowner
