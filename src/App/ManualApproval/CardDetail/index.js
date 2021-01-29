import React, { useState, useEffect } from 'react'
import RImg from 'react-image'
import Table from '@bit/vitorbarbosa19.ziro.table'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import { motion } from 'framer-motion'
import { useLocation } from 'wouter'
import Details from '@bit/vitorbarbosa19.ziro.details'
import Button from '@bit/vitorbarbosa19.ziro.button'
import { getShortDate } from '../utils/functions'
import { labelStyle } from './style'
import { db, fs } from '../../../Firebase/index'

export default ({ dataRows, cardId, card }) => {
  const [isLoadingButton, setIsLoading] = useState(false)
  const [location, setLocation] = useLocation()
  const [blocksDetails, setBlocksDetails] = useState([])
  const listOfDocumentsTypes = ['RG FV', 'CNH FV', 'RG F', 'CNH F', 'CNH V', 'RG V']

  const actualCardCollection = dataRows.filter(item => item.id === cardId)[0]
  useEffect(() => {
    if (Object.keys(card).length > 0 && dataRows.length > 0 && actualCardCollection) {
      const block = [
        {
          header: 'Documentos',
          body: [
            {
              title: 'Nome',
              content: [actualCardCollection.extracted.nome || '-'],
            },
            {
              title: 'Link documento',
              content: [
                (
                  <a target="_blank" rel="noopener noreferrer" href={actualCardCollection[whichDocumentType].url}>
                    Link
                  </a>
                ) || '-',
              ],
            },
            {
              title: 'Link selfie',
              content: [
                (
                  <a target="_blank" rel="noopener noreferrer" href={actualCardCollection.selfie.url}>
                    Link
                  </a>
                ) || '-',
              ],
            },
            {
              title: 'Documento Extraido',
              content: [whichDocumentType.split(' ')[0] || '-'],
            },
            {
              title: 'Numero Extraido',
              content: [actualCardCollection.extracted[whichDocumentType.split(' ')[0].toLowerCase()] || '-'],
            },
            {
              title: 'CPF',
              content: [actualCardCollection.extracted.cpf || '-'],
            },
            {
              title: 'RG',
              content: [actualCardCollection.extracted.rg || '-'],
            },
          ],
        },
        {
          header: 'Negocio',
          body: [
            {
              title: 'Razão',
              content: [actualCardCollection.razao || '-'],
            },
            {
              title: 'CNPJ',
              content: [actualCardCollection.cnpj || '-'],
            },
          ],
        },
        {
          header: 'Pessoa',
          body: [
            {
              title: 'Data de Nascimento',
              content: [actualCardCollection.extracted.dataNascimento || '-'],
            },
            {
              title: 'Pai',
              content: [actualCardCollection.extracted.nomePai || '-'],
            },
            {
              title: 'Mãe',
              content: [actualCardCollection.extracted.nomeMae || '-'],
            },
          ],
        },
        {
          header: 'Cartão',
          body: [
            {
              title: 'Bandeira',
              content: [card.card_brand || '-'],
            },
            {
              title: 'Nome no Cartão',
              content: [card.holder_name || '-'],
            },
            {
              title: 'Primeiros 4 numeros',
              content: [card.first4_digits || '-'],
            },
            {
              title: 'Ultimos 4 numeros',
              content: [card.last4_digits || '-'],
            },
            {
              title: 'Valido até',
              content: [`${card.expiration_month}/${card.expiration_year}` || '-'],
            },
          ],
        },
      ]
      setBlocksDetails(block)
    }
  }, [card])

  console.log('actualCardCollection', actualCardCollection)
  console.log('card', card)
  if (typeof actualCardCollection === 'undefined') {
    return <Spinner />
  }
  if (dataRows.length === 0 || actualCardCollection.status !== 'pendingManualApproval') {
    setLocation('aprovacao-manual')
  }
  const whichDocumentType = Object.keys(actualCardCollection).filter(item => listOfDocumentsTypes.includes(item))[0]

  if (actualCardCollection.status !== 'pendingManualApproval') {
    setLocation('aprovacao-manual')
  }
  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridGap: '10px',
        }}
      >
        <RImg src={actualCardCollection[whichDocumentType].url} style={{ width: '100%' }} alt="preview" />
        <RImg src={actualCardCollection.selfie.url} style={{ width: '100%' }} alt="preview" />
      </div>
      <Details blocks={blocksDetails} />
      <div style={{ marginTop: '20px' }}>
        <Button
          type="button"
          cta="Aprovar"
          submitting={isLoadingButton}
          click={async () => {
            console.log('click')
            setIsLoading(true)
            await db
              .collection('catalog-user-data')
              .doc(actualCardCollection.idParent)
              .collection('cards')
              .doc(actualCardCollection.id)
              .update({ status: 'approved' })
            setIsLoading(false)
            window.location.reload()
            //setLocation('aprovacao-manual');
          }}
        />
      </div>
      <div style={{ marginTop: '10px' }}>
        <Button
          type="button"
          cta="Arquivar"
          template="destructive"
          submitting={isLoadingButton}
          click={async () => {
            console.log('click')
            setIsLoading(true)
            await db
              .collection('catalog-user-data')
              .doc(actualCardCollection.idParent)
              .collection('cards')
              .doc(actualCardCollection.id)
              .update({ status: 'archived' })
            setIsLoading(false)
            window.location.reload()
            //setLocation('aprovacao-manual');
          }}
        />
      </div>
    </>
  )
}
