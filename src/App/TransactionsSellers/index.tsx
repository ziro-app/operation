// @ts-nocheck
import React, { useContext, useEffect, useState } from 'react'

import Spinner from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import Error from '@bit/vitorbarbosa19.ziro.error'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import { listMonth } from './utils'

import TransactionsList from './components/TransactionsSellersList/index'
import fetch from './fetch';
import { containerClearAll, btnClearAll, textClearAll, container } from './styles'

import { Menu } from '../Menu/index'
import { userContext } from '../appContext'
import TransactionDetails from './components/TransactionsSellersDetails'
import ReceivableSellersDetails from './components/ReceivableSellersDetails'
const TransactionsSellers = ({ transactionId, receivableId }) => {
  const storageFilterStatus = localStorage.getItem('statusFilter')
  const storageFilterSeller = localStorage.getItem('sellerFilter')
  const storageFilterMonth = localStorage.getItem('monthFilter')
  const [isLoading, setIsLoading] = useState(true)
  const [errorLoading, setErrorLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(true)
  const [lastDoc, setLastDoc] = useState(null);
  const [payments, setPayments] = useState([])
  const [isLoadingResults, setIsLoadingResults] = useState(false)
  const [limitFetch, setLimitFetch] = useState(20)
  const [totalTransactions, setTotalTransactions] = useState(-1)
  const [dataInicioFilter, setDataInicioFilter] = useState(new Date(2019, 10, 1))
  const { listStatusForFilter, listSellersForFilter } = useContext(userContext)
  const [statusFilter, setStatusFilter] = useState(storageFilterStatus || '')
  const [sellerFilter, setSellerFilter] = useState(storageFilterSeller || '')
  const [monthFilter, setMonthFilter] = useState(storageFilterMonth || '')
  const [transaction, setTransaction] = useState({});
  const hadleClearAll = () => {
    setIsLoadingResults(true)
    setStatusFilter('')
    setSellerFilter('')
    setMonthFilter('')
    setLimitFetch(20)
    localStorage.removeItem('statusFilter')
    localStorage.removeItem('sellerFilter')
    localStorage.removeItem('monthFilter')
  }
  const state = { statusFilter, sellerFilter, monthFilter, setIsLoading, setErrorLoading, payments, setPayments, setLastDoc, setTotalTransactions, setLoadingMore, setIsLoadingResults, limitFetch, setIsLoadingMore }
  useEffect(() => {
      if (loadingMore || isLoadingResults) {
          fetch(state);
      }
  }, [statusFilter, sellerFilter, monthFilter, payments, limitFetch, isLoadingResults]);

  const listStatus = listStatusForFilter
  const listSellers = listSellersForFilter

  if (transactionId && receivableId)
  return (
      <ReceivableSellersDetails
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
  return (
    <Menu title="Vendas de Créditos">
      <div style={container}>
        <form>
          <label aria-label="filtro por fabricante" />
          <Dropdown
            value={sellerFilter || ''}
            list={listSellers.sort()}
            placeholder="Filtrar fabricante"
            onChange={({ target: { value } }) => {
              if (listSellers.includes(value) || value === '') {
                setIsLoadingResults(true)
                localStorage.setItem('sellerFilter', value)
              }
              setSellerFilter(value)
            }}
            onChangeKeyboard={e => {
              if (e) {
                if (listSellers.includes(e.value) || e.value === '') {
                  setIsLoadingResults(true)
                  localStorage.setItem('sellerFilter', e.value)
                }
                setSellerFilter(e.value)
              }
            }}
          />
        </form>
        <form>
          <label aria-label="filtro por status" />
          <Dropdown
            value={statusFilter || ''}
            list={listStatus}
            placeholder="Filtrar status"
            onChange={({ target: { value } }) => {
              if (listStatus.includes(value) || value === '') {
                setIsLoadingResults(true)
                localStorage.setItem('statusFilter', value)
              }
              setStatusFilter(value)
            }}
            onChangeKeyboard={e => {
              if (e) {
                if (listStatus.includes(e.value) || e.value === '') {
                  setIsLoadingResults(true)
                  localStorage.setItem('statusFilter', e.value)
                }
                setStatusFilter(e.value)
              }
            }}
          />
        </form>
        <form>
          <label aria-label="filtro por mês e ano" />
          <Dropdown
            value={monthFilter || ''}
            list={listMonth(dataInicioFilter)}
            placeholder="Filtrar mês"
            onChange={({ target: { value } }) => {
              if (listMonth(dataInicioFilter).includes(value) || value === '') {
                setIsLoadingResults(true)
                localStorage.setItem('monthFilter', value)
              }
              setMonthFilter(value)
            }}
            onChangeKeyboard={e => {
              if (e) {
                if (listMonth(dataInicioFilter).includes(e.value) || e.value === '') {
                  setIsLoadingResults(true)
                  localStorage.setItem('monthFilter', e.value)
                }
                setMonthFilter(e.value)
              }
            }}
          />
        </form>
        <div style={containerClearAll}>
          <button style={btnClearAll} type="submit" onClick={hadleClearAll}>
            <span style={textClearAll}>Limpar filtros</span>
          </button>
        </div>
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
              insurance,
            }
          })}
          btnMoreClick={() => {
            setLoadingMore(true)
            setLimitFetch(limitFetch + 20)
          }}
          hasMore={!(payments.length === totalTransactions)}
          isSearching={isLoadingMore}
        />
      )}
    </Menu>
  )
}
export default TransactionsSellers
