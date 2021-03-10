import React, { useEffect, useState } from 'react'

import Table from '@bit/vitorbarbosa19.ziro.table'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import Error from '@bit/vitorbarbosa19.ziro.error'
import fetch from './fetch'
const VisualizationBackgroundCheck = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [suppliers, setSuppliers] = useState([])
  const state = {
    setIsLoading,
    setError,
    setSuppliers,
  }
  useEffect(() => {
    fetch(state)
  }, [])
  const dataTableFormatted = suppliers => [
    {
      title: 'Créditos por fabricante',
      header: ['Fantasia', 'Gratuitos', 'Pagos'],
      rows: suppliers.map(data => [
        <label>{data.fantasia.toUpperCase()}</label>,
        <label>{data.backgroundCheckRequestsAvailable}</label>,
        <label>{data.backgroundCheckRequestsAvailablePaid}</label>,
      ]),
      totals: [],
      align: ['left', 'center', 'center'],
    },
  ]
  if (suppliers.length === 0 || isLoading) return <Spinner />

  return (
      <Table
        data={dataTableFormatted(suppliers)}
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
  )
}
export default VisualizationBackgroundCheck
