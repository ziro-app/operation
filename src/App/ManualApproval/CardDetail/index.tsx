import React, { useState, useEffect } from 'react'
import RImg from 'react-image'
import Table from '@bit/vitorbarbosa19.ziro.table'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import { motion } from 'framer-motion'
import { useLocation } from 'wouter'
import Details from '@bit/vitorbarbosa19.ziro.details'
import ButtonsManualApproval from './components/ButtonsManualApproval'

export default ({ dataRows, cardId, card }) => {
  const [isLoadingButton, setIsLoading] = useState(false)
  const [location, setLocation] = useLocation()
  const [blocksDetails, setBlocksDetails] = useState([])
  const listOfDocumentsTypes = ['RG FV', 'CNH FV', 'RG F', 'CNH F', 'CNH V', 'RG V']

  const actualCardCollection = dataRows.filter(item => item.id === cardId)[0]
  const whichDocumentType = actualCardCollection ? Object.keys(actualCardCollection).filter(item => listOfDocumentsTypes.includes(item))[0] : ''
  const documents = actualCardCollection ? Object.keys(actualCardCollection).filter(item => listOfDocumentsTypes.includes(item)) : ''
  let howMuchImages = 2
  let whichDocumentF = ''
  let whichDocumentV = ''
  useEffect(() => {
    if (Object.keys(card).length > 0 && dataRows.length > 0 && actualCardCollection) {
      const block = [
        {
          header: 'Documentos',
          body: [
            {
              title: 'Nome',
              content: [actualCardCollection.extracted.nome || '-'], //aqui é o nome do document, preciso pegar o nome do cliente!
            },
            howMuchImages === 2 && {
              title: 'Link documento',
              content: [
                (
                  <label
                    style={{ cursor: 'pointer', fontSize: '1.4rem' }}
                    onClick={() => {
                      const link = document.createElement('a')
                      link.href = actualCardCollection[whichDocumentType].url
                      link.setAttribute('rel', 'noopener noreferrer')
                      link.setAttribute('target', '_blank')
                      document.body.appendChild(link)
                      link.click()
                    }}
                  >
                    Ver
                  </label>
                ) || '-',
              ],
            },
            howMuchImages === 2 && {
              title: 'Porcentagem ',
              content: [`${(actualCardCollection[whichDocumentType].fileInfo.classifiedAs.probability * 100).toFixed(2)} %` || '-'],
            },
            howMuchImages !== 2 && {
              title: 'Link documento frente',
              content: [
                (
                  <label
                    style={{ cursor: 'pointer', fontSize: '1.4rem' }}
                    onClick={() => {
                      const link = document.createElement('a')
                      link.href = actualCardCollection[whichDocumentF].url
                      link.setAttribute('rel', 'noopener noreferrer')
                      link.setAttribute('target', '_blank')
                      document.body.appendChild(link)
                      link.click()
                    }}
                  >
                    Ver
                  </label>
                ) || '-',
              ],
            },
            howMuchImages !== 2 && {
              title: 'Porcentagem documento frente',
              content: [`${(actualCardCollection[whichDocumentF].fileInfo.classifiedAs.probability * 100).toFixed(2)} %` || '-'],
            },
            howMuchImages !== 2 && {
              title: 'Link documento verso',
              content: [
                (
                  <label
                    style={{ cursor: 'pointer', fontSize: '1.4rem' }}
                    onClick={() => {
                      const link = document.createElement('a')
                      link.href = actualCardCollection[whichDocumentV].url
                      link.setAttribute('rel', 'noopener noreferrer')
                      link.setAttribute('target', '_blank')
                      document.body.appendChild(link)
                      link.click()
                    }}
                  >
                    Ver
                  </label>
                ) || '-',
              ],
            },
            howMuchImages !== 2 && {
              title: 'Porcentagem documento verso',
              content: [`${(actualCardCollection[whichDocumentV].fileInfo.classifiedAs.probability * 100).toFixed(2)} %` || '-'],
            },
            {
              title: 'Link selfie',
              content: [
                (
                  <label
                    style={{ cursor: 'pointer', fontSize: '1.4rem' }}
                    onClick={() => {
                      const link = document.createElement('a')
                      link.href = actualCardCollection.selfie.url
                      link.setAttribute('rel', 'noopener noreferrer')
                      link.setAttribute('target', '_blank')
                      document.body.appendChild(link)
                      link.click()
                    }}
                  >
                    Ver
                  </label>
                ) || '-',
              ],
            },
            howMuchImages !== 2 && {
              title: 'Porcentagem selfie',
              content: [`${(actualCardCollection[whichDocumentV].fileInfo.classifiedAs.probability * 100).toFixed(2)} %` || '-'],
            },
            {
              title: 'Documento Extraído',
              content: [whichDocumentType.split(' ')[0] || '-'],
            },
            {
              title: 'Número Extraído',
              content: [actualCardCollection.extracted[whichDocumentType.split(' ')[0].toLowerCase()] || '-'],
            },
            {
              title: 'Emissor',
              content: [actualCardCollection.extracted.emissor || '-'],
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
              title: 'Primeiros 4 números',
              content: [card.first4_digits || '-'],
            },
            {
              title: 'Últimos 4 números',
              content: [card.last4_digits || '-'],
            },
            {
              title: 'Vencimento',
              content: [`${card.expiration_month}/${card.expiration_year}` || '-'],
            },
          ],
        },
        {
          header: 'Negócio',
          body: [
            {
              title: 'Nome',
              content: [actualCardCollection.fullName || '-'],
            },
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
      ]
      setBlocksDetails(block)
    }
  }, [card])

  if (typeof actualCardCollection === 'undefined' || !actualCardCollection) {
    return <Spinner />
  }
  if (dataRows.length === 0 || actualCardCollection.status !== 'pendingManualApproval') {
    setLocation('aprovacao-manual')
  }
  if (documents.length > 1) {
    howMuchImages = 3
    whichDocumentF = documents[0]
    whichDocumentV = documents[1]
  }
  if (actualCardCollection.status !== 'pendingManualApproval') {
    setLocation('aprovacao-manual')
  }
  return (
    <>
      <ButtonsManualApproval isLoadingButton={isLoadingButton} setIsLoading={setIsLoading} actualCardCollection={actualCardCollection} />
      {howMuchImages === 2 ? (
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
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gridGap: '10px',
          }}
        >
          <RImg src={actualCardCollection[whichDocumentF].url} style={{ width: '100%' }} alt="preview" />
          <RImg src={actualCardCollection[whichDocumentV].url} style={{ width: '100%' }} alt="preview" />
          <RImg src={actualCardCollection.selfie.url} style={{ width: '100%' }} alt="preview" />
        </div>
      )}
      <Details blocks={blocksDetails} blockGap={'20px'} />
      <ButtonsManualApproval isLoadingButton={isLoadingButton} setIsLoading={setIsLoading} actualCardCollection={actualCardCollection} />
    </>
  )
}
