import React,{useEffect, useState} from 'react'
import Table from '@bit/vitorbarbosa19.ziro.table'
import { motion } from 'framer-motion'
import { useLocation } from 'wouter'
import Illustration from '@bit/vitorbarbosa19.ziro.illustration'
import Button from '@bit/vitorbarbosa19.ziro.button'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import { getShortDate } from '../utils/functions'
import { illustration, empty } from './styles'

export default ({ dataRows, isLoading }) => {
  const [, setLocation] = useLocation()
  if (isLoading || dataRows.length === 0) return <Spinner />
  const dataTableFormatted = dataRows => [
    {
      title: 'Clientes',
      header: ['Nome', 'Data', ''],
      rows:
        dataRows.map(data => [
          <label>{data.fullName || 'NOME NÃO EXTRAÍDO'}</label>,//aqui é o nome do document, preciso pegar o nome do cliente!
          <label>{getShortDate(new Date(data.added.seconds * 1000))}</label>,
          <label
            style={{ cursor: 'pointer', fontSize: '1.4rem' }}
            onClick={() => {
              setLocation(`/aprovacao-manual/${data.id}`)
            }}
          >
            Ver
          </label>,
        ])
      ,
      totals: [],
      //align: ['left', 'center', 'center']
    },
  ]


  return (
    <div>
      <div aria-label="table" style={{ marginTop: '20px' }}>
        <Table
          data={dataTableFormatted(dataRows)}
          customGrid={{
            gridTemplateColumns: '3fr 1fr auto',
            gridRowGap: '5px',
          }}
          cellStyle={{
            width: '100%',
            height: '100%',
            maxWidth: '300px',
            fontSize: '1.4rem',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textAlign:'center'
          }}
        />
      </div>
    </div>
  )
}
