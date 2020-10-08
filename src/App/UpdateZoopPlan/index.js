import React, { useState, useEffect, useContext } from 'react'
import { motion } from 'framer-motion'
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import InputPercentage from '@bit/vitorbarbosa19.ziro.input-percentage'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import Details from '@bit/vitorbarbosa19.ziro.details'
import SpinnerWithDiv from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import Error from '@bit/vitorbarbosa19.ziro.error'
import sendToBackend from './sendToBackend'
import fetch from './fetch'
import { userContext } from '../appContext'

const UpdateZoopPlan = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [errorLoading, setErrorLoading] = useState(false)
  const [searchedName, setSearchedName] = useState('')
  const [markupPercentage, setMarkupPercentage] = useState('')
  const [antifraudPercentage, setAntifraudPercentage] = useState('')
  const [suppliers, setSuppliers] = useState([])
  const [supplier, setSupplier] = useState({ docId: '', name: '', reason: '', markupPercentage: '', antifraudPercentage: '' })
  const [blocks, setBlocks] = useState([])
  const { nickname } = useContext(userContext)
  const setState = { setAntifraudPercentage, setSupplier, setMarkupPercentage, setBlocks }
  const state = { nickname, antifraudPercentage, supplier, markupPercentage, blocks, ...setState }
  const validations = [
    {
      name: 'markupPercentage',
      validation: value => value === '' || (value >= 0 && value <= 10000),
      value: markupPercentage,
      message: 'Valor inválido',
    },
    {
      name: 'antifraudPercentage',
      validation: value => value === '' || (value >= 0 && value <= 10000),
      value: antifraudPercentage,
      message: 'Valor inválido',
    },
  ]

  const mountBlock = (name, reason, markup, antifraud) => {
    return [
      {
        header: 'Detalhes',
        body: [
          {
            title: 'Fabricante',
            content: name,
          },
          {
            title: 'Razão',
            content: reason,
          },
          {
            title: 'Markup',
            content: markup,
          },
          {
            title: 'Antifraude',
            content: antifraud,
          },
        ],
      },
    ]
  }

  const clear = () => {
    setMarkupPercentage('')
    setAntifraudPercentage('')
    setSupplier({ docId: '', name: '', reason: '', markupPercentage: '', antifraudPercentage: '' })
    setBlocks(mountBlock('', '', '', ''))
  }

  useEffect(() => fetch(setIsLoading, setErrorLoading, setSuppliers, setBlocks, mountBlock), [])

  if (isLoading) return <SpinnerWithDiv size="5rem" />
  if (errorLoading) return <Error />

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'grid', gridTemplateRows: 'auto 1fr auto', gridRowGap: '20px' }}>
      <Dropdown
        value={searchedName}
        onChange={({ target: { value } }) => {
          if (value !== '') {
            setSearchedName(value)
            let person = suppliers.find(element => element.name === value)
            if (person) {
              setSupplier(person)
              setBlocks(mountBlock(person.name, person.reason, person.markupPercentage, person.antifraudPercentage))
            } else clear()
          } else {
            clear()
            setSearchedName('')
          }
        }}
        onChangeKeyboard={element => {
          if (element) {
            setSearchedName(element.value)
            let person = suppliers.find(storeowner => storeowner.name === element.value)
            if (person) {
              setSupplier(person)
              setBlocks(mountBlock(person.name, person.reason, person.markupPercentage, person.antifraudPercentage))
            } else clear()
          } else {
            clear()
            setSearchedName('')
          }
        }}
        list={suppliers.map(supplier => supplier.name).sort()}
        placeholder="Escolha o fabricante"
      />

      <Details blocks={blocks} />

      {supplier.docId && supplier.name && supplier.reason && supplier.antifraudPercentage && supplier.markupPercentage && (
        <Form
          buttonName="Atualizar"
          validations={validations}
          sendToBackend={sendToBackend ? sendToBackend({ ...state, mountBlock }) : () => null}
          inputs={[
            <FormInput
              name="markupPercentage"
              label="Nova porcentagem de Markup"
              input={<InputPercentage value={markupPercentage} setValue={setMarkupPercentage} />}
            />,
            <FormInput
              name="antifraudPercentage"
              label="Nova porcentagem de Antifraude"
              input={<InputPercentage value={antifraudPercentage} setValue={setAntifraudPercentage} />}
            />,
          ]}
        />
      )}
    </motion.div>
  )
}

export default UpdateZoopPlan
