import React, { useContext, useEffect, useState } from 'react';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner';
import Error from '@bit/vitorbarbosa19.ziro.error';
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown';
import TransactionsList from './TransactionsList/index';
import TransactionDetails from './TransactionDetails/index';
import ReceivableDetails from './ReceivableDetails/index';
import { spinner } from './styles';
import fetch from './fetch';
import { userContext } from '../appContext';
import { useQuery } from '../UserCart/SearchCart/useQuery';
import { Menu } from '../Menu/index';

const Transactions = ({ transactionId, receivableId, carts, storeowners, setQueryStr }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [errorLoading, setErrorLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(true);
    const [payments, setPayments] = useState([]);
    const [totalTransactions, setTotalTransactions] = useState(-1);
    const [lastDoc, setLastDoc] = useState(null);
    const [isLoadingResults, setIsLoadingResults] = useState(false);
    const { listStatusForFilter, listSellersForFilter } = useContext(userContext);
    const useQuerySelector = useQuery();
    const [statusFilter, setStatusFilter] = useState('');
    const [sellerFilter, setSellerFilter] = useState('');
    const [limitFetch, setLimitFetch] = useState(10);
    const [isLoadingMore, setIsLoadingMore] = useState(true);
    const [transaction, setTransaction] = useState({});
    const [buyerStoreownerId, setBuyerStoreownerId] = useQuerySelector('buyerStoreownerId');
    const [seller, setSeller] = useQuerySelector('seller');
    const [status, setStatus] = useQuerySelector('status');
    const zoopId = '93fb596c44384485b7ece404de0e3584';
    useEffect(() => {
        if (loadingMore || isLoadingResults) {
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
                setIsLoadingResults,
                limitFetch,
                setIsLoadingMore,
            );
        }
    }, [statusFilter, sellerFilter, payments, limitFetch]);

    if (isLoading)
        return (
            <div style={spinner}>
                <Spinner size="5.5rem"/>
            </div>
        );
    if (errorLoading) return <Error/>;
    if (transactionId && receivableId)
        return (
            <ReceivableDetails
                transactions={payments}
                transactionId={transactionId}
                receivableId={receivableId}
                transaction={transaction}
                setTransaction={setTransaction}
            />
        );
    if (transactionId)
        return <TransactionDetails transactions={payments} transactionId={transactionId} transaction={transaction}
                                   setTransaction={setTransaction}/>;
    const listStatus = listStatusForFilter;
    const listSellers = listSellersForFilter;
    return (
        <Menu title="Transações">
            <div style={{ display: 'grid', gridGap: '8px', marginBottom: '40px' }}>
                <Dropdown
                    value={sellerFilter || ''}
                    list={listSellers}
                    placeholder="Filtrar fabricante"
                    onChange={({ target: { value } }) => {
                        if (listSellers.includes(value) || value === '') setIsLoadingResults(true);
                        setSellerFilter(value);
                    }}
                    onChangeKeyboard={e => {
                        if (listSellers.includes(e.value) || e.value === '') setIsLoadingResults(true);
                        setSellerFilter(e.value);
                    }}
                />
                <Dropdown
                    value={statusFilter || ''}
                    list={listStatus}
                    placeholder="Filtrar status"
                    onChange={({ target: { value } }) => {
                        if (listStatus.includes(value) || value === '') setIsLoadingResults(true);
                        setStatusFilter(value);
                    }}
                    onChangeKeyboard={e => {
                        if (listStatus.includes(e.value) || e.value === '') setIsLoadingResults(true);
                        setStatusFilter(e.value);
                    }}
                />
            </div>
            {isLoadingResults ? (
                <div style={spinner}>
                    <Spinner size="5.5rem"/>
                </div>
            ) : (
                <TransactionsList
                    transactions={payments.map(payment => {
                        const {dateLastUpdate, date, seller, status, charge, statusColor, transactionId} = payment
                        return {
                            date: dateLastUpdate || date,
                            seller,
                            status,
                            charge,
                            statusColor,
                            transactionId
                        }
                    })}
                    btnMoreClick={() => {
                        setLoadingMore(true);
                        setLimitFetch(limitFetch + 10);
                    }}
                    hasMore={!(payments.length === totalTransactions)}
                    isSearching={isLoadingMore}
                    loadingMore={isLoadingMore}
                />
            )}
        </Menu>
    );
};

export default Transactions;
