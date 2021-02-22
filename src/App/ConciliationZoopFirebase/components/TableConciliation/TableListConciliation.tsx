import React, { useEffect, useContext } from 'react'
import Table from '@bit/vitorbarbosa19.ziro.table'
import { useLocation } from 'wouter'
import {linesTable} from './styles'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import { getShortDate, translateStatus } from '../../utils/functions'
import Button from '@bit/vitorbarbosa19.ziro.button'
import Empty from '../Empty'
import { userContext } from '../../../appContext'

interface TableListConciliation {
  dataRows: Array<Object>
  loadingMore: Boolean
  hasMore: Boolean
  handleClick : Function
}
const TableListConciliation: React.FC<TableListConciliation> = ({ dataRows,loadingMore,hasMore,handleClick }) => {
  const { device } = useContext(userContext)
  const [_, setLocation] = useLocation()
  const dataTableFormatted = dataRows => [
    {
      title: 'Transações Zoop',
      header: ['Data', 'Status', 'Conciliado'],
      rows: dataRows.map(data => [
        <label style={linesTable} onClick={() => {
            loadingMore ? null : setLocation(`/conciliacao/${data.id}`)
          }}>{getShortDate(new Date(data.created_at))}</label>,
        <label style={linesTable} onClick={() => {
            loadingMore ? null : setLocation(`/conciliacao/${data.id}`)
          }}>{translateStatus(data.status).toUpperCase()}</label>,
        <label style={linesTable} onClick={() => {
            loadingMore ? null : setLocation(`/conciliacao/${data.id}`)
        }}>{data.existFirebase ? 'Sim' : 'Não'}</label>,
      ]),
      totals: [],
      align: ['center', 'center', 'center'],
    },
  ]
  return (
    <div>
      <div aria-label="table" style={{ marginTop: '20px' }}>
        <Table
          data={dataTableFormatted(dataRows)}
          customGrid={{
            gridTemplateColumns: 'auto auto auto',
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

export default TableListConciliation
