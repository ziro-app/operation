import currencyFormat from '@ziro/currency-format';
import { db } from '../../Firebase/index';
import matchStatusColor from './matchStatusColor';
import { dateFormat } from './utils';

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
  if (payments) setIsLoadingMore(true);
  else setIsLoadingMore(false);
  let query = '';
  if (!sellerFilter && !statusFilter) {
    query = db.collection('credit-card-payments').orderBy('dateLinkCreated', 'desc').limit(limitFetch);
  }
  if (sellerFilter && !statusFilter) {
    query = db.collection('credit-card-payments').orderBy('dateLinkCreated', 'desc').where('seller', '==', `${sellerFilter}`).limit(limitFetch);
  }
  if (!sellerFilter && statusFilter) {
    query = db.collection('credit-card-payments').orderBy('dateLinkCreated', 'desc').where('status', '==', `${statusFilter}`).limit(limitFetch);
  }
  if (sellerFilter && statusFilter) {
    query = db
      .collection('credit-card-payments')
      .orderBy('dateLinkCreated', 'desc')
      .where('seller', '==', `${sellerFilter}`)
      .where('status', '==', `${statusFilter}`)
      .limit(limitFetch);
  }
  const run = async () => {
    try {
      await query.onSnapshot(
        async snapshot => {
          let collectionData = '';
          if (!sellerFilter && !statusFilter) {
            collectionData = await db.collection('credit-card-payments').get();
          }
          if (sellerFilter && !statusFilter) {
            collectionData = await db.collection('credit-card-payments').where('seller', '==', `${sellerFilter}`).get();
          }
          if (!sellerFilter && statusFilter) {
            collectionData = await db.collection('credit-card-payments').where('status', '==', `${statusFilter}`).get();
          }
          if (sellerFilter && statusFilter) {
            collectionData = await db
              .collection('credit-card-payments')
              .where('seller', '==', `${sellerFilter}`)
              .where('status', '==', `${statusFilter}`)
              .get();
          }

          setTotalTransactions(collectionData.docs.length);
          if (!collectionData.docs.length) {
            setPayments([]);
            setIsLoadingMore(false);
          }
          const paymentDoc = [];
          if (!snapshot.empty) {
            snapshot.forEach(doc => {
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
              } = doc.data();
              const chargeFormatted = currencyFormat(charge);
              const dateFormatted = date ? dateFormat(date) : '';
              paymentDoc.push({
                  transactionZoopId: transactionZoopId ? transactionZoopId : '',
                  transactionId: doc.id,
                  charge: chargeFormatted,
                  dateLinkCreated,
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
              });
            });
            setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
            setPayments([...paymentDoc]);
              setIsLoadingMore(false);
              setIsLoadingResults(false);
          } else {
          }
          setIsLoading(false);
            setLoadingMore(false);
            setIsLoadingResults(false);
        },
        error => {
          console.log(error);
          setIsLoading(false);
            setLoadingMore(false);
            setIsLoadingResults(false);
        },
      );
    } catch (error) {
      setErrorLoading(true);
      setIsLoading(false);
        setLoadingMore(false);
        setIsLoadingResults(false);
    }
  };
  run();
};

export default fetch;
