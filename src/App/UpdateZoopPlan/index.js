import React, { useState, useEffect, useContext, memo } from 'react'
import { motion } from 'framer-motion'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import Details from '@bit/vitorbarbosa19.ziro.details'
import SpinnerWithDiv from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import Error from '@bit/vitorbarbosa19.ziro.error'
import Button from '@bit/vitorbarbosa19.ziro.button'
import { useLocation, useRoute } from 'wouter'
import { fontTitle } from '@ziro/theme'
import { useMessage, useMessagePromise } from '@bit/vitorbarbosa19.ziro.message-modal'
import { ZiroPromptMessage, ZiroWaitingMessage } from 'ziro-messages'
import capitalize from '@ziro/capitalize'
import ToastNotification from '../ToastNotification'
import sendToBackend from './sendToBackend'
import fetch from './fetch'
import { userContext } from '../appContext'
import { createNewPlan, translateFirebaseToFees, translateFeesToFirebase, translateFeesToZoop } from './functions'
import Modal from '../utils/Modal/Modal'
import updatePlan from './updatePlan'
import { db } from '../../Firebase'
import useRollback from '../utils/useRollback'

const UpdateZoopPlan = () => {
  const { createRollbackItem, startRollback, cleanRollback } = useRollback()
  const [blocks, setBlocks] = useState([])
  const [sellerZoopPlan2, setSellerZoopPlan2] = useState({})
  const [currentZoopFee, setCurrentZoopFee] = useState({})
  const [fees, setFees] = useState(null)
  const [selectedPlan, setSelectedPlan] = useState('')
  const [allPlans, setAllPlans] = useState('')
  const [openToast, setOpenToast] = useState(false)
  const [messageToast, setMessageToast] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingFunction, setIsLoadingFunction] = useState(false)
  const [errorLoading, setErrorLoading] = useState(false)
  const [openModalDeletePlan, setOpenModalDeletePlan] = useState(false)
  const [fetchFromSellerPlan, setFetchFromSellerPlan] = useState(false)
  const [searchedName, setSearchedName] = useState('')
  const [markupPercentage, setMarkupPercentage] = useState('')
  const [antifraudPercentage, setAntifraudPercentage] = useState('')
  const [suppliers, setSuppliers] = useState([])
  const [plansFromCurrentZoopFee, setPlansFromCurrentZoopFee] = useState([])
  const [typeOfToast, setTypeOfToast] = useState('alert')
  const [supplier, setSupplier] = useState({ docId: '', name: '', reason: '', markupPercentage: '', antifraudPercentage: '', sellerZoopPlan: '' })
  const [, setLocation] = useLocation()
  const [matchSellerId, paramsSellerId] = useRoute('/atualizar-plano-venda/:sellerId?/:fee?/:selectedPlan?')
  const { sellerId } = paramsSellerId
  const existSupplierId = supplier.docId || sellerId
  const [activePlan, setActivePlan] = useState('')
  const setPromiseMessage = useMessagePromise()
  const setMessage = useMessage()
  const { nickname } = useContext(userContext)
  const setState = {
    setAntifraudPercentage,
    setSupplier,
    setMarkupPercentage,
    setIsLoadingFunction,
    setActivePlan,
    createRollbackItem,
    startRollback,
    cleanRollback,
  }
  const state = {
    docId: supplier.docId,
    selectedPlan,
    nickname,
    sellerZoopPlan2,
    antifraudPercentage,
    supplier,
    markupPercentage,
    sellerId,
    existSupplierId,
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
            content: translateFirebaseToFees(activePlan),
          },
        ],
      },
    ]
  }
  const clear = () => {
    setAllPlans('')
    setSellerZoopPlan2({})
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
    await updatePlan(sellerZoopPlan2, nickname, supplier.docId, translateFeesToZoop(selectedPlan))
    setAllPlans(newAllPlans)
    setSelectedPlan('')
    setLocation('/atualizar-plano-venda')
    setTypeOfToast('alert')
    setMessageToast('Plano foi excluido!')
    setOpenToast(true)
    setIsLoadingFunction(false)
  }
  if (sellerId && fetchFromSellerPlan === false) {
    setFetchFromSellerPlan(true)
  }
  useEffect(() => {
    const query = db.collection('suppliers').where('tipoCadastro', '==', 'Completo')
    query.get().then(snapshot => {
      const fantasyList = []
      const suppliersFetch = []
      snapshot.forEach(sup => {
        const docId = sup.id
        const { fantasia, razao, nome, sobrenome, sellerZoopPlan, zoopId } = sup.data()
        const name = fantasia ? (fantasyList.includes(fantasia) ? capitalize(`${fantasia} - ${nome}`) : capitalize(fantasia)) : `${nome} ${sobrenome}`
        fantasyList.push(fantasia)
        suppliersFetch.push({
          docId,
          name,
          reason: razao ? capitalize(razao) : '-',
          sellerZoopPlan: sellerZoopPlan || null,
          zoopId: zoopId || null,
        })
        if (snapshot.size === suppliersFetch.length) {
          setSuppliers(suppliersFetch)
        }
      })
    }) // até aqui
  }, [])
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      await fetch(
        setIsLoading,
        setErrorLoading,
        setSuppliers,
        setSellerZoopPlan2,
        setFees,
        selectedPlan,
        supplier,
        suppliers,
        currentZoopFee,
        setCurrentZoopFee,
        setPlansFromCurrentZoopFee,
        sellerId,
      )
      if (localStorage.getItem('sellerName')) setSearchedName(localStorage.getItem('sellerName'))
      if (localStorage.getItem('selectedPlan')) setSelectedPlan(localStorage.getItem('selectedPlan'))
      if (localStorage.getItem('sellerObject')) setSupplier(JSON.parse(localStorage.getItem('sellerObject')))
      if (localStorage.getItem('sellerName')) {
        const person = localStorage.getItem('sellerName')
          ? suppliers.find(storeowner => storeowner.name.toUpperCase() === localStorage.getItem('sellerName').toUpperCase())
          : null
        if (person) {
          setSupplier(person)
          if (person.sellerZoopPlan) {
            setAllPlans(Object.keys(person.sellerZoopPlan).filter(item => item !== 'activePlan'))
            if (!allPlans.includes(localStorage.getItem('selectedPlan'))) {
              localStorage.removeItem('selectedPlan')
              setSelectedPlan('')
            }
            if (Object.prototype.hasOwnProperty.call(person.sellerZoopPlan, 'activePlan')) {
              setActivePlan(person.sellerZoopPlan.activePlan)
            }
          } else {
            setAllPlans([''])
            setSelectedPlan('')
          }
        }
      }
    }
    fetchData()
  }, [fetchFromSellerPlan])
  useEffect(() => {
    async function fetchData() {
      await fetch(
        setIsLoading,
        setErrorLoading,
        setSuppliers,
        setSellerZoopPlan2,
        setFees,
        selectedPlan,
        supplier,
        suppliers,
        currentZoopFee,
        setCurrentZoopFee,
        setPlansFromCurrentZoopFee,
        sellerId,
      )
      const person = localStorage.getItem('sellerName')
        ? suppliers.find(storeowner => storeowner.name.toUpperCase() === localStorage.getItem('sellerName').toUpperCase())
        : null
      if (person) {
        setSupplier(person)
        localStorage.setItem('sellerObject', JSON.stringify(person))
        let activePlanBlock = 'Nenhum plano ativo'
        const { sellerZoopPlan } = supplier
        if (sellerZoopPlan && Object.prototype.hasOwnProperty.call(sellerZoopPlan, 'activePlan'))
          activePlanBlock = activePlan || supplier.sellerZoopPlan.activePlan || 'Nenhum plano ativo'
        if (supplier.name) setBlocks(mountBlock(supplier.name, supplier.reason, activePlanBlock, Object.keys(sellerZoopPlan2)))
        if (person.sellerZoopPlan) setAllPlans(Object.keys(person.sellerZoopPlan).filter(item => item !== 'activePlan'))
        else {
          setAllPlans([''])
          setSelectedPlan('')
        }
      }
    }
    fetchData()
  }, [supplier, activePlan, suppliers])
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
        readOnly
        list={
          plansFromCurrentZoopFee
            ? Object.keys(plansFromCurrentZoopFee)
                .map(tax => translateFirebaseToFees(tax))
                .sort()
            : ['']
        } // Object.keys(sellerZoopPlan2).filter(item => item !== 'activePlan') : ['']}
        placeholder="Escolha ou adicione um plano"
      />
      <Button
        type="button"
        cta="Editar Taxa Antifraude"
        template="regular"
        submitting={isLoadingFunction === true || !selectedPlan || !Object.keys(sellerZoopPlan2).includes(translateFeesToFirebase(selectedPlan))}
        click={() => {
          setLocation(`/atualizar-plano-venda/${existSupplierId}/ziroAntifraudFee/${translateFeesToFirebase(selectedPlan)}`)
        }}
      />
      <Button
        type="button"
        cta="Editar Taxa Markup"
        template="regular"
        submitting={isLoadingFunction === true || !selectedPlan || !Object.keys(sellerZoopPlan2).includes(translateFeesToFirebase(selectedPlan))}
        click={() => {
          setLocation(`/atualizar-plano-venda/${existSupplierId}/ziroMarkupFee/${translateFeesToFirebase(selectedPlan)}`)
        }}
      />
      <Button
        type="button"
        cta="Editar Taxa Zoop"
        template="regular"
        submitting={isLoadingFunction === true || !selectedPlan || !Object.keys(sellerZoopPlan2).includes(translateFeesToFirebase(selectedPlan))}
        click={() => {
          setLocation(`/atualizar-plano-venda/${existSupplierId}/zoopFee/${translateFeesToFirebase(selectedPlan)}`)
        }}
      />
      <Button
        type="button"
        cta="Adicionar novo plano"
        template="regular"
        submitting={
          isLoadingFunction === true ||
          selectedPlan === '' ||
          !existSupplierId ||
          Object.keys(sellerZoopPlan2).includes(translateFeesToFirebase(selectedPlan))
        }
        click={async () => {
          if (sellerZoopPlan2 === null || !Object.keys(sellerZoopPlan2).includes(translateFeesToFirebase(selectedPlan))) {
            let sellerZoopPlanForFirebase = sellerZoopPlan2

            if (sellerZoopPlan2 !== null || sellerZoopPlan2 !== '') {
              sellerZoopPlanForFirebase[translateFeesToFirebase(selectedPlan)] = {}
              sellerZoopPlanForFirebase[translateFeesToFirebase(selectedPlan)] = plansFromCurrentZoopFee[translateFeesToFirebase(selectedPlan)]
            } else {
              sellerZoopPlanForFirebase = {}
              sellerZoopPlanForFirebase[translateFeesToFirebase(selectedPlan)] = plansFromCurrentZoopFee[translateFeesToFirebase(selectedPlan)]
            }
            if (createNewPlan && Object.keys(sellerZoopPlanForFirebase).length !== 0) {
              setIsLoadingFunction(true)
              await createNewPlan(sellerZoopPlanForFirebase, nickname, existSupplierId)
              setTypeOfToast('success')
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
          sellerZoopPlan2.activePlan === translateFeesToFirebase(selectedPlan) ||
          selectedPlan === '' ||
          !supplier.docId ||
          !Object.keys(sellerZoopPlan2).includes(translateFeesToFirebase(selectedPlan))
        }
        click={async () => {
          setIsLoadingFunction(true)
          try {
            await sendToBackend(state)
            setTypeOfToast('success')
            setMessageToast('Plano ativado!')
            setOpenToast(true)
            setIsLoadingFunction(false)
          } catch (e) {
            if (e.msg) {
              setTypeOfToast('alert')
              setMessageToast(e.msg)
              setOpenToast(true)
            } else {
              setTypeOfToast('alert')
              setMessageToast('Ocorreu um erro, contate o suporte!')
              setOpenToast(true)
            }
          }
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
        submitting={
          isLoadingFunction === true ||
          selectedPlan === '' ||
          !supplier.docId ||
          !Object.keys(sellerZoopPlan2).includes(translateFeesToFirebase(selectedPlan))
        }
        click={() => {
          if (translateFeesToFirebase(selectedPlan) !== sellerZoopPlan2.activePlan) {
            setOpenModalDeletePlan(true)
          } else {
            setTypeOfToast('warning')
            setMessageToast('Não é possivel apagar o plano ativo!')
            setOpenToast(true)
          }
        }}
      />
      <Modal
        onClickFunction={() => deletePlan(translateFeesToFirebase(selectedPlan))}
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
