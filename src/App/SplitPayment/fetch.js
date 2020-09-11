import currencyFormat from '@ziro/currency-format';
import axios from 'axios';
import { db } from '../../Firebase/index';
import matchStatusColor from '../Transactions/matchStatusColor';
import { dateFormat } from '../Transactions/utils';

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
      })
  } catch (e) {
      console.log(e);
      console.log('erro na requisição para o get de split rules da zoop');
      setIsLoading(false);
  }
}

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
                            datePaid,
                            fees,
              installments,
              dateLinkCreated,
              transactionZoopId,
                            installmentsMax,
              sellerZoopId,
              status,
                            buyerRazao,
                            receivables,
                            receivement,
                            seller,
                            cardBrand,
                            cardFirstFour,
                            cardLastFour,
                            cardholder,
                            receiptId,
                            split_rules,
                        } = snapshot.data()
                        const chargeFormatted = currencyFormat(charge);
                        const dateFormatted = datePaid ? dateFormat(datePaid) : '';

                        /* const dateFormatted = new Date(date.seconds * 1000)
                                                        .toLocaleDateString("pt-br", {
                                                            day: "2-digit",
                                                            month: "2-digit",
                                                            year: "2-digit",
                                                        })
                                                        .replace(" de ", "/"); */
                        const statusColor = matchStatusColor(status);
                        paymentDoc.push({
              transactionZoopId: transactionZoopId || '',
              transactionId: snapshot.id,
              charge: chargeFormatted,
              dateLinkCreated,
                            datePaid: dateFormatted,
              fees: fees || '',
              installments: installments || '',
                            installmentsMax: installmentsMax || '',
              seller: buyerRazao || '-',
              sellerZoopId: sellerZoopId || '',
              status: status || '',
              statusColor: matchStatusColor(status),
                            buyerRazao,
                            receivables: receivables || [],
                            receivement,
                            cardBrand,
                            seller,
                            cardFirstFour,
                            cardLastFour,
                            cardholder,
                            receiptId,
                            split_rules,
                        })
                        if (transaction !== paymentDoc[0]) setTransaction(paymentDoc[0]);
                        setIsLoading(false);
                        // setList(split_rules);
                        // await getSplitRules(transactionZoopId, setTransaction, transaction, setList, setIsLoading);
                    } else {
                        setError(true);
                        // setLastDoc(null);
                        // if (payments) setPayments([]);
                    }
                },
                error => {
                    console.log(error);
                },
            )
        } catch (error) {
            console.log(error);
        }
    }
    run();
}

export default fetch;
