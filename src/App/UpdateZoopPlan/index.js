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
import sendToBackend from './sendToBackend'
import fetch from './fetch'
import { userContext } from '../appContext'
import { defaultValues, createNewPlan } from './functions'
import Modal from '../utils/Modal/Modal'
import updatePlan from './updatePlan'

const UpdateZoopPlan = () => {
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
  const [typeOfToast, setTypeOfToast] = useState('alert')
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
  const deletePlan = async planName => {
    setIsLoadingFunction(true)
    const newAllPlans = allPlans
    delete sellerZoopPlan2[planName]
    const index = newAllPlans.indexOf(planName)
    if (index > -1) {
      newAllPlans.splice(index)
    }
    localStorage.removeItem('selectedPlan')
    setOpenModalDeletePlan(false)
    await updatePlan(sellerZoopPlan2, nickname, supplier.docId)
    setAllPlans(newAllPlans)
    setSelectedPlan('')
    setLocation('/atualizar-plano-venda')
    setTypeOfToast('alert')
    setMessageToast('Plano foi excluido!')
    setOpenToast(true)
    setIsLoadingFunction(false)
  }
  useEffect(() => {
    if (localStorage.getItem('sellerName')) setSearchedName(localStorage.getItem('sellerName'))
    if (localStorage.getItem('selectedPlan')) setSelectedPlan(localStorage.getItem('selectedPlan'))
    if (localStorage.getItem('sellerObject')) setSupplier(JSON.parse(localStorage.getItem('sellerObject')))
    if (localStorage.getItem('sellerName')) {
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
        value={searchedName}
        submitting={isLoadingFunction === true}
        onChange={({ target: { value } }) => {
          if (value !== '') {
            setSearchedName(value)
            const person = suppliers.find(element => element.name === value)
            if (person) {
              localStorage.setItem('sellerName', person.name)
              localStorage.setItem('sellerObject', JSON.stringify(person))
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
        submitting={isLoadingFunction === true}
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
        list={sellerZoopPlan2 ? Object.keys(sellerZoopPlan2).filter(item => item !== 'activePlan') : ['']}
        placeholder="Escolha ou adicione um plano"
      />
      <Button
        type="button"
        cta="Editar Taxa Antifraude"
        template="regular"
        submitting={isLoadingFunction === true || !selectedPlan || !Object.keys(sellerZoopPlan2).includes(selectedPlan)}
        click={() => {
          setLocation(`/atualizar-plano-venda/${supplier.docId}/ziroAntifraudFee/${selectedPlan}`)
        }}
      />
      <Button
        type="button"
        cta="Editar Taxa Markup"
        template="regular"
        submitting={isLoadingFunction === true || !selectedPlan || !Object.keys(sellerZoopPlan2).includes(selectedPlan)}
        click={() => {
          setLocation(`/atualizar-plano-venda/${supplier.docId}/ziroMarkupFee/${selectedPlan}`)
        }}
      />
      <Button
        type="button"
        cta="Editar Taxa Zoop"
        template="regular"
        submitting={isLoadingFunction === true || !selectedPlan || !Object.keys(sellerZoopPlan2).includes(selectedPlan)}
        click={() => {
          setLocation(`/atualizar-plano-venda/${supplier.docId}/zoopFee/${selectedPlan}`)
        }}
      />
      <Button
        type="button"
        cta="Adicionar novo plano"
        template="regular"
        submitting={isLoadingFunction === true || selectedPlan === '' || !supplier.docId || Object.keys(sellerZoopPlan2).includes(selectedPlan)}
        click={async () => {
          if (sellerZoopPlan2 === null || !Object.keys(sellerZoopPlan2).includes(selectedPlan)) {
            let sellerZoopPlanForFirebase = sellerZoopPlan2

            if (sellerZoopPlan2 !== null) {
              sellerZoopPlanForFirebase[selectedPlan] = {}
              sellerZoopPlanForFirebase[selectedPlan] = defaultValues
            } else {
              sellerZoopPlanForFirebase = {}
              sellerZoopPlanForFirebase[selectedPlan] = defaultValues
            }
            if (createNewPlan && Object.keys(sellerZoopPlanForFirebase).length !== 0) {
              setIsLoadingFunction(true)
              await createNewPlan(sellerZoopPlanForFirebase, nickname, supplier.docId)
              setTypeOfToast('alert')
              setMessageToast('Plano criado!')
              setOpenToast(true)
              setIsLoadingFunction(false)
            } else {
              setTypeOfToast('warning')
              setMessageToast('Não é possivel adicionar um plano que já exista!')
              setOpenToast(true)
              return () => null
            }
          } else {
            setTypeOfToast('warning')
            setMessageToast('Não é possivel adicionar um plano que já exista!')
            setOpenToast(true)
          }
        }}
      />
      <Button
        type="button"
        cta="Ativar plano selecionado"
        template="regular"
        submitting={
          isLoadingFunction === true ||
          settingActivePlan === selectedPlan ||
          selectedPlan === '' ||
          !supplier.docId ||
          !Object.keys(sellerZoopPlan2).includes(selectedPlan)
        }
        click={async () => {
          setIsLoadingFunction(true)
          await sendToBackend(state)
          setTypeOfToast('alert')
          setMessageToast('Plano ativado!')
          setOpenToast(true)
          setIsLoadingFunction(false)
        }}
      />
      <Button
        type="button"
        cta="Testar tarifas do plano"
        template="regular"
        submitting={isLoadingFunction === true}
        click={() => {
          setLocation(`/testar-tarifas`)
        }}
      />
      <Button
        type="button"
        cta="Excluir plano"
        template="light"
        submitting={isLoadingFunction === true || selectedPlan === '' || !supplier.docId || !Object.keys(sellerZoopPlan2).includes(selectedPlan)}
        click={() => {
          if (selectedPlan !== sellerZoopPlan2.activePlan) {
            setOpenModalDeletePlan(true)
          } else {
            setTypeOfToast('warning')
            setMessageToast('Não é possivel apagar o plano ativo!')
            setOpenToast(true)
          }
        }}
      />
      <Modal
        onClickFunction={() => deletePlan(selectedPlan)}
        openState={openModalDeletePlan}
        setOpenState={setOpenModalDeletePlan}
        states={{ selectedPlan, supplier }}
        labelText="Deseja realmente apagar o plano?"
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

export default memo(UpdateZoopPlan)
