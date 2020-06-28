import React, { memo, useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import Header from '@bit/vitorbarbosa19.ziro.header';
import Error from '@bit/vitorbarbosa19.ziro.error';
import Details from '@bit/vitorbarbosa19.ziro.details';
import currencyFormat from '@ziro/currency-format';
import { containerWithPadding } from '@ziro/theme';
import matchStatusColor from '../matchStatusColor';
import { dateFormat, parcelFormat, round } from '../utils';
import fetch from '../TransactionDetails/fetch';

const ReceivableDetails = ({ transactions, transactionId, receivableId, transaction, setTransaction }) => {
    const [blocks, setBlocks] = useState([]);
    const [receivable, setReceivable] = useState({});
    const [, setLocation] = useLocation();
    const [nothing, setNothing] = useState(false);
    const [error, setError] = useState(false);

    async function getTransaction(transactionId, setTransaction, setError, transaction) {
        if (Object.keys(transaction).length === 0 && transaction.constructor === Object)
            await fetch(transactionId, setTransaction, setError, transaction);
    }

    useEffect(() => {
        if (Object.keys(transaction).length === 0 && transaction.constructor === Object) {
            setNothing(false);
            getTransaction(transactionId, setTransaction, setError, transaction).catch(r => setNothing(true));
        }

        if (typeof transaction.receivables !== 'undefined' && !nothing) {
            let block = [];
            const effectReceivable = transaction.receivables.filter(receivable => receivable.receivableZoopId === receivableId)[0];
            setReceivable(effectReceivable);
            if (effectReceivable) {
                let feesFormatted =
                    effectReceivable.gross_amount && effectReceivable.amount
                        ? `- ${currencyFormat(
                        parseFloat(`${round(parseFloat(effectReceivable.gross_amount) - parseFloat(effectReceivable.amount), 2)}`.replace(/[R$\.,]/g, '')),
                        )}`
                        : '-';
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
                                content: `R$${parcelFormat(round(effectReceivable.gross_amount, 2))}`,
                            },
                            {
                                title: 'Tarifa Ziro Pay',
                                content: feesFormatted,
                            },
                            {
                                title: 'Valor líquido',
                                content: `R$${parcelFormat(round(effectReceivable.amount, 2))}`,
                            },
                            {
                                title: 'Recebimento',
                                content: transaction.receivement ? transaction.receivement : 'D+30',
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
                ];
            }
            setBlocks(block);
        }
    }, [transaction, error]);
    if (nothing || (Object.keys(transaction).length === 0 && transaction.constructor === Object))
        return (
            <Error
                message="Transação inválida ou não encontrada, retorne e tente novamente."
                type="noData"
                title="Erro ao buscar detalhes da transação"
                backRoute="/transacoes"
                backRouteFunction={route => {
                    setLocation(route);
                }}
            />
    );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={containerWithPadding}>
      <Header type="icon-link" title="Detalhes do lançamento" navigateTo={`transacoes/${transactionId}`} icon="back" />
      <div style={{ display: 'grid' }}>
        <Details blocks={blocks} />
      </div>
    </motion.div>
  );
};

export default memo(ReceivableDetails);
