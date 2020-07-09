import React from 'react'
import { motion } from 'framer-motion'
import DeleteAccount from '@bit/vitorbarbosa19.ziro.delete-account'
import sendToBackend from './sendToBackend'

export default () => <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><DeleteAccount sendToBackend={sendToBackend} navigateTo='/login' /></motion.div>
