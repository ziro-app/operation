import currencyFormat from '@ziro/currency-format';
import { db } from '../../Firebase/index';
import matchStatusColor from '../Transactions/matchStatusColor';
import { dateFormat } from '../Transactions/utils';
import axios from 'axios';
import set from '@babel/runtime/helpers/esm/set';

const getSplitRules = async (transaction_id, setTransaction, transaction, setList, setIsLoading) => {
  try {
    await axios
      .get(`${process.env.PAY}/split-rules-get?transaction_id=${transaction_id}`, {
        headers: {
          Authorization: `Basic ${process.env.PAY_TOKEN}`,
        },
      })
      .then(result => {
        const { data } = result;

        const splitItems = data.items;
        setList(splitItems);
        setIsLoading(false);
      });
  } catch (e) {
    console.log(e);
    console.log('erro na requisição para o get de split rules da zoop');
    setIsLoading(false);
  }
};

const fetch = (transactionId, setTransaction, setError, transaction, setList, setIsLoading) => {
  const query = db.collection('credit-card-payments').doc(transactionId);
  setIsLoading(true);
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
              split_rules,
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
              split_rules,
            });
            setTransaction(paymentDoc[0]);
            setIsLoading(false);
            //setList(split_rules);
            //await getSplitRules(transactionZoopId, setTransaction, transaction, setList, setIsLoading);
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
