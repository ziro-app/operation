import React, { useState, useEffect, useContext } from 'react';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner';
import Error from '@bit/vitorbarbosa19.ziro.error';
import TransactionsList from './TransactionsList/index';
import TransactionDetails from './TransactionDetails/index';
import ReceivableDetails from './ReceivableDetails/index';
import { spinner } from './styles';
import fetch from './fetch';
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown';
import { userContext } from '../appContext';
import { useQuery } from '../UserCart/SearchCart/useQuery';
import Header from '@bit/vitorbarbosa19.ziro.header';
import { prepareStatusForConsume, prepareStoreownersForConsume, prepareSellersToConsume, prepareCartsForConsume } from '../utils';
import { containerWithPadding } from '@ziro/theme';
import { Menu } from '../Menu/index';

const Transactions = ({ transactionId, receivableId, carts, storeowners, setQueryStr }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [errorLoading, setErrorLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [payments, setPayments] = useState([]);
  const [totalTransactions, setTotalTransactions] = useState(-1);
  const [lastDoc, setLastDoc] = useState(null);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const { listStatusForFilter, listSellersForFilter } = useContext(userContext);
  const useQuerySelector = useQuery();
  const [statusFilter, setStatusFilter] = useState('');
  const [sellerFilter, setSellerFilter] = useState('');
  const [numberOfLoops, setNumberOfLoops] = useState(0);
  const [limitFetch, setLimitFetch] = useState(10);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [storeownerId, setStoreownerId] = useQuerySelector('storeownerId');
  const [seller, setSeller] = useQuerySelector('seller');
  const [status, setStatus] = useQuerySelector('status');
  /*const _carts = useMemo(
        prepareCartsForConsume(carts, seller, storeownerId, status),
        [carts, seller, storeownerId, status]
    );
    const _storeowners = useMemo(
        prepareStoreownersForConsume(_carts.available, storeowners),
        [_carts.available, storeowners]
    );
    const _sellers = useMemo(prepareSellersToConsume(_carts.available), [
        _carts.available,
    ]);
    const _status = useMemo(prepareStatusForConsume(_carts.available), [
        _carts.available,
    ]);

    const [bufferStatus, setBufferStatus] = useState(
        status && _status.convert.ENtoPT[status]
    );
    const [bufferRazao, setBufferRazao] = useState(
        storeownerId && _storeowners.convert.IdToRazao[storeownerId]
    );

    useEffect(() => {
        const conv = _status.convert.PTtoEN[bufferStatus];
        if (conv) setStatus(conv);
    }, [bufferStatus]);

    useEffect(() => {
        setBufferStatus(status && _status.convert.ENtoPT[status]);
    }, [status]);

    useEffect(() => {
        const conv = _storeowners.convert.RazaoToId[bufferRazao];
        if (conv) setStoreownerId(conv);
    }, [bufferRazao]);

    useEffect(() => {
        setBufferRazao(
            storeownerId && _storeowners.convert.IdToRazao[storeownerId]
        );
    }, [storeownerId]);

    useEffect(() => {
        setQueryStr(location.search);
    }, [storeownerId, seller, status]);*/
  const zoopId = '93fb596c44384485b7ece404de0e3584';

  // console.log(payments.length);
  /* useEffect(() => {
        if (!payments.length && totalTransactions) {
            fetch(
                setIsLoading,
                setErrorLoading,
                payments,
                setPayments,
                zoopId,
                10,
                lastDoc,
                setLastDoc,
                setTotalTransactions,
                setLoadingMore,
                setStatusFilter,
                statusFilter,
                setSellerFilter,
                sellerFilter,
                setNumberOfLoops
            );
        }
    }, [statusFilter, sellerFilter, payments]);*/
  useEffect(() => {
    let number = 5;
    //if (statusFilter === "Aguardando Pagamento") number = 3;
    //else number = 3;
    /*if (numberOfLoops === 1 && !statusFilter && !sellerFilter)
            setPayments([]);*/
    //if (!statusFilter && !sellerFilter) setPayments([]);
    if (numberOfLoops < 1 || !payments.length) {
      fetch(
        setIsLoading,
        setErrorLoading,
        payments,
        setPayments,
        zoopId,
        10,
        lastDoc,
        setLastDoc,
        setTotalTransactions,
        setLoadingMore,
        setStatusFilter,
        statusFilter,
        setSellerFilter,
        sellerFilter,
        setNumberOfLoops,
        setIsLoadingResults,
        limitFetch,
        setIsLoadingMore,
      );

      setNumberOfLoops(numberOfLoops + 1);
    }
  }, [statusFilter, sellerFilter, payments, limitFetch]);
  /*useEffect(() => {
        if (!payments) {
            setLoadingMore(true);
            fetch(
                setIsLoading,
                setErrorLoading,
                payments,
                setPayments,
                zoopId,
                10,
                lastDoc,
                setLastDoc,
                setTotalTransactions,
                setLoadingMore,
                setStatusFilter,
                statusFilter,
                setSellerFilter,
                sellerFilter
            );
        }
    }, [payments, lastDoc, statusFilter, setSellerFilter, sellerFilter]);*/

  if (isLoading)
    return (
      <div style={spinner}>
        <Spinner size="5.5rem" />
      </div>
    );

  if (errorLoading) return <Error />;
  if (transactionId && receivableId) return <ReceivableDetails transactions={payments} transactionId={transactionId} receivableId={receivableId} />;
  if (transactionId) return <TransactionDetails transactions={payments} transactionId={transactionId} />;
  const listStatus = listStatusForFilter;
  const listSellers = listSellersForFilter;
  return (
    <div style={containerWithPadding}>
      <Menu title="Transações">
        <div
          style={{
            display: 'grid',
            gridGap: '5px',
            padding: '10px 0px 20px 0px',
            marginBottom: '10px',
          }}
        >
          <Dropdown
            value={sellerFilter || ''}
            list={listSellers}
            placeholder="Filtrar vendedor"
            onChange={({ target: { value } }) => setSellerFilter(value)}
            onChangeKeyboard={e => e && setSellerFilter(e.value)}
          />
          <Dropdown
            value={statusFilter || ''}
            list={listStatus}
            placeholder="Filtrar status"
            onChange={({ target: { value } }) => setStatusFilter(value)}
            onChangeKeyboard={e => e && setStatusFilter(e.value)}
          />
        </div>
        {isLoadingResults ? (
          <div style={spinner}>
            <Spinner size="5.5rem" />
          </div>
        ) : (
          <TransactionsList
            transactions={payments}
            btnMoreClick={() => {
              setIsLoadingMore(true);

              setLimitFetch(limitFetch + 10);
            }}
            hasMore={!(payments.length === totalTransactions)}
            isSearching={isLoadingMore}
            loadingMore={isLoadingMore}
          />
        )}
        {/*isLoadingMore && (
                <div style={spinner}>
                    <Spinner size="5.5rem" />
                </div>
            )*/}
      </Menu>
    </div>
  );
};

export default Transactions;
