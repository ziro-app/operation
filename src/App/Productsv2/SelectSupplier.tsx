import React from 'react'
import { useLocation } from 'wouter'
import Table from '@bit/vitorbarbosa19.ziro.table'
import useSuppliers from './useSuppliers'

const SelectSupplier = () => {
  const [, setLocation] = useLocation()
  const suppliers = useSuppliers()
  const data = suppliers.length > 0 ? suppliers.map(supplier => [supplier.fantasia]) : suppliers
  const dataClicks = suppliers.length > 0 ? suppliers.map(supplier => () => setLocation(`/produtos/${supplier.fantasia}/${supplier.uid}`)) : suppliers
  const dataTable = [
    {
      title: 'Fabricantes',
      header: [],
      rows: data,
      rowsClicks: dataClicks,
      totals: [],
    },
  ]
  return (
    <div>
      {data.length > 2 && (
        <Table
          data={dataTable}
          customGrid={{
            gridTemplateColumns: `1fr`,
            gridRowGap: '15px',
          }}
        />
      )}
    </div>
  )
}

export default SelectSupplier
