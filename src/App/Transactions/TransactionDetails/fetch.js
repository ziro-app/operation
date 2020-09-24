import currencyFormat from '@ziro/currency-format'
import { dateFormat } from '../utils'
import { db } from '../../../Firebase/index'
import matchStatusColor from '../matchStatusColor'

const fetch = (transactionId, setTransaction, setError, transaction) => {
    const query = db.collection('credit-card-payments').doc(transactionId)
    const run = async () => {
        try {
            await query.onSnapshot(
                async snapshot => {
                    const paymentDoc = []
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
                            onBehalfOfBrand,
                            collaboratorName,
                            observations,
                            insurance,
                            sellerZoopPlan,
                            totalFees
                        } = snapshot.data()
                        const chargeFormatted = currencyFormat(charge)
                        const dateFormatted = datePaid ? dateFormat(datePaid) : ''
                        const dateLinkCreatedFormatted = dateLinkCreated ? dateFormat(dateLinkCreated) : ''
                        const statusColor = matchStatusColor(status)
                        paymentDoc.push({
                            transactionZoopId: transactionZoopId || '',
                            transactionId: snapshot.id,
                            charge: chargeFormatted,
                            dateLinkCreated: dateLinkCreatedFormatted,
                            datePaid: dateFormatted,
                            fees: fees || '',
                            installments: installments || '',
                            installmentsMax: installmentsMax || '',
                            seller: seller === 'Ziro' && onBehalfOfBrand ? `${onBehalfOfBrand} - Ziro` : seller,
                            sellerZoopId: sellerZoopId || '',
                            status: status || '',
                            statusColor: matchStatusColor(status),
                            buyerRazao,
                            receivables: receivables || [],
                            receivement,
                            cardBrand,
                            cardFirstFour,
                            cardLastFour,
                            cardholder,
                            receiptId,
                            onBehalfOfBrand,
                            collaboratorName: collaboratorName || '',
                            observations: observations || '',
                            insurance: insurance || false,
                            sellerZoopPlan: sellerZoopPlan || '',
                            totalFees: totalFees || '-'
                        })
                        if (transaction.status !== paymentDoc[0].status) {
                            setTransaction(paymentDoc[0])
                        }
                    } else {
                        setError(true)
                    }
                },
                error => {
                    console.log(error)
                },
            )
        } catch (error) {
            console.log(error)
        }
    }
    if (Object.keys(transaction).length === 0 && transaction.constructor === Object) {
        run()
    }
}

export default fetch
