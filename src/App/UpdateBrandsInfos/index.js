import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner'
import Error from '@bit/vitorbarbosa19.ziro.error'
import SpinnerWithDiv from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import useFetch from './useFetch'
import SubmitBlock from './SubmitBlock'
import Button from '@bit/vitorbarbosa19.ziro.button'
import useSendToBackend from './useSendToBackend'
import { container, block, title } from './styles'

export default () => {

    const { brandsInfos, fetchError, isLoading } = useFetch()

    const { sendError, sendToBackend, success, isSending } = useSendToBackend(brandsInfos)

    if (sendError) console.log({ sendError })

    if (isLoading) return <SpinnerWithDiv size={'6rem'} />
    if (fetchError) return <Error />
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={container}>
            <div style={block}>
                <label style={title}>Como usar</label>
                <label>Aperte o botão para atualizar o banco de dados com as últimas informações da planilha de fabricantes (preços, tendências)</label>
            </div>
            <div style={block}>
                <Button type='button' cta='Atualizar' click={sendToBackend} />
                <SubmitBlock isSubmitting={isSending} isSubmitted={success} />
            </div>
        </motion.div>
    )
}
