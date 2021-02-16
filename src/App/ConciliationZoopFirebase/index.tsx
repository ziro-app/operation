import React,{useEffect, useState} from 'react'
import { useRoute } from 'wouter'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import Error from '@bit/vitorbarbosa19.ziro.error'
import Illustration from '@bit/vitorbarbosa19.ziro.illustration'
import Details from './components/Details';
import TableListConciliation from './components/TableConciliation/TableListConciliation';
import Empty from './components/Empty'
import useLoadConciliation from './hooks/useLoadConciliation'

const TableConciliation = ({transactionId}) => {
    const { dataRows, removeRow, isLoading, isError, hasMore, loadingMore, handleClick } = useLoadConciliation()
    /*console.log('dataRows',dataRows)
    console.log('hasMore',hasMore)
    console.log('isLoading',isLoading)
    console.log('loadingMore',loadingMore)
    console.log('transactionId',transactionId)*/
    if (isLoading && dataRows.length === 0) return <Spinner />
    if (!isLoading && !loadingMore && dataRows.length === 0) {
      return <Empty />
    }
    //console.log(dataRows)
    if(transactionId){
        return <Details dataRows={dataRows} transactionId={transactionId} />
    }
    else{
        return <TableListConciliation dataRows={dataRows} loadingMore={loadingMore} hasMore={hasMore} handleClick={handleClick} />
    }

}

export default TableConciliation
