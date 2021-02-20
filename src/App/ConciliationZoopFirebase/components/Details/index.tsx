import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Table from '@bit/vitorbarbosa19.ziro.table'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import { motion } from 'framer-motion'
import { getShortDate, translateStatus } from '../../utils/functions'
import { useLocation } from 'wouter'
import Details from '@bit/vitorbarbosa19.ziro.details'

interface installmentPlan {
  number_installments:String
}

interface paymentMethod {
  holder_name: String
  card_brand: String
  first4_digits: String
  last4_digits: String
  expiration_month: String
  expiration_year: String
}

interface transactionProps {
  on_behalf_of: String
  id: String
  buyerRazao: String
  created_at: Date
  status: String
  statement_descriptor: String
  amount: String
  installment_plan: installmentPlan
  payment_method:paymentMethod
}
export default ({ dataRows, transactionId }) => {
  const [actualTransaction,setActualTransaction] = useState<transactionProps>()
  const [isLoadingButton, setIsLoading] = useState(false)
  const [location, setLocation] = useLocation()
  const [blocksDetails, setBlocksDetails] = useState([])

  const transactionWithoutBusinessName = dataRows.filter(item => item.id === transactionId)[0]
  useEffect(() => {
    if (dataRows.length > 0 && transactionWithoutBusinessName && blocksDetails.length === 0) {
        axios.get(
          `https://api.zoop.ws/v1/marketplaces/${
            process.env.ZIRO_MARKETPLACE
          }/sellers/${transactionWithoutBusinessName.on_behalf_of}`,
          { headers: { Authorization: process.env.ZOOP_TOKEN } },
        ).then(response => {
          const {data} = response
          const {statement_descriptor} = data
          setActualTransaction({...transactionWithoutBusinessName,statement_descriptor})
          if(actualTransaction){
              console.log(actualTransaction)
      const block = [
        {
          header: 'Transação',
          body: [
            {
              title: 'Zoop ID',
              content: [actualTransaction.id || '-'],
            },
            {
              title: 'Razão',
              content: [actualTransaction.buyerRazao ? String(actualTransaction.buyerRazao).toUpperCase() : 'NÃO EXISTE NO FIREBASE'],
            },
            {
              title: 'Data',
              content: [getShortDate(new Date(actualTransaction.created_at)) || '-'],
            },
            {
              title: 'Status',
              content: [actualTransaction.status ? translateStatus(actualTransaction.status).toUpperCase() : '-'],
            },
            {
              title: 'Vendedor',
              content: [actualTransaction.statement_descriptor ? actualTransaction.statement_descriptor.toUpperCase() : '-'],
            },
            {
              title: 'Valor',
              content: [parseFloat(`${actualTransaction.amount}`)
              .toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
              .replace(/\s/g, '') || '-'],
            },
            {
              title: 'Parcelas',
              content: [actualTransaction.installment_plan ? actualTransaction.installment_plan.number_installments : '-'],
            },
          ],
        },
        {
          header: 'Cartão',
          body: [
            {
              title: 'Nome',
              content: [actualTransaction.payment_method.holder_name ? actualTransaction.payment_method.holder_name.toUpperCase() : '-'],
            },
            {
              title: 'Bandeira',
              content: [actualTransaction.payment_method.card_brand ? actualTransaction.payment_method.card_brand.toUpperCase() : '-'],
            },
            {
              title: 'Numero',
              content: [actualTransaction.payment_method.first4_digits ? `${actualTransaction.payment_method.first4_digits}....${actualTransaction.payment_method.last4_digits}` : '-'],
            },
            {
              title: 'Validade',
              content: [actualTransaction.payment_method.expiration_month ? `${actualTransaction.payment_method.expiration_month}/${actualTransaction.payment_method.expiration_year}` : '-'],
            },
          ],
        },
      ]
      setBlocksDetails(block)}
        })
    }
  }, [actualTransaction,transactionWithoutBusinessName])
  if (typeof actualTransaction === 'undefined' || !actualTransaction) {
    return <Spinner />
  }
  /*if (dataRows.length === 0 || !actualTransaction) {
    setLocation('/conciliacao')
  }*/
  return (
    <>
      <div style={{ marginTop: '20px' }}>
        <Details blocks={blocksDetails} blockGap={'20px'} />
      </div>
    </>
  )
}
