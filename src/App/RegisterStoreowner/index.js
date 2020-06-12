import React, { useState } from 'react'
import { motion } from 'framer-motion'
import sendToBackend from './sendToBackend'
import fetch from './fetch'
import searchCnpj from './searchCnpj'
import FormRegisterStoreowner from '@bit/vitorbarbosa19.ziro.form-register-storeowner'

const RegisterStoreowner = () => {
    const [isLoading, setIsLoading] = useState(true)
    const validCnaes = ['47.81-4-00', '14.12-6-01', '14.12-6-03'];
    const cnpjUrl = process.env.CNPJ_URL || '';
    const cnpjToken = process.env.CNPJ_TOKEN || '';
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <FormRegisterStoreowner
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                sendToBackend={sendToBackend}
                fetch={fetch}
                hasAdvisor={true}
                hasAffiliated={true}
                haveSalesman={true}
                validCnaes={validCnaes}
                cnpjUrl={cnpjUrl}
                cnpjToken={cnpjToken}
            />
        </motion.div>
    )
}

export default RegisterStoreowner
