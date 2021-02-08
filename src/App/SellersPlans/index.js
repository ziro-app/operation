import React, { useEffect, useState } from 'react'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import Error from '@bit/vitorbarbosa19.ziro.error'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import Table from '@bit/vitorbarbosa19.ziro.table'
import { useLocation } from 'wouter'
import fetch from './fetch'
import Details from '@bit/vitorbarbosa19.ziro.details'

const SellersPlans = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [errorLoading, setErrorLoading] = useState(false)
  const [data, setData] = useState([])
  const [dataDetails, setDataDetails] = useState([])
  const [, setLocation] = useLocation()
  const state = {
    setIsLoading,
    setErrorLoading,
    setData,
    setLocation,
  }
  useEffect(() => {
    localStorage.removeItem('voltar')
    fetch(state)
  }, [isLoading])
  useEffect(() => {
    if (data.length > 0)
      setDataDetails([
        {
          header: 'Totais',
          body: [
            {
              title: 'Fabricantes na base',
              content: [data[0].rows.length || '-'],
            },
            {
              title: 'Plano Fluxo',
              content: [data[0].rows.filter(item => item[1] === 'fluxo').length || '-'],
            },
            {
              title: 'Plano D+30',
              content: [data[0].rows.filter(item => item[1] === 'd+30').length || '-'],
            },
            {
              title: 'Plano D+14',
              content: [data[0].rows.filter(item => item[1] === 'd+14').length || '-'],
            },
          ],
        },
      ])
  }, [data])

  if (isLoading) return <Spinner />
  if (errorLoading) return <Error />
  console.log(data[0])
  return (
    <>
      <Details blocks={dataDetails} blockGap={'20px'} />
      <div style={{ marginTop: '20px' }}>
        <Table
          data={data}
          customGrid={{
            gridTemplateColumns: '1fr 1fr 50px',
            gridRowGap: '5px',
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
    </>
  )
}

export default SellersPlans
