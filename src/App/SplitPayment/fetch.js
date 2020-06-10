import currencyFormat from '@ziro/currency-format';
import { db } from '../../Firebase/index';
import matchStatusColor from '../Transactions/matchStatusColor';
import { dateFormat } from '../Transactions/utils';
import axios from 'axios';
import set from '@babel/runtime/helpers/esm/set';

const getSplitRules = async (transaction_id, setTransaction, transaction, setList) => {
  try {
    await axios
      .get(`${process.env.PAY}/split-rules-get?transaction_id=${transaction_id}`, {
        headers: {
          Authorization: `Basic ${process.env.PAY_TOKEN}`,
        },
      })
      .then(result => {
        const { data } = result;
        //console.log(data.items);
        const splitItems = data.items;
        setList(splitItems);
      });
  } catch (e) {
    console.log(e);
    console.log('erro na requisição para o get de split rules da zoop');
  }
};

const fetch = (transactionId, setTransaction, setError, transaction, setList) => {
  const query = db.collection('credit-card-payments').doc(transactionId);
  const run = async () => {
    try {
      await query.onSnapshot(
        async snapshot => {
          const paymentDoc = [];
          if (snapshot.exists) {
            const {
              charge,
              date,
              fees,
              installments,
              dateLinkCreated,
              transactionZoopId,
              maxInstallments,
              sellerZoopId,
              status,
              buyerRazao,
              receivables,
              receivement,
              seller,
              brand,
              firstFour,
              lastFour,
              cardholder,
              receiptId,
            } = snapshot.data();
            const chargeFormatted = currencyFormat(charge);
            const dateFormatted = date ? dateFormat(date) : '';

            /*const dateFormatted = new Date(date.seconds * 1000)
                                            .toLocaleDateString("pt-br", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "2-digit",
                                            })
                                            .replace(" de ", "/");*/
            const statusColor = matchStatusColor(status);
            paymentDoc.push({
              transactionZoopId: transactionZoopId ? transactionZoopId : '',
              transactionId: snapshot.id,
              charge: chargeFormatted,
              dateLinkCreated,
              date: dateFormatted,
              fees: fees ? fees : '',
              installments: installments ? installments : '',
              maxInstallments: maxInstallments ? maxInstallments : '',
              seller: buyerRazao ? buyerRazao : '-',
              sellerZoopId: sellerZoopId ? sellerZoopId : '',
              status: status ? status : '',
              statusColor: matchStatusColor(status),
              buyerRazao,
              receivables: receivables ? receivables : [],
              receivement,
              brand,
              seller,
              firstFour,
              lastFour,
              cardholder,
              receiptId,
            });
            setTransaction(paymentDoc[0]);
            await getSplitRules(transactionZoopId, setTransaction, transaction, setList);
          } else {
            setError(true);
            //setLastDoc(null);
            //if (payments) setPayments([]);
          }
        },
        error => {
          console.log(error);
        },
      );
    } catch (error) {
      console.log(error);
    }
  };
  run();
};

export default fetch;
