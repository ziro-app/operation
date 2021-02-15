import React, { useEffect, useContext } from 'react'
import Table from '@bit/vitorbarbosa19.ziro.table'
import { useLocation } from 'wouter'
import useLoadConciliation from '../../hooks/useLoadConciliation'
import usePinScroll from '../../hooks/usePinScroll'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import { getShortDate, translateStatus } from '../../utils/functions'
import Button from '@bit/vitorbarbosa19.ziro.button';
import Empty from '../Empty';
import { userContext } from '../../../appContext'

interface TableConciliationProps {
  count?: number;
  height?: number | string;
  width?: number | string;
  circle?: boolean;
}

const TableConciliation: React.FC<TableConciliationProps> = ({ ...props }) => {
  const {device} = useContext(userContext)
  const { dataRows, removeRow, isLoading, isError, hasMore, loadingMore, handleClick } = useLoadConciliation()
  const dataTableFormatted = dataRows => [
    {
      title: 'Pagamentos',
      header: ['Razão', 'Data', 'Status', 'Conciliado'],
      rows: dataRows.map(data => [
        <label>{data.buyerRazao ? String(data.buyerRazao).toUpperCase() : 'NÃO EXISTE NO FIREBASE'}</label>,
        <label>{getShortDate(new Date(data.created_at))}</label>,
        <label>{translateStatus(data.status).toUpperCase()}</label>,
        <label>{data.existFirebase ? 'Sim' : 'Não'}</label>,
      ]),
      totals: [],
      align: ['left', 'center', 'center','center'],
    },
  ]
  if (isLoading && dataRows.length === 0) return <Spinner />
  if (!isLoading && dataRows.length === 0){return <Empty />;}
  return (
    <div>
      <div aria-label="table" style={{ marginTop: '20px' }}>
        <Table
          data={dataTableFormatted(dataRows)}
          customGrid={{
            gridTemplateColumns: device === 'smallMobile' ? '1fr auto 50px auto' : '1fr auto auto auto',
            gridRowGap: '5px',
            gridColumnGap: '5px',
          }}
          cellStyle={{
            width: '100%',
            height: '100%',
            fontSize: '1.4rem',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        />
      </div>
      <div aria-label="table" style={{ marginTop: '20px' }}>
      {hasMore && <Button submitting={loadingMore} cta="Carregar mais" click={handleClick} type="button" />}
      {loadingMore && <Spinner size="4rem" />}
    </div>
    </div>
  )
}

export default TableConciliation
