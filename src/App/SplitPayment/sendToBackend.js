import { auth, db } from '../../Firebase/index';
import axios, { post } from 'axios';
import md5 from 'md5';
import { formatDateUTC3 } from '@ziro/format-date-utc3';
import { numberFormatter } from '../utils';

const sendToBackend = (
  transactionId,
  transactionZoopId,
  on_behalf_of,
  amount,
  validationMessage,
  setValidationMessage,
  chargeType,
  chargeValue,
  setAmount,
  setChargeTypeInput,
  list,
  setList,
) => () => {
  return new Promise(async (resolve, reject) => {
    try {
      const snapCollection = await db.collection('credit-card-payments').doc(transactionId).get();

      if (snapCollection.data()) {
        try {
          if (validationMessage) {
            throw 'Erro nas informações enviadas, verifique se o valor de cobrança não é maior que o da transação';
          }
          let amountToSend = 0;
          if (chargeType === 'Porcentagem')
            amountToSend = parseFloat(chargeValue.replace('R$', '').replace(',', '').replace('.', '')) * (amount / 100);
          else amountToSend = amount;
          //console.log(amountToSend);
          //return;
          //amountTransaction = amountTransaction.replace('R$', '').replace(',', '').replace('.', '')
          await axios
            .post(
              `${process.env.PAY}/split-rules-create?transaction_id=${transactionZoopId}`,
              {
                transaction_id: transactionZoopId,
                recipient: on_behalf_of,
                amount: amountToSend,
              },
              {
                headers: {
                  Authorization: `Basic ${process.env.PAY_TOKEN}`,
                },
              },
            )
            .then(result => {
              const { data } = result;
              let listToAdd = list;
              listToAdd.push(data);
              setList(listToAdd);
              //console.log(listToAdd);
              //console.log(list);
              const { status } = data;
              /*
              let cityRef = db.collection('cities').doc('DC');

// Set the 'capital' field of the city
let updateSingle = cityRef.update({capital: true});
               */
              if (status === 'succeeded') {
                /*transaction.status = 'Aprovado'
                                                document.location.reload(true);*/
              }
              setAmount('');
              setChargeTypeInput('');
              resolve('Regra criada!');
              // setError(true);
              // setLocation('/recibo');
            });
        } catch (e) {
          // console.log(e.response);
          //setValidationMessage('Um erro ocorreu, entre em contato com o TI!');
          throw { msg: 'Valor das regras ultrapassa o da transação!', customError: true };
        }
      } else {
        throw { msg: 'Pagamento não encontrado', customError: true };
      }
    } catch (error) {
      if (error.customError) reject(error);
      else {
        console.log(error);
        if (error.response) console.log(error.response);
        reject(error);
      }
    }
  });
};

export default sendToBackend;
