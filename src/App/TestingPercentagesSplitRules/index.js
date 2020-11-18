import React, { useContext, useEffect, useState, memo } from 'react'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import { motion } from 'framer-motion'
import { findPlanPercentages } from '@bit/vitorbarbosa19.ziro.split-rule'
import fetch from './fetch'
import { container, dropDowns } from './styles'

const TestingPercentagesSplitRules = () => {
  const [sellerZoopPlan2, setSellerZoopPlan2] = useState({})
  const [fees, setFees] = useState('')
  const [feesUpdate, setFeesUpdate] = useState(null)
  const [feesFormatted, setFeesFormatted] = useState(null)
  const [card, setCard] = useState('')
  const [insurance, setInsurance] = useState(false)
  const [installment, setInstallment] = useState('')
  const [selectedPlan, setSelectedPlan] = useState('')
  const [allPlans, setAllPlans] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorLoading, setErrorLoading] = useState(false)
  const [searchedName, setSearchedName] = useState('')
  const [markupPercentageWithInsurance, setMarkupPercentageWithInsurance] = useState('')
  const [antifraudPercentageWithInsurance, setAntifraudPercentageWithInsurance] = useState('')
  const [markupPercentageWithoutInsurance, setMarkupPercentageWithoutInsurance] = useState('')
  const [antifraudPercentageWithoutInsurance, setAntifraudPercentageWithoutInsurance] = useState('')
  const [zoopPercentage, setZoopPercentage] = useState('')
  const [suppliers, setSuppliers] = useState([])
  const [supplier, setSupplier] = useState({ docId: '', name: '', reason: '', markupPercentage: '', antifraudPercentage: '', sellerZoopPlan: '' })
  const [counter, setCounter] = useState(0)
  const allCards = ['americanexpress', 'elo', 'hipercard', 'mastercard', 'visa']
  const allInstallments = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']

  function translateFirebaseToFees(text) {
    const financed30 = 'd+30'
    const financed14 = 'd+14'
    const standard = 'fluxo'
    if (text === 'financed30') return financed30
    if (text === 'financed14') return financed14
    if (text === 'standard') return standard
    return text
  }
  function translateFeesToFirebase(text) {
    const d30 = 'financed30'
    const d14 = 'financed14'
    const fluxo = 'standard'
    if (text === 'd+30') return d30
    if (text === 'd+14') return d14
    if (text === 'fluxo') return fluxo
    return 'Taxa sem nome cadastrado'
  }

  const clear = () => {
    setSearchedName('')
    setSelectedPlan('')
    setInstallment('')
    setCard('')
    setInsurance(false)
    setMarkupPercentageWithInsurance('')
    setAntifraudPercentageWithInsurance('')
    setMarkupPercentageWithoutInsurance('')
    setAntifraudPercentageWithoutInsurance('')
    setSupplier({ docId: '', name: '', reason: '', markupPercentage: '', antifraudPercentage: '', sellerZoopPlan: '' })
  }
  useEffect(() => {
    if (suppliers.length > 0 && counter < 2) {
      setCounter(counter + 1)
      if (localStorage.getItem('sellerName')) {
        const searchedNameFromLocalStorage = localStorage.getItem('sellerName')
        setSearchedName(searchedNameFromLocalStorage)
        const person = suppliers.find(element => element.name === searchedNameFromLocalStorage)
        if (person) {
          setAllPlans(Object.keys(person.sellerZoopPlan).filter(item => item !== 'activePlan'))
          setSupplier(person)
        } else clear()
      }
    }
  }, [suppliers])
  useEffect(() => {
    fetch(setIsLoading, setErrorLoading, setSuppliers, setSellerZoopPlan2, setFees, selectedPlan, supplier)
  }, [supplier])
  useEffect(() => {
    //

    if (supplier.docId && supplier.name && supplier.reason && selectedPlan && card && installment) {
      const translatedSelectedPlan = translateFeesToFirebase(selectedPlan)

      const {
        percentageZiroMarkup: percentageZiroMarkupWithInsurance,
        percentageZiroAntifraud: percentageZiroAntifraudWithInsurance,
      } = findPlanPercentages({
        cardBrand: card,
        installments: installment,
        insurance: true,
        sellerZoopPlan: sellerZoopPlan2,
        test: true,
        selectedPlan: translatedSelectedPlan,
      })
      const {
        percentageZiroMarkup: percentageZiroMarkupWithoutInsurance,
        percentageZiroAntifraud: percentageZiroAntifraudWithoutInsurance,
      } = findPlanPercentages({
        cardBrand: card,
        installments: installment,
        insurance: false,
        sellerZoopPlan: sellerZoopPlan2,
        test: true,
        selectedPlan: translatedSelectedPlan,
      })
      if (selectedPlan && card && installment)
        setZoopPercentage(sellerZoopPlan2[translatedSelectedPlan]['zoopFee'][card][`installment${installment}`])
      setMarkupPercentageWithInsurance(percentageZiroMarkupWithInsurance)
      setAntifraudPercentageWithInsurance(percentageZiroAntifraudWithInsurance)

      setMarkupPercentageWithoutInsurance(percentageZiroMarkupWithoutInsurance)
      setAntifraudPercentageWithoutInsurance(percentageZiroAntifraudWithoutInsurance)
    }
  }, [selectedPlan, installment, selectedPlan, insurance, card, sellerZoopPlan2])
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
            list={allPlans.map(item => translateFirebaseToFees(item))}
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
            placeholder="Escolha a bandeira"
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
      </div>
      {supplier.docId && supplier.name && supplier.reason && selectedPlan && card && installment && (
        <div style={container}>
          <div>Markup Zoop: {zoopPercentage}%</div>
          <div>Markup Ziro: {markupPercentageWithInsurance}%</div>
          <div>Antifraude Ziro: {antifraudPercentageWithInsurance}%</div>
          <div style={{ fontWeight: 'bold' }}>
            Tarifa Total Sem Seguro: {(parseFloat(markupPercentageWithInsurance) + parseFloat(zoopPercentage)).toFixed(2)}%
          </div>
          <div style={{ fontWeight: 'bold' }}>
            Tarifa Total Com Seguro:{' '}
            {(parseFloat(markupPercentageWithInsurance) + parseFloat(antifraudPercentageWithInsurance) + parseFloat(zoopPercentage)).toFixed(2)}%
          </div>
        </div>
      )}
    </motion.div>
  )
}
export default memo(TestingPercentagesSplitRules)
