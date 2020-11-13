import React, { useContext, useEffect, useState } from 'react';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner-with-div';
import Error from '@bit/vitorbarbosa19.ziro.error';
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown';
import TransactionsList from './TransactionsList/index';
import TransactionDetails from './TransactionDetails/index';
import ReceivableDetails from './ReceivableDetails/index';
import fetch from './fetch';
import { userContext } from '../appContext';
import { Menu } from '../Menu/index';

const Transactions = ({ transactionId, receivableId }) => {
    const storageFilterStatus = localStorage.getItem('statusFilter')
    const storageFilterSeller = localStorage.getItem('sellerFilter')
    const [isLoading, setIsLoading] = useState(true);
    const [errorLoading, setErrorLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(true);
    const [payments, setPayments] = useState([]);
    const [totalTransactions, setTotalTransactions] = useState(-1);
    const [lastDoc, setLastDoc] = useState(null);
    const [isLoadingResults, setIsLoadingResults] = useState(false);
    const { listStatusForFilter, listSellersForFilter } = useContext(userContext);
    const [statusFilter, setStatusFilter] = useState(storageFilterStatus || '');
    const [sellerFilter, setSellerFilter] = useState(storageFilterSeller || '');
    const [limitFetch, setLimitFetch] = useState(10);
    const [isLoadingMore, setIsLoadingMore] = useState(true);
    const [transaction, setTransaction] = useState({});
    const state = {setIsLoading,setErrorLoading,payments,setPayments,setLastDoc,setTotalTransactions,setLoadingMore,setIsLoadingResults,limitFetch,setIsLoadingMore}
    useEffect(() => {
        if (loadingMore || isLoadingResults) {
            fetch(state);
        }
    }, [statusFilter, sellerFilter, payments, limitFetch]);

    if (isLoading) return <Spinner />
    if (errorLoading) return <Error />;
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
            setTransaction={setTransaction} />;
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
                        if (listSellers.includes(value) || value === '') {
                            setIsLoadingResults(true);
                            localStorage.setItem('sellerFilter', value);
                        }
                        setSellerFilter(value);
                    }}
                    onChangeKeyboard={e => {
                        if (listSellers.includes(e.value) || e.value === '') {
                            setIsLoadingResults(true);
                            localStorage.setItem('sellerFilter', e.value);
                        }
                        setSellerFilter(e.value);
                    }}
                />
                <Dropdown
                    value={statusFilter || ''}
                    list={listStatus}
                    placeholder="Filtrar status"
                    onChange={({ target: { value } }) => {
                        if (listStatus.includes(value) || value === '') {
                            setIsLoadingResults(true);
                            localStorage.setItem('statusFilter', value);
                        }
                        setStatusFilter(value);
                    }}
                    onChangeKeyboard={e => {
                        if (listStatus.includes(e.value) || e.value === '') {
                            setIsLoadingResults(true);
                            localStorage.setItem('statusFilter', e.value);
                        }
                        setStatusFilter(e.value);
                    }}
                />
            </div>
            {isLoadingResults ? (
                    <Spinner />
            ) : (
                    <TransactionsList
                        transactions={payments.map(payment => {
                            const { dateLastUpdate, date, seller, status, charge, statusColor, transactionId, insurance } = payment
                            return {
                                date: dateLastUpdate || date,
                                seller,
                                status,
                                charge,
                                statusColor,
                                transactionId,
                                insurance
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
