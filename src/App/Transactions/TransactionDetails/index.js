/* eslint-disable no-nested-ternary */
/* eslint-disable prefer-const */
/* eslint-disable no-lone-blocks */
import React, { useEffect, useRef, useState } from 'react'
import { alertColor, containerWithPadding, successColor } from '@ziro/theme'

import Button from '@bit/vitorbarbosa19.ziro.button'
import Details from '@bit/vitorbarbosa19.ziro.details'
import Error from '@bit/vitorbarbosa19.ziro.error'
import Header from '@bit/vitorbarbosa19.ziro.header'
import Icon from '@bit/vitorbarbosa19.ziro.icon'
import Illustration from '@bit/vitorbarbosa19.ziro.illustration'
import Modal from '@bit/vitorbarbosa19.ziro.modal'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner'
import Table from '@bit/vitorbarbosa19.ziro.table'
import axios from 'axios'
import currencyFormat from '@ziro/currency-format'
import { motion } from 'framer-motion'
import { useLocation } from 'wouter'
import fetch from './fetch'
import { db, fs } from '../../../Firebase/index'
import { dateFormat, parcelFormat, round, stringToFloat } from '../utils'
import { btn, btnRed, buttonContainer, custom, illustrationContainer, modalContainer, modalLabel, spinner } from './styles'

const TransactionDetails = ({ transactions, transactionId, transaction, setTransaction }) => {
  const [amount, setAmount] = useState('')
  const [receipt_id, setReceipt_id] = useState('')
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState([])
  const [blocks, setBlocks] = useState([])
  const [nothing, setNothing] = useState(false)
  const [, setLocation] = useLocation()
  const [copyResultText, setCopyResultText] = useState('')
  const [copyResultStatus, setCopyResultStatus] = useState(true)
  const [cancelModal, setCancelModal] = useState(false)
  const [captureModal, setCaptureModal] = useState(false)
  const [splitTransactionModal, setSplitTransactionModal] = useState(false)
  const textAreaRef = useRef(null)
  const paymentLink = process.env.HOMOLOG
    ? `http://localhost:8080/pagamento/${transactionId}/escolher-cartao?doc`
    : `https://ziro.app/pagamento/${transactionId}/escolher-cartao?doc`
  const [blocksStoreowner, setBlocksStoreowner] = useState([])
  const [validationMessage, setValidationMessage] = useState('')
  const [loadingButton, setLoadingButton] = useState(false)
  const [olderTransaction, setOlderTransaction] = useState(false)
  const [remakeBlockTransaction, setRemakeBlockTransaction] = useState(false)
  async function getTransaction(transactionId, setTransaction, setError, transaction) {
    await fetch(transactionId, setTransaction, setError, transaction)
    if (Object.prototype.hasOwnProperty.call(transaction, 'sellerZoopPlan')) {
      if (transaction.sellerZoopPlan === '' || (transaction.sellerZoopPlan.markup.percentage === 0 && transaction.sellerZoopPlan.markup.amount === 0))
        setOlderTransaction(true)
      else setOlderTransaction(false)
    } else setOlderTransaction(false)
  }
  useEffect(() => {
    setTransaction({})
  }, [])
  useEffect(() => {
    setValidationMessage('')
  }, [splitTransactionModal, captureModal, cancelModal])
  const nowDate = fs.FieldValue.serverTimestamp()
  const postCapture = async (transaction_id, on_behalf_of, amount) => {
    try {
      const snapRef = db.collection('credit-card-payments').doc(transactionId)
      setLoadingButton(true)
      amount = amount.replace('R$', '').replace(',', '').replace('.', '')
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
        .then(() => {
          setLoadingButton(false)
          setCaptureModal(false)
          snapRef.update({ status: 'Atualizando', dateLastUpdate: nowDate })
        })
      setCancelModal(false)
    } catch (e) {
      setLoadingButton(false)
      setValidationMessage('Ocorreu um erro, contate suporte')
      console.log('erro na requisição para a captação da zoop')
      console.log(e.response.status)
    }
  }

  const cancelTransaction = async (transaction_id, on_behalf_of, amountBeforeConvert) => {
    try {
      const snapRef = db.collection('credit-card-payments').doc(transactionId)
      const amount = amountBeforeConvert.replace('R$', '').replace(',', '').replace('.', '')
      setLoadingButton(true)
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
          setLoadingButton(false)
          const { data } = result
          const { status } = data
          setCancelModal(false)
          if (status === 'succeeded') {
            transaction.status = 'Cancelado'
          }
          snapRef.update({ status: 'Atualizando', dateLastUpdate: nowDate })
        })
    } catch (e) {
      setLoadingButton(false)
      console.log('erro na requisição para o cancelamento da zoop')
      console.log(e.response.status)
      if (e.response.status === 402) {
        setValidationMessage('A transação já foi cancelada!')
      } else setValidationMessage('Ocorreu um erro, contate suporte')
    }
  }

  const deleteTransaction = async () => {
    setIsLoading(true)
    try {
      await db.collection('credit-card-payments').doc(transactionId).delete()
      setLocation('/transacoes')
      window.location.reload()
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      if (error.response) console.log(error.response)
      setCopyResultStatus(false)
      setCopyResultText('Erro ao excluir transação!')
      setIsLoading(false)
    }
  }

  const copyToClipboard = e => {
    e.preventDefault()
    if (document.queryCommandSupported('copy')) {
      try {
        textAreaRef.current.select()
        document.execCommand('copy')
        setCopyResultStatus(true)
        setCopyResultText('Copiado !')
        setTimeout(() => {
          setCopyResultText('')
        }, 2500)
      } catch (error) {
        console.log(error)
        setCopyResultStatus(false)
        setCopyResultText('Erro ao copiar.')
        setTimeout(() => {
          setCopyResultText('')
        }, 2500)
      }
    } else {
      setCopyResultStatus(false)
      setCopyResultText('Sem suporte para cópia.')
      setTimeout(() => {
        setCopyResultText('')
      }, 2500)
    }
  }

  function handleInsurance(transaction) {
    if (transaction.insurance === true && transaction.sellerZoopPlan) {
      if (transaction.sellerZoopPlan.antiFraud.receivable_amount)
        return `- ${parseFloat(transaction.sellerZoopPlan.antiFraud.receivable_amount)
          .toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
          .replace(/\s/g, '')}`
      return '-'
    }
  }
  function handleMarkup(transaction) {
    return `- ${parseFloat(transaction.sellerZoopPlan.markup.receivable_amount).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}`
  }

  useEffect(() => {
    getTransaction(transactionId, setTransaction, setError, transaction)
    if (Object.prototype.hasOwnProperty.call(transaction, 'dateLinkCreated')) {
      if (error) {
        setNothing(true)
      }
      {
        if (transaction !== {} && !nothing) {
          let block
          let dataTable
          let feesFormatted =
            transaction.status !== 'Cancelado' && transaction.fees
              ? ` ${
                  transaction.sellerZoopPlan && (transaction.sellerZoopPlan.markup.amount || transaction.sellerZoopPlan.markup.percentage)
                    ? '- '.concat(
                        parseFloat(parseFloat(transaction.sellerZoopPlan.markup.receivable_gross_amount) + parseFloat(transaction.fees))
                          .toLocaleString('pt-br', {
                            style: 'currency',
                            currency: 'BRL',
                          })
                          .replace(/\s/g, ''),
                      )
                    : '- '.concat(
                        parseFloat(transaction.fees)
                          .toLocaleString('pt-br', {
                            style: 'currency',
                            currency: 'BRL',
                          })
                          .replace(/\s/g, ''),
                      )
                }`
              : '-'
          let insuranceValueFormatted =
            transaction.status !== 'Cancelado' &&
            transaction.insurance === true &&
            Object.prototype.hasOwnProperty.call(transaction, 'receivables') &&
            Object.prototype.hasOwnProperty.call(transaction, 'sellerZoopPlan') &&
            Object.prototype.hasOwnProperty.call(transaction.sellerZoopPlan, 'antiFraud') &&
            feesFormatted !== '-' &&
            (transaction.sellerZoopPlan.antiFraud.amount || transaction.sellerZoopPlan.antiFraud.percentage)
              ? handleInsurance(transaction)
              : '- R$0,00'
          let markupValueFormatted =
            Object.prototype.hasOwnProperty.call(transaction, 'receivables') &&
            feesFormatted !== '-' &&
            transaction.sellerZoopPlan &&
            (transaction.sellerZoopPlan.markup.amount || transaction.sellerZoopPlan.markup.percentage)
              ? handleMarkup(transaction)
              : '-'
          let sumOfFees = 0
          if (
            transaction.status !== 'Cancelado' &&
            transaction.status !== 'Pré Autorizado' &&
            transaction.status !== 'Atualizando' &&
            transaction.status !== 'Aguardando Pagamento'
          ) {
            sumOfFees = transaction.fee_details.reduce(function (sum, item) {
              return (sum += parseFloat(item.amount))
            }, 0)
          }
          let liquidFormatted =
            transaction.status !== 'Cancelado' &&
            transaction.status !== 'Pré Autorizado' &&
            transaction.status !== 'Atualizando' &&
            transaction.totalFees !== '-'
              ? parseFloat(`${stringToFloat(transaction.charge) - parseFloat(transaction.totalFees)}`)
                  .toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
                  .replace(/\s/g, '')
              : transaction.fees
              ? currencyFormat(parseFloat(`${(stringToFloat(transaction.charge) - sumOfFees).toFixed(2)}`.replace(/[R$\.,]/g, '')))
              : '-'

          block = [
            {
              header: 'Venda',
              body: [
                {
                  title: 'Lojista',
                  content: transaction.buyerRazao ? transaction.buyerRazao : '-',
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
                  title: 'Tarifa Ziro Seguro Antifraude',
                  content: insuranceValueFormatted,
                },
                {
                  title: 'Valor líquido',
                  content: transaction.status !== 'Cancelado' ? liquidFormatted : '-',
                },
                {
                  title: 'Parcela máxima',
                  content: `${transaction.installmentsMax}`.startsWith('0')
                    ? `${parseInt(transaction.installmentsMax)}x`
                    : `${transaction.installmentsMax}x`,
                },
                {
                  title: 'Parcela escolhida',
                  content: transaction.installments ? `${transaction.installments}x` : '-',
                },
                {
                  title: 'Data de pagamento',
                  content: transaction.datePaid ? `${transaction.datePaid}` : '-',
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
          ]
          if (transaction.collaboratorName) {
            block[0].body.splice(8, 0, {
              title: 'Link criado por',
              content: transaction.collaboratorName,
            })
          }
          if (transaction.observations) {
            block[0].body.splice(transaction.collaboratorName ? 9 : 8, 0, {
              title: 'Observações',
              content: transaction.observations,
            })
          }

          if (typeof transaction.receivables !== 'undefined' && transaction.receivables.length) {
            const sortedTransactions = transaction.receivables.sort((a, b) => b.installment - a.installment).filter(item => item.split_rule === null)
            const sortedSplitAmount = Object.prototype.hasOwnProperty.call(transaction.receivables[0], 'split_rule')
              ? transaction.receivables
                  .sort((a, b) => b.installment - a.installment)
                  .filter(item => item.split_rule !== null)
                  .reverse()
              : transaction.receivables.sort((a, b) => b.installment - a.installment).reverse()
            const paidRows = []
            const paidClicks = []
            let paidAmount = 0
            let paidAmountWithoutFees = 0
            const unpaidRows = []
            const unpaidClicks = []
            let unpaidAmount = 0
            let unpaidAmountWithoutFees = 0
            sortedTransactions.map(transaction => {
              const sumSplit =
                sortedSplitAmount.length > 0
                  ? sortedSplitAmount
                      .filter(item => item.installment === transaction.installment)
                      .reduce((acc, val) => {
                        return parseFloat(acc) + parseFloat(val.gross_amount)
                      }, 0)
                  : 0
              if (!transaction.paid_at) {
                let upAm = round(parseFloat(transaction.gross_amount) + (sortedSplitAmount.length > 0 ? sumSplit : 0), 2)
                let upAmw = round(parseFloat(transaction.amount), 2)
                unpaidRows.push([
                  `${transaction.installment}`,
                  `${parcelFormat(upAm)}`,
                  `${parcelFormat(upAmw)}`,
                  `${dateFormat(transaction.expected_on)}`,
                  <Icon type="chevronRight" size={14} />,
                ])

                unpaidClicks.push(() => setLocation(`/transacoes/${transactionId}/${transaction.receivableZoopId}`))
                unpaidAmount += parseFloat(upAm)
                unpaidAmountWithoutFees += parseFloat(upAmw)
              } else {
                let upAm = round(parseFloat(transaction.gross_amount), 2)
                let upAmw = round(parseFloat(transaction.amount), 2)
                paidRows.push([
                  `${transaction.installment}`,
                  `${parcelFormat(upAm)}`,
                  `${parcelFormat(upAmw)}`,
                  `${dateFormat(transaction.paid_at)}`,
                  <Icon type="chevronRight" size={14} />,
                ])
                paidClicks.push(() => setLocation(`/transacoes/${transactionId}/${transaction.receivableZoopId}`))
                paidAmount += parseFloat(upAm)
                paidAmountWithoutFees += parseFloat(upAmw)
              }
            })
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
            ]
          }
          if (transaction.onBehalfOfBrand && transaction.seller.includes('Ziro')) {
            block[0].body.splice(1, 0, {
              title: 'Marca',
              content: transaction.onBehalfOfBrand,
            })
          } else
            block[0].body.splice(1, 0, {
              title: 'Marca',
              content: transaction.seller,
            })

          setBlocks(block)
          setData(dataTable || [])

          {
            let blockStoreowner
            if (transaction.status === 'Aprovada' || transaction.status === 'Pré Autorizado' || transaction.status === 'Cancelado') {
              const installmentsNumber = parseInt(transaction.installments)
              if (transaction.installments > 0) {
                blockStoreowner = [
                  {
                    header: 'Cartão',
                    body: [
                      {
                        title: 'Bandeira',
                        content: transaction.cardBrand ? transaction.cardBrand : '-',
                      },
                      {
                        title: 'Número',
                        content: transaction.cardFirstFour ? `${transaction.cardFirstFour}...${transaction.cardLastFour}` : '-',
                      },
                      {
                        title: 'Portador',
                        content: transaction.cardholder ? transaction.cardholder.toUpperCase() : '-',
                      },
                    ],
                  },
                ]
              }
            } else {
              blockStoreowner = [
                {
                  header: 'Cartão',
                  body: [
                    {
                      title: 'Bandeira',
                      content: transaction.cardBrand ? transaction.cardBrand : '-',
                    },
                    {
                      title: 'Número',
                      content: transaction.cardFirstFour ? `${transaction.cardFirstFour}...${transaction.cardLastFour}` : '-',
                    },
                    {
                      title: 'Portador',
                      content: transaction.cardholder ? transaction.cardholder.toUpperCase() : '-',
                    },
                  ],
                },
              ]
            }
            setBlocksStoreowner(blockStoreowner)
          }
        }
      }
    }
  }, [transaction, nothing])
  if (isLoading)
    return (
      <div style={spinner}>
        <Spinner size="5.5rem" />
      </div>
    )
  if (nothing)
    return (
      <Error
        message="Transação inválida ou não encontrada, retorne e tente novamente."
        type="noData"
        title="Erro ao buscar detalhes da transação"
        backRoute="/transacoes"
        backRouteFunction={route => {
          setNothing(false)
          setLocation(route)
        }}
      />
    )
  const isApproved = transaction.status === 'Aprovado' || transaction.status === 'Pago' || transaction.status === 'Pré Autorizado'
  const isCanceled = transaction.status === 'Cancelado' || transaction.status === 'Falhado'
  const isWaiting = transaction.status === 'Aguardando Pagamento' || transaction.status === 'Aprovação Pendente'
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={containerWithPadding}>
      <input type="text" style={{ position: 'absolute', left: '-9999px' }} value={paymentLink} ref={textAreaRef} readOnly />
      <Header type="icon-link" title="Detalhes da venda" navigateTo="transacoes" icon="back" />
      <div style={{ display: 'grid', gridRowGap: '20px' }}>
        {transaction.status === 'Pré Autorizado' && (
          <div style={{ ...buttonContainer, marginBottom: '-5px' }}>
            <Modal boxStyle={modalContainer} isOpen={captureModal} setIsOpen={() => setCaptureModal(false)}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateRows: '1fr auto',
                  gridRowGap: '20px',
                }}
              >
                <label style={modalLabel}>Confirma captura?</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap: '20px', gridRowGap: '10px' }}>
                  {loadingButton ? (
                    <div style={spinner}>
                      <Spinner size="3.5rem" />
                    </div>
                  ) : (
                    <Button
                      type="button"
                      cta="Sim"
                      click={() => postCapture(transaction.transactionZoopId, transaction.sellerZoopId, transaction.charge)}
                      template="regular"
                    />
                  )}
                  <Button type="button" cta="Não" click={() => setCaptureModal(false)} template="light" />
                </div>
                {validationMessage && <label style={{ color: alertColor }}>{validationMessage}</label>}
              </div>
            </Modal>
            <Button style={btn} type="button" cta="Capturar transação" click={() => setCaptureModal(true)} template="regular" />
          </div>
        )}
        {isApproved && (
          <>
            <Modal boxStyle={modalContainer} isOpen={cancelModal} setIsOpen={() => setCancelModal(false)}>
              <div style={{ display: 'grid', gridTemplateRows: '1fr auto', gridRowGap: '20px' }}>
                <label style={modalLabel}>Confirma cancelamento?</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap: '20px' }}>
                  {loadingButton ? (
                    <div style={spinner}>
                      <Spinner size="3.5rem" />
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
            <div style={buttonContainer}>
              <Button
                style={btn}
                type="button"
                cta="Efetuar divisão"
                click={() => setLocation(`/transacoes/${transactionId}/split`)}
                template="regular"
              />
              <Button style={btnRed} type="button" cta="Cancelar transação" click={() => setCancelModal(true)} template="destructive" />
            </div>
          </>
        )}
        {isWaiting && (
          <div style={{ ...buttonContainer, marginTop: '-25px' }}>
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
                <div style={{ padding: '0 0 5px', height: '24px' }}>&nbsp;</div>
              )}
              <Button style={btn} type="button" cta="Copiar link" click={copyToClipboard} template="regular" />
            </div>
            <div>
              <Modal boxStyle={modalContainer} isOpen={cancelModal} setIsOpen={() => setCancelModal(false)}>
                <div style={{ display: 'grid', gridTemplateRows: '1fr auto', gridRowGap: '20px' }}>
                  <label style={modalLabel}>Deseja realmente cancelar o link ?</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap: '20px' }}>
                    <Button type="button" cta="Sim" click={deleteTransaction} template="regular" />
                    <Button type="button" cta="Não" click={() => setCancelModal(false)} template="light" />
                  </div>
                </div>
              </Modal>
              <Button style={btnRed} type="button" cta="Cancelar link" click={() => setCancelModal(true)} template="destructive" />
            </div>
          </div>
        )}
        <Details blocks={blocksStoreowner} />
        <Details blocks={blocks} />
        {isApproved && (
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
        {isCanceled && (
          <div style={illustrationContainer}>
            <div style={{ display: 'grid', justifyItems: 'center' }}>
              <Illustration type="paymentError" size={175} />
              <span style={custom(15, transaction.statusColor)}>Pagamento cancelado.</span>
            </div>
          </div>
        )}
        {isWaiting && (
          <div style={illustrationContainer}>
            <div style={{ display: 'grid', justifyItems: 'center' }}>
              <Illustration type="waiting" size={200} />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default TransactionDetails
