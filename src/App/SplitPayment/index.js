import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import currencyFormat from '@ziro/currency-format';
import maskInput from '@ziro/mask-input';
import sendToBackend from './sendToBackend';
import capitalize from '@ziro/capitalize';
import Form from '@bit/vitorbarbosa19.ziro.form';
import FormInput from '@bit/vitorbarbosa19.ziro.form-input';
import InputText from '@bit/vitorbarbosa19.ziro.input-text';
import SpinnerWithDiv from '@bit/vitorbarbosa19.ziro.spinner-with-div';
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown';
import { userContext } from '../appContext';
import fetch from './fetch';
import Header from '@bit/vitorbarbosa19.ziro.header';
import { containerWithPadding } from '@ziro/theme';
import numeral from 'numeral';

const SplitPayment = ({ transactionId }) => {
  const [on_behalf_of, setOn_behalf_of] = useState('');
  const [amountTransaction, setAmountTransaction] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorLoading, setErrorLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [chargeTypes, setChargeTypes] = useState([]);
  const [chargeTypeInput, setChargeTypeInput] = useState('');
  const [chargeType, setChargeType] = useState('');
  const [charge, setCharge] = useState('');
  const [transaction, setTransaction] = useState({});
  const [maxInstallments, setMaxInstallments] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const validations = [
    {
      name: 'chargeType',
      validation: value => chargeTypes.includes(value),
      value: chargeTypeInput,
      message: 'Selecione uma das opções de cobrança!',
    },
    {
      name: 'charge',
      validation: () => !!!validationMessage,
      value: charge,
      message: `${validationMessage} Valor este que é de ${transaction.charge}`,
    },
    {
      name: 'charge',
      validation: value => !!value,
      value: charge,
      message: 'Campo obrigatório',
    },
  ];
  useEffect(() => {
    if (transactionId) {
      fetch(transactionId, setTransaction, setError);
    }
  }, [transactionId]);
  useEffect(() => {
    setChargeTypes(['Porcentagem', 'Valor']);
  }, []);

  //if (isLoading) return <SpinnerWithDiv size="5rem" />;
  if (errorLoading) return <Error />;

  return (
    <div style={containerWithPadding}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Header type="icon-link" title="Cobrança na divisão" navigateTo={`transacoes/${transactionId}`} icon="back" />
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
                )
              : () => null
          }
          inputs={[
            <FormInput
              name="chargeType"
              label="Cobrança em"
              input={
                <Dropdown
                  value={chargeTypeInput}
                  onChange={({ target: { value } }) => {
                    setChargeTypeInput(value);
                    if (chargeTypeInput === '') {
                      setChargeType('');
                    }
                    const supplier = chargeTypes.filter(supplier => supplier === value);
                    if (typeof supplier[0] !== 'undefined') {
                      setChargeType(value);
                    }
                  }}
                  onChangeKeyboard={element => {
                    if (element) {
                      const value = element.value;
                      setChargeTypeInput(value);
                      if (chargeTypeInput === '') {
                        setChargeType('');
                      }
                      const supplier = chargeTypes.filter(supplier => supplier === value);
                      if (typeof supplier[0] !== 'undefined') {
                        setChargeType(value);
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
                    value={amount.length === 2 ? `${amount}%` : amount}
                    onChange={({ target: { value } }) => {
                      const toInteger = parseInt(value);
                      //const transactionAmount = parseInt(transaction.charge.replace('R$', '').replace(',', '').replace('.', ''));
                      if (toInteger > 100) setValidationMessage('O valor não pode ser maior que o da transação!');
                      else if (toInteger < 0) setValidationMessage('O valor não pode ser menor que o da transação!');
                      else setValidationMessage('');
                      return setAmount(maskInput(toInteger, '###', true));
                    }}
                    placeholder="20%"
                  />
                ) : (
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
                )
              }
            />,
          ]}
        />
      </motion.div>
    </div>
  );
};

export default SplitPayment;
