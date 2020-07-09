import React, { useContext } from 'react'
import { motion } from 'framer-motion'
import UpdateEmail from '@bit/vitorbarbosa19.ziro.update-email'
import sendToBackend from './sendToBackend'
import { userContext } from '../appContext'

export default () => {
    const { userPos } = useContext(userContext)
    return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><UpdateEmail row={userPos} sendToBackend={sendToBackend} navigateTo='/login' /></motion.div>
}
