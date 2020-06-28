import currencyFormat from '@ziro/currency-format';
import { db } from '../../../Firebase/index';
import matchStatusColor from '../matchStatusColor';
import { dateFormat } from '../utils';

const fetch = (transactionId, setTransaction, setError, transaction) => {
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
                            onBehalfOfBrand,
                        } = snapshot.data();
                        const chargeFormatted = currencyFormat(charge);
            const dateFormatted = date ? dateFormat(date) : '';
            const dateLinkCreatedFormatted = dateLinkCreated ? dateFormat(dateLinkCreated) : '';
            const statusColor = matchStatusColor(status);
            paymentDoc.push({
                transactionZoopId: transactionZoopId ? transactionZoopId : '',
                transactionId: snapshot.id,
                charge: chargeFormatted,
                dateLinkCreated: dateLinkCreatedFormatted,
                date: dateFormatted,
                fees: fees ? fees : '',
                installments: installments ? installments : '',
                maxInstallments: maxInstallments ? maxInstallments : '',
                seller: seller === 'Ziro' && onBehalfOfBrand ? `${onBehalfOfBrand} - Ziro` : seller,
                sellerZoopId: sellerZoopId ? sellerZoopId : '',
                status: status ? status : '',
                statusColor: matchStatusColor(status),
                buyerRazao,
                receivables: receivables ? receivables : [],
                receivement,
                brand,
                firstFour,
                lastFour,
                cardholder,
                receiptId,
                onBehalfOfBrand,
            });
                        if (transaction.status !== paymentDoc[0].status) {
                            setTransaction(paymentDoc[0]);
                        }
                    } else {
            setError(true);
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
    if (Object.keys(transaction).length === 0 && transaction.constructor === Object) {
        run();
    }
};

export default fetch;
