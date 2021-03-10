import currencyFormat from '@ziro/currency-format'
import matchStatusColor from './matchStatusColor'
import { getFilterQuery, dateFormat } from './utils'

// TODO -> Formulate a way where the snapshot is cleaned and mounted a new one
// with each new request / filter change
const fetch = (state) => {
    const { setIsLoading, setErrorLoading, payments, setPayments, setLastDoc, setTotalTransactions, setLoadingMore, setIsLoadingResults, limitFetch, setIsLoadingMore } = state
    const storageFilterSeller = localStorage.getItem('sellerFilter')
    const storageFilterStatus = localStorage.getItem('statusFilter')
    const storageFilterMonth = localStorage.getItem('monthFilter')
    if (payments) setIsLoadingMore(true)
    else setIsLoadingMore(false)
    const query = getFilterQuery({ storageFilterSeller, storageFilterStatus, storageFilterMonth, limit: null })
    console.log('query outside:', query)
    const run = async () => {
        try {
            await query.onSnapshot(
                async snapshot => {
                    console.log('snapshot:', snapshot)
                    const storageFilterSeller = localStorage.getItem('sellerFilter')
                    const storageFilterStatus = localStorage.getItem('statusFilter')
                    const storageFilterMonth = localStorage.getItem('monthFilter')
                    const query = getFilterQuery({ storageFilterSeller, storageFilterStatus, storageFilterMonth, limit: limitFetch })
                    console.log('query inside:', query)
                    const collectionData = await query.get()
                    setTotalTransactions(snapshot.size)
                    if (!collectionData.docs.length) {
                        console.log('collection data with nothing')
                        setPayments([])
                        setIsLoadingMore(false)
                    }
                    const paymentDoc = []
                    collectionData.forEach(doc => {
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
                            buyerFantasy,
                            quantity,
                            cardBrand,
                            cardFirstFour,
                            cardLastFour,
                            cardholder,
                            sales_receipt:receiptId,
                            buyerReason,
                            buyerZoopId,
                            insurance,
                        } = doc.data()
                        const chargeFormatted = charge.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});//currencyFormat(charge)
                        const dateFormatted = datePaid ? dateFormat(datePaid) : ''
                        const lastDateFormatted = dateLastUpdate ? dateFormat(dateLastUpdate) : ''
                        paymentDoc.push({
                            transactionZoopId: transactionZoopId || '',
                            transactionId: doc.id,
                            charge: chargeFormatted,
                            dateLinkCreated,
                            dateLastUpdate: lastDateFormatted,
                            datePaid: dateFormatted,
                            date:dateFormatted,
                            fees: fees || '',
                            installments: installments || '',
                            installmentsMax: installmentsMax || '',
                            buyerFantasy,
                            quantity,
                            seller: buyerFantasy || '',
                            sellerZoopId: buyerZoopId || '',
                            status: status || '',
                            statusColor: matchStatusColor(status),
                            buyerRazao,
                            receivables: receivables || [],
                            cardBrand,
                            cardFirstFour,
                            cardLastFour,
                            cardholder,
                            receiptId,
                            insurance: insurance || false,
                        })
                    })
                    setLastDoc(collectionData.docs[collectionData.docs.length - 1])
                    setPayments([...paymentDoc])
                    setIsLoadingMore(false)
                    setIsLoadingResults(false)
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
