import currencyFormat from '@ziro/currency-format'
import { dateFormat } from './utils'
import { db } from '../../Firebase/index'
import matchStatusColor from './matchStatusColor'

const fetch = (
  setIsLoading,
  setErrorLoading,
  payments,
  setPayments,
  zoopId,
  limit,
  lastDoc,
  setLastDoc,
  setTotalTransactions,
  setLoadingMore,
  setStatusFilter,
  statusFilter,
  setSellerFilter,
  sellerFilter,
  setIsLoadingResults,
  limitFetch,
  setIsLoadingMore,
) => {
  if (payments) setIsLoadingMore(true)
  else setIsLoadingMore(false)
  let query = ''
  if (!sellerFilter && !statusFilter) {
    query = db.collection('credit-card-payments').orderBy('dateLastUpdate', 'desc').limit(limitFetch)
  }
  if (sellerFilter && !statusFilter) {
    query = db.collection('credit-card-payments').orderBy('dateLastUpdate', 'desc').where('seller', '==', `${sellerFilter}`).limit(limitFetch)
  }
  if (!sellerFilter && statusFilter) {
    query = db.collection('credit-card-payments').orderBy('dateLastUpdate', 'desc').where('status', '==', `${statusFilter}`).limit(limitFetch)
  }
  if (sellerFilter && statusFilter) {
    query = db
      .collection('credit-card-payments')
      .orderBy('dateLastUpdate', 'desc')
      .where('seller', '==', `${sellerFilter}`)
      .where('status', '==', `${statusFilter}`)
      .limit(limitFetch)
  }
  const run = async () => {
    try {
      await query.onSnapshot(
        async snapshot => {
          let collectionData = ''
          if (!sellerFilter && !statusFilter) {
            collectionData = await db.collection('credit-card-payments').get()
          }
          if (sellerFilter && !statusFilter) {
            collectionData = await db.collection('credit-card-payments').where('seller', '==', `${sellerFilter}`).get()
          }
          if (!sellerFilter && statusFilter) {
            collectionData = await db.collection('credit-card-payments').where('status', '==', `${statusFilter}`).get()
          }
          if (sellerFilter && statusFilter) {
            collectionData = await db
              .collection('credit-card-payments')
              .where('seller', '==', `${sellerFilter}`)
              .where('status', '==', `${statusFilter}`)
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
                receivement,
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
          } else {
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
