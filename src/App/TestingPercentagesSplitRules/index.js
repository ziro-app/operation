import React, { useContext, useEffect, useState, memo } from 'react'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import { motion } from 'framer-motion'
import { findPlanPercentages } from '@bit/vitorbarbosa19.ziro.split-rule'
import fetch from './fetch'
import { container, dropDowns } from './styles'

const TestingPercentagesSplitRules = () => {
  const [sellerZoopPlan2, setSellerZoopPlan2] = useState({})
  const [fees, setFees] = useState(null)
  const [feesUpdate, setFeesUpdate] = useState(null)
  const [feesFormatted, setFeesFormatted] = useState(null)
  const [card, setCard] = useState('')
  const [insurance, setInsurance] = useState(false)
  const [installment, setInstallment] = useState('')
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [allPlans, setAllPlans] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorLoading, setErrorLoading] = useState(false)
  const [searchedName, setSearchedName] = useState('')
  const [markupPercentage, setMarkupPercentage] = useState('')
  const [antifraudPercentage, setAntifraudPercentage] = useState('')
  const [suppliers, setSuppliers] = useState([])
  const [supplier, setSupplier] = useState({ docId: '', name: '', reason: '', markupPercentage: '', antifraudPercentage: '', sellerZoopPlan: '' })
  const [blocks, setBlocks] = useState([])
  const allCards = ['americanexpress', 'elo', 'hipercard', 'mastercard', 'visa']
  const allInstallments = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '0']
  const allInsurance = ['Com seguro', 'Sem seguro']

  useEffect(() => {
    fetch(setIsLoading, setErrorLoading, setSuppliers, setSellerZoopPlan2, setFees, selectedPlan, supplier)
  }, [supplier])
  useEffect(() => {
    //
    if (supplier.docId && supplier.name && supplier.reason && selectedPlan && card && installment) {
      const { percentageZiroMarkup, percentageZiroAntifraud } = findPlanPercentages({
        cardBrand: card,
        installments: installment,
        insurance,
        sellerZoopPlan: sellerZoopPlan2,
        test: true,
        selectedPlan,
      })
      console.log(percentageZiroMarkup, percentageZiroAntifraud)
      setMarkupPercentage(percentageZiroMarkup)
      setAntifraudPercentage(percentageZiroAntifraud)
    }
  }, [selectedPlan, installment, selectedPlan, insurance, card, sellerZoopPlan2])
  const clear = () => {
    setSearchedName('')
    setSelectedPlan('')
    setSelectedPlan('')
    setInstallment('')
    setCard('')
    setInsurance(false)
    setMarkupPercentage('')
    setAntifraudPercentage('')
    setSupplier({ docId: '', name: '', reason: '', markupPercentage: '', antifraudPercentage: '', sellerZoopPlan: '' })
  }
  console.log('card', card)
  console.log('installment', installment)
  console.log('insurance', insurance)
  console.log('sellerZoopPlan2', sellerZoopPlan2)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={dropDowns}>
        <Dropdown
          value={searchedName}
          onChange={({ target: { value } }) => {
            if (value !== '') {
              setSearchedName(value)
              const person = suppliers.find(element => element.name === value)
              if (person) {
                console.log('person', person)
                setAllPlans(Object.keys(person.sellerZoopPlan).filter(item => item !== 'activePlan'))
                setSupplier(person)
              } else clear()
            } else {
              clear()
              setSearchedName('')
            }
          }}
          onChangeKeyboard={element => {
            if (element) {
              setSearchedName(element.value)
              const person = suppliers.find(storeowner => storeowner.name === element.value)
              if (person) {
                console.log('person', person)
                setSupplier(person)
                setAllPlans(Object.keys(person.sellerZoopPlan).filter(item => item !== 'activePlan'))
              } else clear()
            } else {
              clear()
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
            placeholder="Escolha o plano"
          />
        )}
        {supplier.docId && supplier.name && supplier.reason && selectedPlan && (
          <Dropdown
            value={card}
            onChange={({ target: { value } }) => setCard(value)}
            onChangeKeyboard={element => (element ? setCard(element.value) : null)}
            readOnly
            list={allCards}
            placeholder="Escolha o cartão"
          />
        )}
        {supplier.docId && supplier.name && supplier.reason && selectedPlan && card && (
          <Dropdown
            value={installment}
            onChange={({ target: { value } }) => setInstallment(value)}
            onChangeKeyboard={element => (element ? setInstallment(element.value) : null)}
            readOnly
            list={allInstallments}
            placeholder="Escolha a parcela"
          />
        )}
        {supplier.docId && supplier.name && supplier.reason && selectedPlan && card && installment && (
          <Dropdown
            value={insurance ? 'Com seguro' : 'Sem seguro'}
            onChange={({ target: { value } }) => (value === 'Com seguro' ? setInsurance(true) : setInsurance(false))}
            onChangeKeyboard={element => (element === 'Com seguro' ? setInsurance(true) : setInsurance(false))}
            readOnly
            list={allInsurance}
            placeholder="Escolha se tem seguro"
          />
        )}
      </div>
      {supplier.docId && supplier.name && supplier.reason && selectedPlan && card && installment && (
        <div style={container}>
          <div>Porcentagem de markup: {markupPercentage}</div>
          <div>Porcentagem de antifraude: {antifraudPercentage}</div>
        </div>
      )}
    </motion.div>
  )
}
export default memo(TestingPercentagesSplitRules)
