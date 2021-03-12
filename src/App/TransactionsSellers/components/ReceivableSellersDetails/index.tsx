// @ts-nocheck
import React, { memo, useEffect, useState } from 'react'
import { dateFormat, parcelFormat, round, stringToFloat } from '../../utils'

import Details from '@bit/vitorbarbosa19.ziro.details'
import Error from '@bit/vitorbarbosa19.ziro.error'
import Header from '@bit/vitorbarbosa19.ziro.header'
import { containerWithPadding } from '@ziro/theme'
import currencyFormat from '@ziro/currency-format'
import fetch from '../TransactionsSellersDetails/fetch'
import matchStatusColor from '../../matchStatusColor'
import { motion } from 'framer-motion'
import { useLocation } from 'wouter'

const ReceivableSellersDetails = ({ transactions, transactionId, receivableId, transaction, setTransaction }) => {
    const [blocks, setBlocks] = useState([])
    const [receivable, setReceivable] = useState({})
    const [isLoading,setIsLoading] = useState(false)
    const [, setLocation] = useLocation()
    const [nothing, setNothing] = useState(false)
    const [error, setError] = useState(false)
    const matchPlan = {
        'standard': 'Fluxo',
        'financed1':'D+1',
        'financed30': 'D+30',
        'financed14': 'D+14'
    }
    let markupTransaction = {}
    let antiFraudTransaction = {}

    async function getTransaction(transactionId, setTransaction, setError, transaction) {
        if (Object.keys(transaction).length === 0 && transaction.constructor === Object) await fetch(transactionId, setTransaction, setError, transaction,setNothing, setIsLoading)
    }

    useEffect(() => {
        if (Object.keys(transaction).length === 0 && transaction.constructor === Object) {
            setNothing(false)
            getTransaction(transactionId, setTransaction, setError, transaction).catch(r => setNothing(true))
        }

        if (typeof transaction.receivables !== 'undefined' && !nothing) {
            let block = []
            const effectReceivable = transaction.receivables.filter(receivable => receivable.receivableZoopId === receivableId)[0]
            const sortedSplitAmount = transaction.receivables[0].split_rule
                ? transaction.receivables
                    .sort((a, b) => b.installment - a.installment)
                    .filter(item => item.split_rule !== null)
                    .reverse()
                : []
            setReceivable(effectReceivable);
            markupTransaction = transaction.splitTransaction?.markup ?? transaction.sellerZoopPlan.markup
            antiFraudTransaction = transaction.splitTransaction?.antiFraud ?? transaction.sellerZoopPlan.antiFraud
            const sumReceivablesSplitAntiFraud =
                sortedSplitAmount.length > 0
                    ? sortedSplitAmount
                        .filter(item => item.split_rule === antiFraudTransaction.id)
                        .filter(item => item.installment === effectReceivable.installment)
                        .reduce((acc, { gross_amount }) => acc + parseFloat(gross_amount), 0)
                    : 0
            //console.log('sumReceivablesSplitAntiFraud', sumReceivablesSplitAntiFraud);
            const sumReceivablesSplitZiro =
                sortedSplitAmount.length > 0
                    ? sortedSplitAmount
                        .filter(item => item.split_rule === markupTransaction.id)
                        .filter(item => item.installment === effectReceivable.installment)
                        .reduce((acc, { gross_amount }) => acc + parseFloat(gross_amount), 0)
                    : 0
            if (effectReceivable) {
                let feesFormatted =
                    effectReceivable.gross_amount && effectReceivable.amount
                        ? `- ${round(parseFloat(effectReceivable.gross_amount) + parseFloat(sumReceivablesSplitZiro) - parseFloat(effectReceivable.amount), 2)
                            .toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
                            .replace(/\s/g, '')}`
                        : '-'
                let zoopSplitFormatted =
                    sortedSplitAmount.length > 0 && transaction.insurance === true
                        ? `- ${parseFloat(`${round(parseFloat(sumReceivablesSplitAntiFraud), 2)}`)
                            .toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
                            .replace(/\s/g, '')}`
                        : '-'
                const { sellerZoopPlan: { activePlan } } = transaction;
                block = [
                    {
                        header: 'Informações adicionais',
                        body: [
                            {
                                title: 'Parcela',
                                content: effectReceivable.installment,
                            },
                            {
                                title: 'Valor da parcela',
                                content: `R$${parcelFormat(
                                    round(parseFloat(effectReceivable.gross_amount) + sumReceivablesSplitZiro + sumReceivablesSplitAntiFraud, 2),
                                )}`,
                            },
                            {
                                title: 'Tarifa Zoop',
                                content: feesFormatted !== '- R$0,00' ? feesFormatted : '-',
                            },
                            {
                                title: 'Valor líquido',
                                content: `R$${parcelFormat(round(effectReceivable.amount, 2))}`,
                            },
                            {
                                title: 'Recebimento',
                                content: matchPlan[activePlan] ?? 'Fluxo',
                            },
                            {
                                title: 'Data recebimento',
                                content: effectReceivable.paid_at ? dateFormat(effectReceivable.paid_at) : dateFormat(effectReceivable.expected_on),
                            },
                            {
                                title: 'Status',
                                content: effectReceivable.status === 'paid' ? 'Pago' : 'Pendente',
                                color: matchStatusColor(effectReceivable.status),
                            },
                        ],
                    },
                ]
            }
            setBlocks(block)
        }
    }, [transaction, error])
    if (nothing || (Object.keys(transaction).length === 0 && transaction.constructor === Object))
        return (
            <Error
                message="Transação inválida ou não encontrada, retorne e tente novamente."
                type="noData"
                title="Erro ao buscar detalhes da transação"
                backRoute="/transacoes-fabricantes"
                backRouteFunction={route => {
                    setLocation(route)
                }}
            />
        )

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={containerWithPadding}>
            <Header type="icon-link" title="Detalhes do lançamento" navigateTo={`transacoes-fabricantes/${transactionId}`} icon="back" />
            <div style={{ display: 'grid' }}>
                <Details blocks={blocks} />
            </div>
        </motion.div>
    )
}

export default memo(ReceivableSellersDetails)
