import React, { useEffect, useState } from 'react'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import Error from '@bit/vitorbarbosa19.ziro.error'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import Table from '@bit/vitorbarbosa19.ziro.table'
import { useLocation } from 'wouter'
import fetch from './fetch'
import { Menu } from '../Menu/index'

const SellersPlans = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [errorLoading, setErrorLoading] = useState(false)
  const [data, setData] = useState([])
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

  if (isLoading) return <Spinner />
  if (errorLoading) return <Error />
  return (
    <Table
      data={data}
      customGrid={{
        gridTemplateColumns: 'auto auto',
        gridRowGap: '10px',
      }}
    />
  )
}

export default SellersPlans
