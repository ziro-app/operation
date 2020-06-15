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
import { fontTitle, containerWithPadding } from '@ziro/theme';
import numeral from 'numeral';
import { modalContainer, modalLabel, spinner } from '../Transactions/TransactionDetails/styles';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner';
import Button from '@bit/vitorbarbosa19.ziro.button';
import Modal from '@bit/vitorbarbosa19.ziro.modal';
import axios from 'axios';

const SplitPayment = ({ transactionId }) => {
  const [on_behalf_of, setOn_behalf_of] = useState('');
  const [amountTransaction, setAmountTransaction] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorLoading, setErrorLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [chargeTypes, setChargeTypes] = useState([]);
  const [chargeTypeInput, setChargeTypeInput] = useState('');
  const [chargeType, setChargeType] = useState('');
  const [charge, setCharge] = useState('');
  const [transaction, setTransaction] = useState({});
  const [maxInstallments, setMaxInstallments] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [cancelModal, setCancelModal] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [splitData, setSplitData] = useState('');
  const [list, setList] = React.useState([]);

  const validations = [
    {
      name: 'chargeType',
      validation: value => chargeTypes.includes(value),
      value: chargeTypeInput,
      message: 'Campo obrigatório',
    },
    {
      name: 'charge',
      validation: () => !!!validationMessage,
      value: charge,
      message: `${validationMessage} Valor este que é de ${transaction.charge}`,
    },
    {
      name: 'charge',
      validation: () => !!amount,
      value: amount,
      message: 'Campo obrigatório',
    },
  ];
  useEffect(() => {
    if (transactionId) {
      fetch(transactionId, setTransaction, setError, transaction, setList,setIsLoading);
    }
  }, [transactionId]);
  useEffect(() => {
    setChargeTypes(['Porcentagem', 'Valor']);
  }, []);
  useEffect(() => {
    setAmount('')
  }, [chargeTypeInput])
  //if (isLoading) return <SpinnerWithDiv size="5rem" />;
  if (errorLoading) return <Error />;

  const deleteSplit = async (id, item) => {
    try {
      setLoadingButton(true);
      await axios
        .delete(`${process.env.PAY}/split-rules-delete?transaction_id=${transaction.transactionZoopId}&id=${id}`, {
          headers: {
            Authorization: `Basic ${process.env.PAY_TOKEN}`,
          },
        })
        .then(result => {
          const { data } = result;
          const listForRemove = list;

          const index = list.indexOf(item);
          console.log(index);
          listForRemove.splice(index, 1);
          setList(listForRemove);
          console.log(listForRemove);
          console.log(list);

          //setList()
          //setSplitData(data);
          //const { status } = data;

          setLoadingButton(false);
          setCancelModal(false);
          //document.location.reload(true);

          // setError(true);
          // setLocation('/recibo');
        });
    } catch (e) {
      setLoadingButton(false);
      // console.log(e.response);
      console.log('erro na requisição para o cancelamento da zoop');
      console.log(e);
    }
  };

  const cancelSplit = async (transaction_id, on_behalf_of, amountBeforeConvert) => {
    try {
      const amount = amountBeforeConvert.replace('R$', '').replace(',', '').replace('.', '');
      setLoadingButton(true);
      await axios
        .get(
          `${process.env.PAY}/split-rules-get?transaction_id=${transaction_id}`,
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
          setSplitData(data);
          //const { status } = data;

          setCancelModal(false);
          //document.location.reload(true);

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
                )
              : () => null
          }
          inputs={[
            <FormInput
              name="chargeType"
              label="Cobrança em"
              input={
                <Dropdown
                  readOnly={true}
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
                    value={amount ? `% ${currencyFormat(amount).replace(/[R$]/g, '')}` : amount}
                    onChange={({ target: { value } }) => {
                      // const toInteger = parseInt(value);
                      // if (toInteger > 100) setValidationMessage('Valor deve ser menor que o da transação');
                      // else if (toInteger < 0) setValidationMessage('O valor não pode ser menor que o da transação!');
                      // else setValidationMessage('');)
                      const toInteger = parseInt(value.replace(/[\.,\s%]/g, ''), 10);
                      if (toInteger > 10000) return setAmount(10000)
                      return setAmount(maskInput(toInteger, '#####', true));
                    }}
                    placeholder="% 20"
                    inputMode='numeric'
                  />
                ) : (
                  <InputText
                    value={currencyFormat(amount)}
                    onChange={({ target: { value } }) => {
                      const toInteger = parseInt(value.replace(/[R$\.,]/g, ''), 10);
                      const transactionAmount = parseInt(transaction.charge.replace('R$', '').replace(',', '').replace('.', ''));
                      if (toInteger > transactionAmount) setValidationMessage('Valor deve ser menor que o da transação');
                      else setValidationMessage('');
                      return setAmount(maskInput(toInteger, '#######', true));
                    }}
                    placeholder="R$1.299,99"
                    inputMode='numeric'
                  />
                )
              }
            />,
          ]}
        />
        {isLoading ? (
          <SpinnerWithDiv size="5rem" />
        ) : (
          <div style={{ alignItems: 'center' }}>
            <ul>
              {list.map(item => (
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
                    <label style={{ fontFamily: fontTitle, width: '500px' }}>Cobrança:R${item.amount}</label>
                    <Button submitting={loadingButton} type="button" cta="Remover" click={() => deleteSplit(item.id, item)} template="regular" />
                  </div>
                  <hr />
                </li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SplitPayment;
