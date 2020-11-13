import currencyFormat from '@ziro/currency-format'
import { db } from '../../Firebase/index'
import matchStatusColor from './matchStatusColor'
import { queryGerate, dateFormat } from './utils'

const fetch = (state) => {
    const { setIsLoading, setErrorLoading, payments, setPayments, setLastDoc, setTotalTransactions, setLoadingMore, setIsLoadingResults, limitFetch, setIsLoadingMore } = state
    const storageFilterSeller = localStorage.getItem('sellerFilter')
    const storageFilterStatus = localStorage.getItem('statusFilter')
    if (payments) setIsLoadingMore(true)
    else setIsLoadingMore(false)
    const query = queryGerate(storageFilterSeller, storageFilterStatus, limitFetch)
    const run = async () => {
        try {
            await query.onSnapshot(
                async snapshot => {
                    const storageFilterSeller = localStorage.getItem('sellerFilter')
                    const storageFilterStatus = localStorage.getItem('statusFilter')
                    let collectionData = ''
                    if (!storageFilterSeller && !storageFilterStatus) {
                        collectionData = await db.collection('credit-card-payments').get()
                    }
                    if (storageFilterSeller && !storageFilterStatus) {
                        collectionData = await db.collection('credit-card-payments').where('seller', '==', `${storageFilterSeller}`).get()
                    }
                    if (!storageFilterSeller && storageFilterStatus) {
                        collectionData = await db.collection('credit-card-payments').where('status', '==', `${storageFilterStatus}`).get()
                    }
                    if (storageFilterSeller && storageFilterStatus) {
                        collectionData = await db
                            .collection('credit-card-payments')
                            .where('seller', '==', `${storageFilterSeller}`)
                            .where('status', '==', `${storageFilterStatus}`)
                            .get()
                    }
                    setTotalTransactions(collectionData.docs.length)
                    if (!collectionData.docs.length) {
                        setPayments([])
                        setIsLoadingMore(false)
                    }
                    const paymentDoc = []
                    if (!snapshot.empty) {
                        snapshot.forEach(doc => {
                            const {
                                charge,
                                datePaid,
                                fees,
                                installments,
                                dateLinkCreated,
                                dateLastUpdate,
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
                                insurance,
                            } = doc.data()
                            const chargeFormatted = currencyFormat(charge)
                            const dateFormatted = datePaid ? dateFormat(datePaid) : ''
                            const lastDateFormatted = dateLastUpdate ? dateFormat(dateLastUpdate) : ''
                            paymentDoc.push({
                                transactionZoopId: transactionZoopId || '',
                                transactionId: doc.id,
                                charge: chargeFormatted,
                                dateLinkCreated,
                                dateLastUpdate: lastDateFormatted,
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
                                receivement: receivement || 'Fluxo',
                                cardBrand,
                                cardFirstFour,
                                cardLastFour,
                                cardholder,
                                receiptId,
                                insurance: insurance || false,
                            })
                        })
                        setLastDoc(snapshot.docs[snapshot.docs.length - 1])
                        setPayments([...paymentDoc])
                        setIsLoadingMore(false)
                        setIsLoadingResults(false)
                    }
                    setIsLoading(false)
                    setLoadingMore(false)
                    setIsLoadingResults(false)
                },
                error => {
                    console.log(error)
                    setIsLoading(false)
                    setLoadingMore(false)
                    setIsLoadingResults(false)
                },
            )
        } catch (error) {
            setErrorLoading(true)
            setIsLoading(false)
            setLoadingMore(false)
            setIsLoadingResults(false)
        }
    }
    run()
}

export default fetch
