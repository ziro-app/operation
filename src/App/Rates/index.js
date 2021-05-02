import React from 'react'
import Button from '@bit/vitorbarbosa19.ziro.button'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import Error from '@bit/vitorbarbosa19.ziro.error'
import Table from '@bit/vitorbarbosa19.ziro.table'
import { useLocation, useRoute } from 'wouter'

import useLoadRates from './hooks/useLoadRates'

const Rates = () => {
  const [, setLocation] = useLocation()
  const [matchSellerId, paramsSellerId] = useRoute('/tarifas/:sellerId?/:sellerName?')
  const { sellerId } = paramsSellerId
  const { dataRows, isLoading, isError, activePlan } = useLoadRates(sellerId)
  const dataTable = (data, title) => [
    {
      title,
      header: ['Parcela', 'Sem Seguro', 'Com Seguro'],
      rows: data,
      totals: [],
    },
  ]

  if (isLoading) <Spinner />

  if (isError)
    return (
      <Error
        title="Plano não encontrado"
        message="Você ainda não possui um plano de vendas cadastrado e não
                    pode gerar links de pagamento. Entre em contato com o suporte para cadastrar seu plano."
        type="noData"
        btnMsg="Falar com suporte"
        backRoute="/transacoes"
        backRouteFunction={route => {
          window.open(`https://api.whatsapp.com/send?phone=5511985660341`, '_blank')
          setLocation(route)
        }}
      />
    )

  return (
    <div>
      <div
        style={{
          textAlign: 'center',
          margin: '0px 0px 15px',
        }}
      >
        <label
          style={{
            fontFamily: 'Rubik',
            textTransform: 'uppercase',
            fontSize: '1.8rem',
          }}
        >
          {activePlan}
        </label>
      </div>
      <Button type="button" cta="Alterar Plano de Venda" click={() => setLocation(`/atualizar-plano-venda/${sellerId}`)} />
      {dataRows.map(data => (
        <div aria-label="table" key={data.brand} style={{ marginTop: '20px' }}>
          <Table
            data={dataTable(data.content, data.brand === 'americanexpress' ? 'american express' : data.brand)}
            customGrid={{
              gridTemplateColumns: 'auto 1fr auto',
              gridRowGap: '5px',
            }}
            cellStyle={{
              width: '100%',
              height: '100%',
              fontSize: '1.4rem',
              textAlign: 'center',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          />
        </div>
      ))}
    </div>
  )
}

export default Rates
