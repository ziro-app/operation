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
  const storageFilterSeller =  localStorage.getItem('sellerFilter')
  const storageFilterStatus = localStorage.getItem('statusFilter')
  console.log(storageFilterStatus, storageFilterSeller)
  if (payments) setIsLoadingMore(true)
  else setIsLoadingMore(false)
  let query = ''
  if (!storageFilterSeller && !storageFilterStatus) {
    console.log('primeiro')
    query = db.collection('credit-card-payments').orderBy('dateLastUpdate', 'desc').limit(limitFetch)
  }
  if (storageFilterSeller && !storageFilterStatus) {
    console.log('segundo')
    query = db.collection('credit-card-payments').orderBy('dateLastUpdate', 'desc').where('seller', '==', `${storageFilterSeller}`).limit(limitFetch)
  }
  if (!storageFilterSeller && storageFilterStatus) {
    console.log('terceiro')
    query = db.collection('credit-card-payments').orderBy('dateLastUpdate', 'desc').where('status', '==', `${storageFilterStatus}`).limit(limitFetch)
  }
  if (storageFilterSeller && storageFilterStatus) {
    console.log('quarto')
    query = db
      .collection('credit-card-payments')
      .orderBy('dateLastUpdate', 'desc')
      .where('seller', '==', `${storageFilterSeller}`)
      .where('status', '==', `${storageFilterStatus}`)
      .limit(limitFetch)
  }
  const run = async () => {
    try {
      const snapShot = await query.get()
      console.log(snapShot.docs.length)
      await query.onSnapshot(
        async snapshot => {
          const storageFilterSeller =  localStorage.getItem('sellerFilter')
          const storageFilterStatus = localStorage.getItem('statusFilter')
          console.log(storageFilterSeller, storageFilterStatus)
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