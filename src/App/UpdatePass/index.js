import React from 'react'
import { motion } from 'framer-motion'
import UpdatePass from '@bit/vitorbarbosa19.ziro.update-pass'
import sendToBackend from './sendToBackend'

export default () => <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><UpdatePass sendToBackend={sendToBackend} navigateTo='/login' /></motion.div>
