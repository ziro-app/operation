import React, { useState } from 'react'
import { motion } from 'framer-motion'
import sendToBackend from './sendToBackend'
import fetch from './fetch'
import searchCnpj from './searchCnpj'
import FormRegisterStoreowner from '@bit/vitorbarbosa19.ziro.form-register-storeowner'

const RegisterStoreowner = () => {
    const [isLoading, setIsLoading] = useState(true)
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <FormRegisterStoreowner isLoading={isLoading} setIsLoading={setIsLoading} sendToBackend={sendToBackend} searchCnpj={searchCnpj} fetch={fetch} hasAdvisor={true} hasAffiliated={true} haveSalesman={true} />
        </motion.div>
    )
}

export default RegisterStoreowner
