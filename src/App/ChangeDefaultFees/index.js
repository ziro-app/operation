import React, { useState, useEffect, useContext, memo } from 'react'
import { motion } from 'framer-motion'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import Details from '@bit/vitorbarbosa19.ziro.details'
import SpinnerWithDiv from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import Error from '@bit/vitorbarbosa19.ziro.error'
import Button from '@bit/vitorbarbosa19.ziro.button'
import { useLocation } from 'wouter'
import { fontTitle } from '@ziro/theme'
import { useMessage, useMessagePromise } from '@bit/vitorbarbosa19.ziro.message-modal'
import { ZiroPromptMessage, ZiroWaitingMessage } from 'ziro-messages'
import ToastNotification from '../ToastNotification'
import fetch from './fetch'
import { userContext } from '../appContext'
import { translateFeesToFirebase, translateFirebaseToFees } from './functions'
import Modal from '../utils/Modal/Modal'
// import updatePlan from './updatePlan'

const ChangeDefaultFees = () => {
  const [blocks, setBlocks] = useState([])
  const [sellerZoopPlan2, setSellerZoopPlan2] = useState({})
  const [fees, setFees] = useState(null)
  const [selectedPlan, setSelectedPlan] = useState('')
  const [allPlans, setAllPlans] = useState('')
  const [openToast, setOpenToast] = useState(false)
  const [messageToast, setMessageToast] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingFunction, setIsLoadingFunction] = useState(false)
  const [errorLoading, setErrorLoading] = useState(false)
  const [openModalDeletePlan, setOpenModalDeletePlan] = useState(false)
  const [searchedName, setSearchedName] = useState('')
  const [markupPercentage, setMarkupPercentage] = useState('')
  const [antifraudPercentage, setAntifraudPercentage] = useState('')
  const [suppliers, setSuppliers] = useState([])
  const [typeOfToast, setTypeOfToast] = useState('success')
  const [supplier, setSupplier] = useState({ docId: '', name: '', reason: '', markupPercentage: '', antifraudPercentage: '', sellerZoopPlan: '' })
  const [, setLocation] = useLocation()
  const [settingActivePlan, setSettingActivePlan] = useState('')
  const setPromiseMessage = useMessagePromise()
  const setMessage = useMessage()
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
  const PromptMessage = new ZiroPromptMessage({
    name: 'promptReceivingPolicy',
    type: 'neutral',
    code: '201',
    title: 'Apagar Plano',
    userDescription: messageToast,
    userResolution: 'Deseja continuar?',
    internalDescription: 'prompt plano de venda',
    illustration: 'errorLoading',
    additionalData: undefined,
  })
  const WaitingMessage = new ZiroWaitingMessage({
    name: 'waitingReceivingPolicy',
    type: 'neutral',
    code: '202',
    title: 'Política de recebimento',
    userDescription: 'Efetuando a mudança. Aguarde enquanto finalizamos.',
    internalDescription: 'waiting política de recebimento',
    illustration: 'waiting',
    additionalData: undefined,
  })

  const SuccessMessage = new ZiroPromptMessage({
    name: 'successReceivingPolicy',
    type: 'success',
    code: '203',
    title: 'Sucesso',
    userDescription: !openToast
      ? 'Agora você receberá depósitos automáticos em sua conta bancária.'
      : 'Agora você precisará fazer resgates manuais para receber seu dinheiro.',
    userResolution: 'Clique em ok para sair.',
    internalDescription: 'prompt de sucesso',
    illustration: 'paymentSuccess',
    additionalData: undefined,
  })

  const FailureMessage = new ZiroPromptMessage({
    name: 'failureReceivingPolicy',
    type: 'destructive',
    code: '204',
    title: 'Falha',
    userDescription: 'Falha ao atualizar de política de recebimento, tente novamente.',
    userResolution: 'Clique em ok para sair.',
    internalDescription: 'prompt de falha',
    illustration: 'errorLoading',
    additionalData: undefined,
  })
  const mountBlock = (name, reason, activePlan) => {
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
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      await fetch(setIsLoading, setErrorLoading, setSuppliers, setSellerZoopPlan2, setFees, selectedPlan, supplier, suppliers)
      if (localStorage.getItem('sellerName')) setSearchedName(localStorage.getItem('sellerName'))
      if (localStorage.getItem('selectedPlanDefault')) setSelectedPlan(localStorage.getItem('selectedPlanDefault'))
      if (localStorage.getItem('sellerObject')) setSupplier(JSON.parse(localStorage.getItem('sellerObject')))
      if (localStorage.getItem('sellerName')) {
        const person = suppliers.find(storeowner => storeowner.name === localStorage.getItem('sellerName'))
        if (person) {
          setSupplier(person)
          if (person.sellerZoopPlan) {
            setAllPlans(Object.keys(person.sellerZoopPlan).filter(item => item !== 'activePlan'))
            if (!allPlans.includes(localStorage.getItem('selectedPlanDefault'))) {
              localStorage.removeItem('selectedPlanDefault')
              setSelectedPlan('')
            }
            if (Object.prototype.hasOwnProperty.call(person.sellerZoopPlan, 'activePlan')) {
              setSettingActivePlan(person.sellerZoopPlan.activePlan)
            }
          } else {
            setAllPlans([''])
            setSelectedPlan('')
          }
        }
      }
    }
    fetchData()
  }, [])
  useEffect(() => {
    async function fetchData() {
      await fetch(setIsLoading, setErrorLoading, setSuppliers, setSellerZoopPlan2, setFees, selectedPlan, supplier, suppliers)

      let activePlan = 'Nenhum plano ativo'
      const { sellerZoopPlan } = supplier
      if (sellerZoopPlan && Object.prototype.hasOwnProperty.call(sellerZoopPlan, 'activePlan'))
        activePlan = settingActivePlan || supplier.sellerZoopPlan.activePlan || 'Nenhum plano ativo'
      if (supplier.name) setBlocks(mountBlock(supplier.name, supplier.reason, activePlan, Object.keys(sellerZoopPlan2)))
    }
    fetchData()
  }, [supplier, settingActivePlan, suppliers])
  const asyncClick = React.useCallback(async planName => {
    try {
      await setPromiseMessage(PromptMessage)
      const promise = deletePlan(planName)
      setMessage(WaitingMessage.withPromise(promise))
      const result = await promise
      setMessage(result ? SuccessMessage : FailureMessage)
    } catch (error) {}
  }, [])
  if (isLoading) return <SpinnerWithDiv size="5rem" />
  if (errorLoading) return <Error />
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'grid', gridTemplateRows: 'auto 1fr auto', gridRowGap: '20px' }}>
      <ToastNotification openToastRoot={openToast} setOpenToastRoot={setOpenToast} messageToastRoot={messageToast} type={typeOfToast} />

      <Dropdown
        value={selectedPlan}
        submitting={isLoadingFunction === true}
        onChange={({ target: { value } }) => {
          if (value.includes(' ')) {
            const newValue = value.replace(/\s/g, '')
            setSelectedPlan(newValue)
            localStorage.setItem('selectedPlanDefault', newValue)
          } else {
            setSelectedPlan(value)
            localStorage.setItem('selectedPlanDefault', value)
          }
        }}
        readOnly
        onChangeKeyboard={element => {
          if (element && element.value === '') {
            const newValue = element.value.replace(/\s/g, '')
            setSelectedPlan(newValue)
            localStorage.setItem('selectedPlanDefault', newValue)
          } else if (element) {
            setSelectedPlan(element.value)
            localStorage.setItem('selectedPlanDefault', element.value)
          }
        }}
        list={sellerZoopPlan2 ? Object.keys(sellerZoopPlan2).map(tax => translateFirebaseToFees(tax)) : ['']}
        placeholder="Escolha ou adicione um plano"
      />
      <Button
        type="button"
        cta="Editar Taxa Antifraude Padrão"
        template="regular"
        submitting={isLoadingFunction === true || !selectedPlan || !Object.keys(sellerZoopPlan2).includes(translateFeesToFirebase(selectedPlan))}
        click={() => {
          setLocation(`/alterar-tarifas-padrao/ziroAntifraudFee/${translateFeesToFirebase(selectedPlan)}`)
        }}
      />
      <Button
        type="button"
        cta="Editar Taxa Markup Padrão"
        template="regular"
        submitting={isLoadingFunction === true || !selectedPlan || !Object.keys(sellerZoopPlan2).includes(translateFeesToFirebase(selectedPlan))}
        click={() => {
          setLocation(`/alterar-tarifas-padrao/ziroMarkupFee/${translateFeesToFirebase(selectedPlan)}`)
        }}
      />
      <Button
        type="button"
        cta="Editar Taxa Zoop Padrão"
        template="regular"
        submitting={isLoadingFunction === true || !selectedPlan || !Object.keys(sellerZoopPlan2).includes(translateFeesToFirebase(selectedPlan))}
        click={() => {
          setLocation(`/alterar-tarifas-padrao/zoopFee/${translateFeesToFirebase(selectedPlan)}`)
        }}
      />
      {isLoadingFunction && (
        <div
          style={{
            position: 'fixed',
            zIndex: '9999',
            maxWidth: '450px',
            display: 'block',
            width: '90%',
            margin: 'auto auto 0',
            padding: '400px 0px',
          }}
        >
          <SpinnerWithDiv size="5rem" />
        </div>
      )}
    </motion.div>
  )
}

export default memo(ChangeDefaultFees)
