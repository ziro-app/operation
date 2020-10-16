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
import { alphanum, returnInstallmentsWithFee, translateFees, translateInstallments, defaultValues, createNewPlan } from './functions'
import { wrapper, text, title, item, container } from './styles'
import Modal from '../utils/Modal/Modal'
import updatePlan from './updatePlan'

const UpdateZoopPlan = ({ sellerId }) => {
  const [blocks, setBlocks] = useState([])
  const [sellerZoopPlan2, setSellerZoopPlan2] = useState({})
  const [fees, setFees] = useState(null)
  const [selectedPlan, setSelectedPlan] = useState('')
  const [allPlans, setAllPlans] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [errorLoading, setErrorLoading] = useState(false)
  const [openModalDeletePlan, setOpenModalDeletePlan] = useState(false)
  const [searchedName, setSearchedName] = useState('')
  const [markupPercentage, setMarkupPercentage] = useState('')
  const [antifraudPercentage, setAntifraudPercentage] = useState('')
  const [suppliers, setSuppliers] = useState([])
  const [supplier, setSupplier] = useState({ docId: '', name: '', reason: '', markupPercentage: '', antifraudPercentage: '', sellerZoopPlan: '' })
  const [, setLocation] = useLocation()
  const [settingActivePlan, setSettingActivePlan] = useState('')
  /* if (!sellerId) {
    const [matchSellerId, paramsSellerId] = useRoute('/atualizar-plano-zoop/:sellerId?')
    const { sellerId } = paramsSellerId
  } */
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })
  const { nickname } = useContext(userContext)
  const setState = { setAntifraudPercentage, setSupplier, setMarkupPercentage }
  const state = {
    docId: supplier.docId,
    selectedPlan,
    nickname,
    sellerZoopPlan2,
    antifraudPercentage,
    supplier,
    markupPercentage,
    setSettingActivePlan,
    ...setState,
  }

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

  const mountBlock = (name, reason, activePlan, plans = []) => {
    const plansFormatted = plans ? plans.join(' , ') : ''
    // console.log(plans)
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
            title: 'Plano Ativo',
            content: activePlan,
          },
        ],
      },
    ]
  }
  const clear = () => {
    setAllPlans('')
    setSellerZoopPlan2('')
    setMarkupPercentage('')
    setAntifraudPercentage('')
    setSupplier({ docId: '', name: '', reason: '', markupPercentage: '', antifraudPercentage: '', sellerZoopPlan: '' })
    setBlocks(mountBlock('', '', '', ''))
  }
  const deletePlan = async planName => {
    const newAllPlans = allPlans
    delete sellerZoopPlan2[planName]
    const index = newAllPlans.indexOf(planName)
    if (index > -1) {
      newAllPlans.splice(index)
    }
    localStorage.removeItem('selectedPlan')
    await updatePlan(sellerZoopPlan2, nickname, supplier.docId)
    setAllPlans(newAllPlans)
    setSelectedPlan('')
    setOpenModalDeletePlan(false)
    setLocation('/atualizar-plano-zoop')
  }
  console.log('supplier', supplier)
  useEffect(() => {
    if (localStorage.getItem('sellerName')) setSearchedName(localStorage.getItem('sellerName'))
    if (localStorage.getItem('selectedPlan')) setSelectedPlan(localStorage.getItem('selectedPlan'))
    if (localStorage.getItem('sellerObject')) setSupplier(JSON.parse(localStorage.getItem('sellerObject')))

    fetch(setIsLoading, setErrorLoading, setSuppliers, setSellerZoopPlan2, setFees, selectedPlan, supplier, suppliers)
    const person = suppliers.find(storeowner => storeowner.name === localStorage.getItem('sellerName'))
    if (person) {
      setSupplier(person)
      if (person.sellerZoopPlan) setAllPlans(Object.keys(person.sellerZoopPlan).filter(item => item !== 'activePlan'))
      else {
        setAllPlans([''])
        setSelectedPlan('')
      }
    }
  }, [])
  useEffect(() => {
    fetch(setIsLoading, setErrorLoading, setSuppliers, setSellerZoopPlan2, setFees, selectedPlan, supplier, suppliers)
    const person = suppliers.find(storeowner => storeowner.name === localStorage.getItem('sellerName'))
    if (person) {
      setSupplier(person)
      let activePlan = 'Nenhum plano ativo'
      const { sellerZoopPlan } = supplier
      if (sellerZoopPlan && Object.prototype.hasOwnProperty.call(sellerZoopPlan, 'activePlan'))
        activePlan = settingActivePlan || supplier.sellerZoopPlan.activePlan || 'Nenhum plano ativo'
      if (supplier.name) setBlocks(mountBlock(supplier.name, supplier.reason, activePlan, Object.keys(sellerZoopPlan2)))
      if (person.sellerZoopPlan) setAllPlans(Object.keys(person.sellerZoopPlan).filter(item => item !== 'activePlan'))
      else {
        setAllPlans([''])
        setSelectedPlan('')
      }
    }
  }, [supplier, settingActivePlan])
  // console.log(supplier)
  const { sellerZoopPlan } = supplier
  if (
    supplier.name &&
    blocks.length === 0 &&
    Object.prototype.hasOwnProperty.call(supplier, 'sellerZoopPlan') &&
    sellerZoopPlan !== null &&
    Object.prototype.hasOwnProperty.call(sellerZoopPlan, 'activePlan')
  ) {
    setBlocks(
      mountBlock(
        supplier.name,
        supplier.reason,
        settingActivePlan || supplier.sellerZoopPlan.activePlan || 'Nenhum plano ativo',
        Object.keys(sellerZoopPlan2),
      ),
    )
  } else if (supplier.name && blocks.length === 0) {
    setBlocks(mountBlock(supplier.name, supplier.reason, 'Nenhum plano ativo'))
  }
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
              localStorage.setItem('sellerName', person.name)
              localStorage.setItem('sellerObject', JSON.stringify(person))
              // console.log('person', person)
              // if (person.sellerZoopPlan) setAllPlans(Object.keys(person.sellerZoopPlan).filter(item => item !== 'activePlan'))
              setSupplier(person)
            } else {
              clear()
              localStorage.removeItem('sellerName')
              localStorage.removeItem('selectedPlan')
              localStorage.removeItem('sellerObject')
            }
          } else {
            localStorage.removeItem('sellerName')
            localStorage.removeItem('selectedPlan')
            localStorage.removeItem('sellerObject')
            setSearchedName('')
            setSelectedPlan('')
            clear()
          }
        }}
        onChangeKeyboard={element => {
          if (element) {
            setSearchedName(element.value)
            const person = suppliers.find(storeowner => storeowner.name === element.value)
            if (person) {
              // console.log('person', person)
              setSupplier(person)
              localStorage.setItem('sellerName', person.name)
              localStorage.setItem('sellerObject', JSON.stringify(person))
              if (person.sellerZoopPlan) setAllPlans(Object.keys(person.sellerZoopPlan).filter(item => item !== 'activePlan'))
              else {
                setAllPlans([''])
                setSelectedPlan('')
              }
            } else {
              clear()
              localStorage.removeItem('sellerName')
              localStorage.removeItem('selectedPlan')
              localStorage.removeItem('sellerObject')
            }
          } else {
            clear()
            setSearchedName('')
            setSelectedPlan('')
            localStorage.removeItem('selectedPlan')
            localStorage.removeItem('sellerName')
            localStorage.removeItem('sellerObject')
          }
        }}
        list={suppliers.map(supplier => supplier.name).sort()}
        placeholder="Escolha o fabricante"
      />
      {searchedName && <Details blocks={blocks} />}

      <Dropdown
        value={selectedPlan}
        onChange={({ target: { value } }) => {
          if (value.includes(' ')) {
            const newValue = value.replace(/\s/g, '')
            setSelectedPlan(newValue)
            localStorage.setItem('selectedPlan', newValue)
          } else {
            setSelectedPlan(value)
            localStorage.setItem('selectedPlan', value)
          }
        }}
        onChangeKeyboard={element => {
          if (element && element.value === '') {
            const newValue = element.value.replace(/\s/g, '')
            setSelectedPlan(newValue)
            localStorage.setItem('selectedPlan', newValue)
          } else if (element) {
            setSelectedPlan(element.value)
            localStorage.setItem('selectedPlan', element.value)
          }
        }}
        // readOnly
        list={sellerZoopPlan2 ? Object.keys(sellerZoopPlan2).filter(item => item !== 'activePlan') : ['']}
        placeholder="Escolha o plano ou adicione um"
      />

      <div style={wrapper}>
        <div style={{ width: '50%', padding: '0px 0px 0px 0px' }}>
          <Button
            type="button"
            cta="Editar Antifraude"
            template="regular"
            submitting={!selectedPlan || !Object.keys(sellerZoopPlan2).includes(selectedPlan)}
            click={() => {
              // console.log(fee)
              // setFeesUpdate(fee)
              setLocation(`/atualizar-plano-zoop/${supplier.docId}/ziroAntifraudFee/${selectedPlan}`)
            }}
          />
        </div>
        <div style={{ width: '50%', padding: '0px 0px 0px 0px' }}>
          <Button
            type="button"
            cta="Editar Markup"
            template="regular"
            submitting={!selectedPlan || !Object.keys(sellerZoopPlan2).includes(selectedPlan)}
            click={() => {
              // console.log(fee)
              // setFeesUpdate(fee)
              setLocation(`/atualizar-plano-zoop/${supplier.docId}/ziroMarkupFee/${selectedPlan}`)
            }}
          />
        </div>
      </div>

      <Button
        type="button"
        cta="Adicionar novo plano"
        template="regular"
        submitting={selectedPlan === '' || !supplier.docId || Object.keys(sellerZoopPlan2).includes(selectedPlan)}
        click={() => {
          // setLocation(`/atualizar-plano-zoop/${supplier.docId}/newPlan`)
          if (sellerZoopPlan2 === null || !Object.keys(sellerZoopPlan2).includes(selectedPlan)) {
            let sellerZoopPlanForFirebase = sellerZoopPlan2
            const defaultValue = 'standard'
            if (sellerZoopPlan2 !== null) {
              sellerZoopPlanForFirebase[selectedPlan] = {}
              sellerZoopPlanForFirebase[selectedPlan] = defaultValues
            } else {
              sellerZoopPlanForFirebase = {}
              sellerZoopPlanForFirebase[selectedPlan] = defaultValues
            }
            // sellerZoopPlan2[defaultValue] // defaultValuesForNewPlanWithNumber
            // console.log('teste 2', sellerZoopPlanForFirebase.teste2)
            // console.log(sellerZoopPlanForFirebase, nickname, supplier.docId)
            createNewPlan && Object.keys(sellerZoopPlanForFirebase).length !== 0
              ? createNewPlan(sellerZoopPlanForFirebase, nickname, supplier.docId)
              : () => null
          }
        }}
      />

      <Button
        type="button"
        cta="Ativar plano selecionado"
        template="regular"
        submitting={selectedPlan === '' || !supplier.docId || !Object.keys(sellerZoopPlan2).includes(selectedPlan)}
        click={() => {
          // console.log(supplier.docId, selectedPlan)
          sendToBackend(state)
          // '/testando-porcentagem'
          // setLocation(`/atualizar-plano-zoop/${supplier.docId}/newPlan`)
        }}
      />

      <Button
        type="button"
        cta="Testar tarifas"
        template="regular"
        click={() => {
          setLocation(`/testando-porcentagem`)
          // localStorage.setItem('planToTestPercentages', selectedPlan)
          // '/testando-porcentagem'
          // setLocation(`/atualizar-plano-zoop/${supplier.docId}/newPlan`)
        }}
      />

      {/* supplier.docId && supplier.name && supplier.reason && selectedPlan && fees && (
        <Button
          type="button"
          cta="Editar plano"
          template="regular"
          click={() => {
            setLocation(`/atualizar-plano-zoop/${supplier.docId}/taxas/${selectedPlan}`)
            // setLocation(`/testando-porcentagem`)
            // localStorage.setItem('planToTestPercentages', selectedPlan)
            // '/testando-porcentagem'
            // setLocation(`/atualizar-plano-zoop/${supplier.docId}/newPlan`)
          }}
        />
      ) */}
      <Button
        type="button"
        cta="Excluir plano"
        template="light"
        submitting={selectedPlan === '' || !supplier.docId || !Object.keys(sellerZoopPlan2).includes(selectedPlan)}
        click={() => {
          if (selectedPlan !== sellerZoopPlan2.activePlan) setOpenModalDeletePlan(true)
          // console.log(supplier.docId, selectedPlan)
        }}
      />

      <Modal
        onClickFunction={() => deletePlan(selectedPlan)}
        openState={openModalDeletePlan}
        setOpenState={setOpenModalDeletePlan}
        states={{ selectedPlan, supplier }}
        labelText="Deseja realmente apagar o plano?"
      />
    </motion.div>
  )
}

export default memo(UpdateZoopPlan)
