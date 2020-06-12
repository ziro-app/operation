import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import axios from 'axios';
import Table from '@bit/vitorbarbosa19.ziro.table';
import Details from '@bit/vitorbarbosa19.ziro.details';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import Illustration from '@bit/vitorbarbosa19.ziro.illustration';
import Header from '@bit/vitorbarbosa19.ziro.header';
import Error from '@bit/vitorbarbosa19.ziro.error';
import Button from '@bit/vitorbarbosa19.ziro.button';
import Modal from '@bit/vitorbarbosa19.ziro.modal';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner';
import InputText from '@bit/vitorbarbosa19.ziro.input-text';
import currencyFormat from '@ziro/currency-format';
import { alertColor, containerWithPadding, successColor } from '@ziro/theme';
import { db } from '../../../Firebase/index';
import { dateFormat, parcelFormat, round, stringToFloat } from '../utils';
import { buttonContainer, custom, illustrationContainer, modalContainer, modalLabel, spinner } from './styles';
import maskInput from '@ziro/mask-input';
import fetch from './fetch';

const TransactionDetails = ({ transactions, transactionId }) => {
  const [amount, setAmount] = useState('');
  const [receipt_id, setReceipt_id] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [transaction, setTransaction] = useState({});
  const [nothing, setNothing] = useState(false);
  const [, setLocation] = useLocation();
  const [copyResultText, setCopyResultText] = useState('');
  const [copyResultStatus, setCopyResultStatus] = useState(true);
  const [cancelModal, setCancelModal] = useState(false);
  const [captureModal, setCaptureModal] = useState(false);
  const [splitTransactionModal, setSplitTransactionModal] = useState(false);
  const textAreaRef = useRef(null);
  const paymentLink = `https://ziro.app/pagamento/${transactionId}/escolher-cartao?doc`;
  const [blocksStoreowner, setBlocksStoreowner] = useState([]);
  const [validationMessage, setValidationMessage] = useState('');
  const [loadingButton, setLoadingButton] = useState(false);

  const [numberOfLoops, setNumberOfLoops] = useState(0);

  useEffect(() => {
    setValidationMessage('');
  }, [splitTransactionModal, captureModal, cancelModal]);

  const splitTransaction = async (transaction_id, on_behalf_of, amountTransaction) => {
    try {
      if (validationMessage) return;
      console.log(transaction_id, on_behalf_of, amount);
      setLoadingButton(true);
      //amountTransaction = amountTransaction.replace('R$', '').replace(',', '').replace('.', '')

      await axios
        .post(
          `${process.env.PAY}/split-rules-create?transaction_id=${transaction_id}`,
          {
            transaction_id,
            recipient: on_behalf_of,
            amount,
          },
          {
            headers: {
              Authorization: `Basic ${process.env.PAY_TOKEN}`,
            },
          },
        )
        .then(result => {
          const { data } = result;
          console.log(data);
          const { status } = data;
          setLoadingButton(false);
          setSplitTransactionModal(false);
          if (status === 'succeeded') {
            /*transaction.status = 'Aprovado'
                        document.location.reload(true);*/
          }

          // setError(true);
          // setLocation('/recibo');
        });
      setSplitTransactionModal(false);
    } catch (e) {
      // console.log(e.response);
      setValidationMessage('Um erro ocorreu, entre em contato com o TI!');
      console.log('erro na requisição para a divisão da zoop');
      console.log(e.response.status);
      setLoadingButton(false);
    }
  };
  const postCapture = async (transaction_id, on_behalf_of, amount) => {
    try {
      /*transaction_id = "be42973b540044d4907f510e81da6a21";
            on_behalf_of= "6e4b9db52193481ca2a345dfc3577c8e";
            amount= "32";

            console.log(transaction_id)
            console.log(on_behalf_of)
            console.log(amount)*/
      //console.log(amount.replace('R$', '').replace(',', ''))
      setLoadingButton(true);
      amount = amount.replace('R$', '').replace(',', '').replace('.', '');
      await axios
        .post(
          `${process.env.PAY}/payments-capture?transaction_id=${transaction_id}`,
          {
            transaction_id,
            on_behalf_of,
            amount,
          },
          {
            headers: {
              Authorization: `Basic ${process.env.PAY_TOKEN}`,
            },
          },
        )
        .then(result => {
          setLoadingButton(false);
          const { data } = result;
          console.log(data);
          const { status } = data;
          setCaptureModal(false);
          if (status === 'succeeded') {
            transaction.status = 'Aprovado';
            document.location.reload(true);
          }

          // setError(true);
          // setLocation('/recibo');
        });
      setCancelModal(false);
    } catch (e) {
      setLoadingButton(false);
      // console.log(e.response);
      setValidationMessage('Um erro ocorreu, entre em contato com o TI!');
      console.log('erro na requisição para a captação da zoop');
      console.log(e.response.status);
    }
  };

  const cancelTransaction = async (transaction_id, on_behalf_of, amountBeforeConvert) => {
    try {
      const amount = amountBeforeConvert.replace('R$', '').replace(',', '').replace('.', '');
      setLoadingButton(true);
      await axios
        .post(
          `${process.env.PAY}/payments-void`,
          {
            transaction_id,
            on_behalf_of,
            amount,
          },
          {
            headers: {
              Authorization: `Basic ${process.env.PAY_TOKEN}`,
            },
          },
        )
        .then(result => {
          setLoadingButton(false);
          const { data } = result;
          const { status } = data;
          setCancelModal(false);
          if (status === 'succeeded') {
            transaction.status = 'Cancelado';
          }
          document.location.reload(true);

          // setError(true);
          // setLocation('/recibo');
        });
    } catch (e) {
      setLoadingButton(false);
      // console.log(e.response);
      console.log('erro na requisição para o cancelamento da zoop');
      console.log(e.response.status);
      if (e.response.status === 402) {
        setValidationMessage('A transação já foi cancelada!');
      }
    }
  };

  const deleteTransaction = async () => {
    setIsLoading(true);
    try {
      await db.collection('credit-card-payments').doc(transactionId).delete();
      setLocation('/transacoes');
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      if (error.response) console.log(error.response);
      setCopyResultStatus(false);
      setCopyResultText('Erro ao excluir transação!');
      setIsLoading(false);
    }
  };

  const copyToClipboard = e => {
    e.preventDefault();
    if (document.queryCommandSupported('copy')) {
      try {
        textAreaRef.current.select();
        document.execCommand('copy');
        setCopyResultStatus(true);
        setCopyResultText('Copiado !');
        setTimeout(() => {
          setCopyResultText('');
        }, 2500);
      } catch (error) {
        console.log(error);
        setCopyResultStatus(false);
        setCopyResultText('Erro ao copiar.');
        setTimeout(() => {
          setCopyResultText('');
        }, 2500);
      }
    } else {
      setCopyResultStatus(false);
      setCopyResultText('Sem suporte para cópia.');
      setTimeout(() => {
        setCopyResultText('');
      }, 2500);
    }
  };

  useEffect(() => {
    /*const effectTransaction = transactions.filter(
            (transaction) => transaction.transactionId === transactionId
        )[0];
        if(effectTransaction)
        setTransaction(effectTransaction);
        else*/
    if (!nothing) {
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
              if (transaction && !nothing) {
                let block;
                let dataTable;
                let feesFormatted = transaction.fees ? `- ${currencyFormat(parseFloat(transaction.fees.replace('.', '')))}` : '-';
                let liquidFormatted = transaction.fees
                  ? currencyFormat(
                      parseFloat(`${(stringToFloat(transaction.charge) - parseFloat(transaction.fees)).toFixed(2)}`.replace(/[R$\.,]/g, '')),
                    )
                  : '-';

                block = [
                  {
                    header: 'Venda',
                    body: [
                      {
                        title: 'Lojista',
                        content: transaction.buyerRazao ? transaction.buyerRazao : '-',
                      },
                      {
                        title: 'Marca',
                        content: transaction.seller,
                      },
                      {
                        title: 'Valor',
                        content: transaction.charge,
                      },
                      {
                        title: 'Tarifa Ziro Pay',
                        content: feesFormatted,
                      },
                      {
                        title: 'Valor líquido',
                        content: liquidFormatted,
                      },
                      {
                        title: 'Parcela máxima',
                        content: `${transaction.maxInstallments}x`,
                      },
                      {
                        title: 'Parcela escolhida',
                        content: transaction.installments ? `${transaction.installments}x` : '-',
                      },
                      {
                        title: 'Data de pagamento',
                        content: transaction.date ? `${transaction.date}` : '-',
                      },
                      {
                        title: 'Data de criação do link',
                        content: transaction.dateLinkCreated ? `${transaction.dateLinkCreated}` : '-',
                      },
                      {
                        title: 'Status',
                        content: transaction.status,
                        color: transaction.statusColor,
                      },
                    ],
                  },
                ];

                if (typeof transaction.receivables !== 'undefined' && transaction.receivables.length) {
                  const sortedTransactions = transaction.receivables.sort((a, b) => b.installment - a.installment);
                  const paidRows = [];
                  const paidClicks = [];
                  let paidAmount = 0;
                  let paidAmountWithoutFees = 0;
                  const unpaidRows = [];
                  const unpaidClicks = [];
                  let unpaidAmount = 0;
                  let unpaidAmountWithoutFees = 0;
                  sortedTransactions.map(transaction => {
                    if (!transaction.paid_at) {
                      let upAm = round(parseFloat(transaction.gross_amount), 2);
                      let upAmw = round(parseFloat(transaction.amount), 2);
                      unpaidRows.push([
                        `${transaction.installment}`,
                        `${parcelFormat(upAm)}`,
                        `${parcelFormat(upAmw)}`,
                        `${dateFormat(transaction.expected_on)}`,
                        <Icon type="chevronRight" size={14} />,
                      ]);
                      unpaidClicks.push(() => setLocation(`/transacoes/${transactionId}/${transaction.receivableZoopId}`));
                      unpaidAmount += parseFloat(upAm);
                      unpaidAmountWithoutFees += parseFloat(upAmw);
                    } else {
                      let upAm = round(parseFloat(transaction.gross_amount), 2);
                      let upAmw = round(parseFloat(transaction.amount), 2);
                      paidRows.push([
                        `${transaction.installment}`,
                        `${parcelFormat(upAm)}`,
                        `${parcelFormat(upAmw)}`,
                        `${dateFormat(transaction.paid_at)}`,
                        <Icon type="chevronRight" size={14} />,
                      ]);
                      paidClicks.push(() => setLocation(`/transacoes/${transactionId}/${transaction.receivableZoopId}`));
                      paidAmount += parseFloat(upAm);
                      paidAmountWithoutFees += parseFloat(upAmw);
                    }
                  });
                  dataTable = [
                    {
                      title: 'Lançamentos Pagos',
                      header: ['Parc.', 'Bruto', 'Líquido', 'Data', ''],
                      rows: paidRows.reverse(),
                      rowsClicks: paidClicks.reverse(),
                      totals: ['-', `${parcelFormat(round(paidAmount, 2))}`, `${parcelFormat(round(paidAmountWithoutFees, 2))}`, '-', ''],
                    },
                    {
                      title: 'Lançamentos Futuros',
                      header: ['Parc.', 'Bruto', 'Líquido', 'Data', ''],
                      rows: unpaidRows.reverse(),
                      rowsClicks: unpaidClicks.reverse(),
                      totals: ['-', `${parcelFormat(round(unpaidAmount, 2))}`, `${parcelFormat(round(unpaidAmountWithoutFees, 2))}`, '-', ''],
                    },
                  ];
                }

                setBlocks(block);
                setData(dataTable ? dataTable : []);

                {
                  let blockStoreowner;
                  if (transaction.status === 'Aprovada' || transaction.status === 'Pré Autorizado' || transaction.status === 'Cancelado') {
                    const installmentsNumber = parseInt(transaction.installments);
                    if (transaction.installments > 0) {
                      blockStoreowner = [
                        {
                          header: 'Cartão',
                          body: [
                            {
                              title: 'Bandeira',
                              content: transaction.brand ? transaction.brand : '-',
                            },
                            {
                              title: 'Número',
                              content: transaction.firstFour ? `${transaction.firstFour}...${transaction.lastFour}` : '-',
                            },
                            {
                              title: 'Portador',
                              content: transaction.cardholder ? transaction.cardholder.toUpperCase() : '-',
                            },
                          ],
                        },
                      ];
                    }
                  } else {
                    blockStoreowner = [
                      {
                        header: 'Cartão',
                        body: [
                          {
                            title: 'Bandeira',
                            content: transaction.brand ? transaction.brand : '-',
                          },
                          {
                            title: 'Número',
                            content: transaction.firstFour ? `${transaction.firstFour}...${transaction.lastFour}` : '-',
                          },
                          {
                            title: 'Portador',
                            content: transaction.cardholder ? transaction.cardholder.toUpperCase() : '-',
                          },
                        ],
                      },
                    ];
                  }
                  setBlocksStoreowner(blockStoreowner);
                }
              }
            }
          })
          .catch(error => {
            setTransaction({});
            setNothing(true);
          });
      }
    }
  }, [transaction, error]);
  if (isLoading)
    return (
      <div style={spinner}>
        <Spinner size="5.5rem" />
      </div>
    );
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
      <input type="text" style={{ position: 'absolute', left: '-9999px' }} value={paymentLink} ref={textAreaRef} readOnly />
      <Header type="icon-link" title="Detalhes da venda" navigateTo="transacoes" icon="back" />

      <div style={{ display: 'grid', gridRowGap: '40px' }}>
        <Details blocks={blocksStoreowner} />

        <div style={buttonContainer}>
          {transaction.status === 'Pré Autorizado' && (
            <div>
              <Modal boxStyle={modalContainer} isOpen={captureModal} setIsOpen={() => setCaptureModal(false)}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateRows: '1fr auto',
                    gridRowGap: '20px',
                  }}
                >
                  <label style={modalLabel}>Deseja realmente já capturar o valor?</label>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gridColumnGap: '20px',
                      gridRowGap: '10px',
                    }}
                  >
                    {loadingButton ? (
                      <div style={spinner}>
                        <Spinner size="5.5rem" />
                      </div>
                    ) : (
                      <Button
                        type="button"
                        cta="Capturar"
                        click={() => postCapture(transaction.transactionZoopId, transaction.sellerZoopId, transaction.charge)}
                        template="regular"
                      />
                    )}

                    <Button type="button" cta="Cancelar" click={() => setCaptureModal(false)} template="light" />
                    {validationMessage && <label style={{ color: alertColor }}>{validationMessage}</label>}
                  </div>
                </div>
              </Modal>
              <Button type="button" cta="Capturar transação" click={() => setCaptureModal(true)} template="regular" />
            </div>
          )}
          {(transaction.status === 'Pré Autorizado' || transaction.status === 'Aprovado') && (
            <Button type="button" cta="Cobrar a divisão" click={() => setLocation(`/transacoes/${transactionId}/split`)} template="regular" />
          )}
          {/*(transaction.status === 'Pré Autorizado' || transaction.status === 'Aprovado') && (
            <div>
              <Modal boxStyle={modalContainer} isOpen={splitTransactionModal} setIsOpen={() => setSplitTransactionModal(false)}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateRows: '1fr',
                    gridRowGap: '20px',
                  }}
                >
                  <label style={modalLabel}>Coloque a tarifa que será cobrada fabricante!</label>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr',
                      gridColumnGap: '10px',
                      gridRowGap: '10px',
                    }}
                  >
                    <InputText
                      value={currencyFormat(amount)}
                      onChange={({ target: { value } }) => {
                        const toInteger = parseInt(value.replace(/[R$\.,]/g, ''), 10);
                        const transactionAmount = parseInt(transaction.charge.replace('R$', '').replace(',', '').replace('.', ''));
                        if (toInteger > transactionAmount) setValidationMessage('O valor não pode ser maior que o da transação!');
                        else setValidationMessage('');
                        return setAmount(maskInput(toInteger, '#######', true));
                      }}
                      placeholder="R$1.299,99"
                    />
                    {loadingButton ? (
                      <div style={spinner}>
                        <Spinner size="5.5rem" />
                      </div>
                    ) : (
                      <Button
                        type="button"
                        cta="Cobrar a divisão"
                        click={() => splitTransaction(transaction.transactionZoopId, transaction.sellerZoopId, transaction.charge)}
                        template="regular"
                      />
                    )}

                    <Button type="button" cta="Cancelar" click={() => setSplitTransactionModal(false)} template="light" />
                  </div>
                  {validationMessage && <label style={{ color: alertColor }}>{validationMessage}</label>}
                </div>
              </Modal>
              <Button type="button" cta="Split da transação" click={() => setSplitTransactionModal(true)} template="regular" />
            </div>
          )*/}
          {(transaction.status === 'Aprovado' || transaction.status === 'Pré Aprovado' || transaction.status === 'Pré Autorizado') && (
            <div>
              <Modal boxStyle={modalContainer} isOpen={cancelModal} setIsOpen={() => setCancelModal(false)}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateRows: '1fr auto',
                    gridRowGap: '20px',
                  }}
                >
                  <label style={modalLabel}>Deseja realmente cancelar a transação ?</label>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gridColumnGap: '20px',
                    }}
                  >
                    {loadingButton ? (
                      <div style={spinner}>
                        <Spinner size="5.5rem" />
                      </div>
                    ) : (
                      <Button
                        type="button"
                        cta="Sim"
                        click={() => cancelTransaction(transaction.transactionZoopId, transaction.sellerZoopId, transaction.charge)}
                        template="regular"
                      />
                    )}

                    <Button type="button" cta="Não" click={() => setCancelModal(false)} template="light" />
                  </div>
                  {validationMessage && <label style={{ color: alertColor }}>{validationMessage}</label>}
                </div>
              </Modal>
              <Button type="button" cta="Cancelar transação" click={() => setCancelModal(true)} template="destructive" />
            </div>
          )}
        </div>
        <Details blocks={blocks} />
        {(transaction.status === 'Aprovado' || transaction.status === 'Pago' || transaction.status === 'Pré Autorizado') && (
          <>
            <Table
              data={data}
              customGrid={{
                gridTemplateColumns: 'auto 1fr 1fr 1fr 20px',
                gridRowGap: '15px',
              }}
            />
            <span style={{ fontFamily: 'Rubik', fontSize: '12px' }}>* Os valores das parcelas foram arredondados para a segunda casa decimal</span>
          </>
        )}
        {(transaction.status === 'Cancelado' || transaction.status === 'Falhado') && (
          <div style={illustrationContainer}>
            <div style={{ display: 'grid', justifyItems: 'center' }}>
              <Illustration type="paymentError" size={175} />
              <span style={custom(15, transaction.statusColor)}>Pagamento cancelado.</span>
            </div>
          </div>
        )}
        {(transaction.status === 'Aguardando Pagamento' || transaction.status === 'Aprovação Pendente') && (
          <>
            <div style={illustrationContainer}>
              <div
                style={{
                  display: 'grid',
                  justifyItems: 'center',
                }}
              >
                <Illustration type="waiting" size={200} />
              </div>
            </div>
            <div style={buttonContainer}>
              <div>
                {copyResultText ? (
                  <div
                    style={{
                      padding: '0 0 5px',
                      height: '24px',
                      fontSize: '1.6rem',
                      color: copyResultStatus ? successColor : alertColor,
                      textAlign: 'center',
                    }}
                  >
                    <span>{copyResultText}</span>
                  </div>
                ) : (
                  <div
                    style={{
                      padding: '0 0 5px',
                      height: '24px',
                    }}
                  >
                    &nbsp;
                  </div>
                )}
                <Button type="button" cta="Copiar link" click={copyToClipboard} template="regular" />
              </div>
              <div>
                <Modal boxStyle={modalContainer} isOpen={cancelModal} setIsOpen={() => setCancelModal(false)}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateRows: '1fr auto',
                      gridRowGap: '20px',
                    }}
                  >
                    <label style={modalLabel}>Deseja realmente cancelar o link ?</label>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gridColumnGap: '20px',
                      }}
                    >
                      <Button type="button" cta="Sim" click={deleteTransaction} template="regular" />
                      <Button type="button" cta="Não" click={() => setCancelModal(false)} template="light" />
                    </div>
                  </div>
                </Modal>
                <Button type="button" cta="Cancelar link" click={() => setCancelModal(true)} template="destructive" />
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default TransactionDetails;
