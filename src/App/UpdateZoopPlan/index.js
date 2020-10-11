import React, { useState, useEffect, useContext, memo } from 'react'
import { motion } from 'framer-motion'
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import InputPercentage from '@bit/vitorbarbosa19.ziro.input-percentage'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import Details from '@bit/vitorbarbosa19.ziro.details'
import SpinnerWithDiv from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import Error from '@bit/vitorbarbosa19.ziro.error'
import Button from '@bit/vitorbarbosa19.ziro.button'
import { useLocation, useRoute } from 'wouter'
import sendToBackend from './sendToBackend'
import fetch from './fetch'
import { userContext } from '../appContext'
import { alphanum, returnInstallmentsWithFee, translateFees, translateInstallments } from './functions'
import { wrapper, text, title, item, container } from './styles'
import UpdateTax from './UpdateTax/index'

const UpdateZoopPlan = ({ sellerId }) => {
  const [sellerZoopPlan2, setSellerZoopPlan2] = useState({})
  const [fees, setFees] = useState(null)
  const [feesUpdate, setFeesUpdate] = useState(null)
  const [feesFormatted, setFeesFormatted] = useState(null)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [allPlans, setAllPlans] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [errorLoading, setErrorLoading] = useState(false)
  const [searchedName, setSearchedName] = useState('')
  const [markupPercentage, setMarkupPercentage] = useState('')
  const [antifraudPercentage, setAntifraudPercentage] = useState('')
  const [suppliers, setSuppliers] = useState([])
  const [supplier, setSupplier] = useState({ docId: '', name: '', reason: '', markupPercentage: '', antifraudPercentage: '', sellerZoopPlan: '' })
  const [blocks, setBlocks] = useState([])
  const [, setLocation] = useLocation()
  const [settingActivePlan, setSettingActivePlan] = useState('')
  /* if (!sellerId) {
    const [matchSellerId, paramsSellerId] = useRoute('/atualizar-plano-zoop/:sellerId?')
    const { sellerId } = paramsSellerId
  } */
  console.log('sellerId', sellerId)
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })
  const { nickname } = useContext(userContext)
  const setState = { setAntifraudPercentage, setSupplier, setMarkupPercentage, setBlocks }
  const state = {
    docId: supplier.docId,
    selectedPlan,
    nickname,
    sellerZoopPlan2,
    antifraudPercentage,
    supplier,
    markupPercentage,
    blocks,
    setSettingActivePlan,
    ...setState,
  }
  // console.log(sellerZoopPlan2)
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
    setAllPlans('')
    setMarkupPercentage('')
    setAntifraudPercentage('')
    setSupplier({ docId: '', name: '', reason: '', markupPercentage: '', antifraudPercentage: '', sellerZoopPlan: '' })
    setBlocks(mountBlock('', '', '', ''))
  }
  // console.log(supplier)
  useEffect(() => {
    fetch(setIsLoading, setErrorLoading, setSuppliers, setBlocks, mountBlock, setSellerZoopPlan2, setFees, selectedPlan, supplier)
  }, [selectedPlan, supplier])
  useEffect(() => {
    if (sellerZoopPlan2 && Object.keys(sellerZoopPlan2).length !== 0) {
    }
  }, [sellerZoopPlan2, fees, selectedPlan])
  if (isLoading) return <SpinnerWithDiv size="5rem" />
  if (errorLoading) return <Error />
  // if (feesUpdate) return <UpdateTax fee={feesUpdate} setFee={setFeesUpdate} />
  // console.log(fees)
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'grid', gridTemplateRows: 'auto 1fr auto', gridRowGap: '20px' }}>
      <Dropdown
        value={searchedName}
        onChange={({ target: { value } }) => {
          if (value !== '') {
            setSearchedName(value)
            const person = suppliers.find(element => element.name === value)
            if (person) {
              console.log('person', person)
              if (person.sellerZoopPlan) setAllPlans(Object.keys(person.sellerZoopPlan).filter(item => item !== 'activePlan'))
              else {
              }
              setSupplier(person)
              setBlocks(mountBlock(person.name, person.reason, person.markupPercentage, person.antifraudPercentage, person.sellerZoopPlan))
            } else clear()
          } else {
            clear()
            setSearchedName('')
            setSelectedPlan('')
          }
        }}
        onChangeKeyboard={element => {
          if (element) {
            setSearchedName(element.value)
            const person = suppliers.find(storeowner => storeowner.name === element.value)
            if (person) {
              console.log('person', person)
              setSupplier(person)
              if (person.sellerZoopPlan) setAllPlans(Object.keys(person.sellerZoopPlan).filter(item => item !== 'activePlan'))
              else {
                setAllPlans([''])
                setSelectedPlan('')
              }
              setBlocks(mountBlock(person.name, person.reason, person.markupPercentage, person.antifraudPercentage, person.sellerZoopPlan))
            } else clear()
          } else {
            clear()
            setSearchedName('')
            setSelectedPlan('')
          }
        }}
        list={suppliers.map(supplier => supplier.name).sort()}
        placeholder="Escolha o fabricante"
      />
      {supplier.docId && supplier.name && supplier.reason && (
        <Dropdown
          value={selectedPlan}
          onChange={({ target: { value } }) => setSelectedPlan(value)}
          onChangeKeyboard={element => (element ? setSelectedPlan(element.value) : null)}
          readOnly
          list={allPlans}
          placeholder="Escolha o plano ou crie um"
        />
      )}
      {supplier.docId && supplier.name && supplier.reason && (
        <Button
          type="button"
          cta="Criar plano"
          template="regular"
          click={() => {
            console.log(supplier.docId)
            // setFeesUpdate(fee)
            setLocation(`/atualizar-plano-zoop/${supplier.docId}/newPlan`)
          }}
        />
      )}
      {supplier.docId && supplier.name && supplier.reason && selectedPlan && fees && (
        <Button
          type="button"
          cta="Ativar plano selecionado"
          template="regular"
          click={() => {
            console.log(supplier.docId, selectedPlan)
            sendToBackend(state)
            // setFeesUpdate(fee)
            // setLocation(`/atualizar-plano-zoop/${supplier.docId}/newPlan`)
          }}
        />
      )}
      {supplier.docId && supplier.name && supplier.reason && selectedPlan && fees && sellerZoopPlan2 && (
        <div style={container}>Plano atualmente ativo: {settingActivePlan || sellerZoopPlan2.activePlan}</div>
      )}
      <div style={wrapper}>
        {supplier.docId &&
          supplier.name &&
          supplier.reason &&
          selectedPlan &&
          fees &&
          fees.map(fee => (
            <div>
              <Button
                type="button"
                cta={`Editar ${translateFees(fee[0]).split(' ')[1]}`}
                template="regular"
                click={() => {
                  // console.log(fee)
                  setFeesUpdate(fee)
                  setLocation(`/atualizar-plano-zoop/${supplier.docId}/${fee[0]}/${selectedPlan}`)
                }}
              />
              <div style={title}>{translateFees(fee[0])}</div>
              <br />{' '}
              {Object.entries(fee[1]).map(card => (
                <div style={item}>
                  Cartão: {card[0].toUpperCase()}
                  <div>
                    {returnInstallmentsWithFee(card, fee, feesFormatted, setFeesFormatted).map(item => (
                      <div>{`${translateInstallments(item.split(' ')[0])} ${item.split(' ')[1]} ${item.split(' ')[2]}`}</div>
                    ))}
                  </div>
                  <br />
                </div>
              ))}{' '}
            </div>
          ))}
      </div>
    </motion.div>
  )
}

export default memo(UpdateZoopPlan)
