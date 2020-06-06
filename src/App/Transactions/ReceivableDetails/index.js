import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import Header from '@bit/vitorbarbosa19.ziro.header';
import Error from '@bit/vitorbarbosa19.ziro.error';
import Details from '@bit/vitorbarbosa19.ziro.details';
import currencyFormat from '@ziro/currency-format';
import { containerWithPadding } from '@ziro/theme';
import matchStatusColor from '../matchStatusColor';
import { dateFormat, parcelFormat, round, stringToFloat } from '../utils';
import fetch from '../TransactionDetails/fetch';
import Icon from '@bit/vitorbarbosa19.ziro.icon';

const ReceivableDetails = ({ transactions, transactionId, receivableId }) => {
  const [blocks, setBlocks] = useState([]);
  const [transaction, setTransaction] = useState({});
  const [receivable, setReceivable] = useState({});
  const [, setLocation] = useLocation();
  const [nothing, setNothing] = useState(false);
  const [numberOfLoops, setNumberOfLoops] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    // if(!nothing){
    if (numberOfLoops < 2) {
      setNumberOfLoops(numberOfLoops + 1);
      async function getTransaction(transactionId, setTransaction, setError) {
        fetch(transactionId, setTransaction, setError);
      }
      getTransaction(transactionId, setTransaction, setError)
        .then(response => {
          if (error) {
            setNothing(true);
          }
          {
            if (typeof transaction.receivables !== 'undefined' && !nothing) {
              let block = [];
              const effectReceivable = transaction.receivables.filter(receivable => receivable.receivableZoopId === receivableId)[0];
              setReceivable(effectReceivable);
              if (effectReceivable) {
                let feesFormatted =
                  effectReceivable.gross_amount && effectReceivable.amount
                    ? `- ${currencyFormat(
                        parseFloat(
                          `${round(parseFloat(effectReceivable.gross_amount) - parseFloat(effectReceivable.amount), 2)}`.replace(/[R$\.,]/g, ''),
                        ),
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
          }
        })
        .catch(error => {
          setTransaction({});
          setNothing(true);
        });
    } //}
  }, [transaction, error]);

  if (nothing)
    return (
      <Error
        message="Transação inválida ou não encontrada, retorne e tente novamente."
        type="noData"
        title="Erro ao buscar detalhes da transação"
        backRoute="/transacoes"
        backRouteFunction={route => {
          setNothing(false);
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

export default ReceivableDetails;
