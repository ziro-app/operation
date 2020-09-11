import React, { useEffect, useRef, useState } from 'react'
import { containerWithPadding, fontTitle } from '@ziro/theme'

import Button from '@bit/vitorbarbosa19.ziro.button'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import Header from '@bit/vitorbarbosa19.ziro.header'
import InputText from '@bit/vitorbarbosa19.ziro.input-text'
import SpinnerWithDiv from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import axios from 'axios'
import currencyFormat from '@ziro/currency-format'
import maskInput from '@ziro/mask-input'
import { motion } from 'framer-motion'
import { db } from '../../Firebase'
import fetch from './fetch'
import sendToBackend from './sendToBackend'

function useIsMountedRef() {
  const isMountedRef = useRef(null)
  useEffect(() => {
    isMountedRef.current = true
    return () => (isMountedRef.current = false)
  })
  return isMountedRef
}

const SplitPayment = ({ transactionId }) => {
  const [transaction, setTransaction] = useState({})
  const [on_behalf_of, setOn_behalf_of] = useState('')
  const [amountTransaction, setAmountTransaction] = useState('')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [errorLoading, setErrorLoading] = useState(false)
  const [suppliers, setSuppliers] = useState([])
  const [chargeTypes, setChargeTypes] = useState([])
  const [chargeTypeInput, setChargeTypeInput] = useState('')
  const [chargeType, setChargeType] = useState('')
  const [charge, setCharge] = useState('')
  const [installmentsMax, setInstallmentsMax] = useState('')
  const [validationMessage, setValidationMessage] = useState('')
  const [cancelModal, setCancelModal] = useState(false)
  const [loadingButton, setLoadingButton] = useState(false)
  const [splitData, setSplitData] = useState('')
  const [list, setList] = useState([])
  const [splitName, setSplitName] = useState('')
  const isMountedRef = useIsMountedRef()

  useEffect(() => {
    if (transaction) {
      if (transaction.split_rules) setList(transaction.split_rules)
      else if (list !== [] && transaction.split_rules === 'undefined') setList([])
    }
  }, [transaction, list])
  const validations = [
    {
      name: 'chargeType',
      validation: value => chargeTypes.includes(value),
      value: chargeTypeInput,
      message: 'Campo obrigatório',
    },
    {
      name: 'charge',
      validation: () => amount !== '',
      value: amount,
      message: 'Campo obrigatório',
    },
    {
      name: 'charge',
      validation: () =>
        chargeType === 'Valor' ? parseFloat(amount) < parseFloat(transaction.charge.replace('R$', '').replace(',', '').replace('.', '')) : true,
      value: amount,
      message: `O valor não pode ser maior que o da transação!`,
    },
    {
      name: 'splitName',
      validation: () => !!splitName,
      value: splitName,
      message: 'Campo obrigatório',
    },
  ]
  useEffect(() => {
    // let mounted = true;
    if (transactionId) {
      fetch(transactionId, setTransaction, setError, transaction, setList, setIsLoading)
    }
  }, [transactionId, isMountedRef])
  useEffect(() => {
    setChargeTypes(['Porcentagem', 'Valor'])
  }, [])
  useEffect(() => {
    setAmount('')
  }, [chargeTypeInput])
  // if (isLoading) return <SpinnerWithDiv size="5rem" />;
  if (errorLoading) return <Error />

  const deleteSplit = async (id, item) => {
    try {
      setLoadingButton(true)
      await axios
        .delete(`${process.env.PAY}/split-rules-delete?transaction_id=${transaction.transactionZoopId}&id=${id}`, {
          headers: {
            Authorization: `Basic ${process.env.PAY_TOKEN}`,
          },
        })
        .then(result => {
          const { data } = result
          const listForRemove = list

          const index = list.indexOf(item)
          listForRemove.splice(index, 1)
          setList(listForRemove)

          const snapRef = db.collection('credit-card-payments').doc(transactionId)
          snapRef.update({ split_rules: list })

          setLoadingButton(false)
          setCancelModal(false)
          // document.location.reload(true);

          // setError(true);
          // setLocation('/recibo');
        })
    } catch (e) {
      setLoadingButton(false)
      // console.log(e.response);
      console.log('erro na requisição para o cancelamento da zoop')
    }
  }
  if (isLoading) return <SpinnerWithDiv size="5rem" />

  return (
    <div style={containerWithPadding}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Header type="icon-link" title="Cobrar via divisão" navigateTo={`transacoes/${transactionId}`} icon="back" />
        <Form
          validations={validations}
          sendToBackend={
            sendToBackend
              ? sendToBackend(
                  transactionId,
                  transaction.transactionZoopId,
                  transaction.sellerZoopId,
                  amount,
                  validationMessage,
                  setValidationMessage,
                  chargeType,
                  transaction.charge,
                  setAmount,
                  setChargeTypeInput,
                  list,
                  setList,
                  splitName,
                  setSplitName,
                )
              : () => null
          }
          inputs={[
            <FormInput
              name="chargeType"
              label="Cobrança em"
              input={
                <Dropdown
                  readOnly
                  value={chargeTypeInput}
                  onChange={({ target: { value } }) => {
                    setChargeTypeInput(value)
                    if (chargeTypeInput === '') {
                      setChargeType('')
                    }
                    const supplier = chargeTypes.filter(supplier => supplier === value)
                    if (typeof supplier[0] !== 'undefined') {
                      setChargeType(value)
                    }
                  }}
                  onChangeKeyboard={element => {
                    if (element) {
                      const {value} = element
                      setChargeTypeInput(value)
                      if (chargeTypeInput === '') {
                        setChargeType('')
                      }
                      const supplier = chargeTypes.filter(supplier => supplier === value)
                      if (typeof supplier[0] !== 'undefined') {
                        setChargeType(value)
                      }
                    }
                  }}
                  list={chargeTypes.sort()}
                  placeholder="Tipo de cobrança"
                />
              }
            />,
            <FormInput
              name="charge"
              label="Valor a cobrar"
              input={
                chargeType === 'Porcentagem' ? (
                  <InputText
                    value={amount ? `% ${currencyFormat(amount).replace(/[R$]/g, '')}` : amount}
                    onChange={({ target: { value } }) => {
                      // const toInteger = parseInt(value);
                      // if (toInteger > 100) setValidationMessage('Valor deve ser menor que o da transação');
                      // else if (toInteger < 0) setValidationMessage('O valor não pode ser menor que o da transação!');
                      // else setValidationMessage('');)
                      const toInteger = parseInt(value.replace(/[\.,\s%]/g, ''), 10)
                      if (toInteger > 10000) return setAmount(10000)

                      return setAmount(maskInput(toInteger, '#####', true))
                    }}
                    placeholder="% 20"
                    inputMode="numeric"
                  />
                ) : (
                  <InputText
                    value={currencyFormat(amount)}
                    onChange={({ target: { value } }) => {
                      const toInteger = parseInt(value.replace(/[R$\.,]/g, ''), 10)
                      const transactionAmount = parseInt(transaction.charge.replace('R$', '').replace(',', '').replace('.', ''))
                      // if (toInteger > transactionAmount) setValidationMessage('Valor deve ser menor que o da transação');
                      // else setValidationMessage('');
                      return setAmount(maskInput(toInteger, '#######', true))
                    }}
                    placeholder="R$1.299,99"
                    inputMode="numeric"
                  />
                )
              }
            />,
            <FormInput
              name="splitName"
              label="Nome da cobrança"
              input={
                <InputText
                  value={splitName}
                  onChange={({ target: { value } }) => {
                    return setSplitName(maskInput(value, '###################', false))
                  }}
                  placeholder="Frete"
                  inputMode="string"
                />
              }
            />,
          ]}
        />
        {transaction.split_rules ? (
          <div style={{ alignItems: 'center' }}>
            <ul>
              {transaction.split_rules.map(item => (
                <li key={item.id}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      paddingBottom: '10px',
                      verticalAlign: 'middle',
                      margin: '5px',
                    }}
                  >
                    <label style={{ fontFamily: fontTitle, width: '500px' }}>
                      {item.splitName} R${item.amount}
                    </label>
                    <Button submitting={loadingButton} type="button" cta="Remover" click={() => deleteSplit(item.id, item)} template="regular" />
                  </div>
                  <hr />
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </motion.div>
    </div>
  )
}

export default SplitPayment
