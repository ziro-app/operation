import currencyFormat from '@ziro/currency-format';
import { db } from '../../../Firebase/index';
import matchStatusColor from '../matchStatusColor';
import { dateFormat } from '../utils';

const fetch = (transactionId, setTransaction, setError) => {
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
