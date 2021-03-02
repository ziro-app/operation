import React, { memo, useEffect, useState, useContext } from 'react'
import Error from '@bit/vitorbarbosa19.ziro.error'
import Header from '@bit/vitorbarbosa19.ziro.header'
import { containerWithPadding } from '@ziro/theme'
import { motion } from 'framer-motion'
import { useLocation, useRoute } from 'wouter'
import InputText from '@bit/vitorbarbosa19.ziro.input-text'
import InputPercentage2 from '@bit/vitorbarbosa19.ziro.input-percentage'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import Button from '@bit/vitorbarbosa19.ziro.button'
import { useForm } from 'react-hook-form'
import Details from '@bit/vitorbarbosa19.ziro.details'
import SpinnerWithDiv from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import InputPercentage from './InputPercentage/index'
import { returnInstallmentsWithFee, translateFees, translateInstallments, translateTaxes } from './functions'
import fetch from './fetch'
import { wrapper, item, content, cardTitle } from './styles'
import sendToBackend from './sendToBackend'
import { userContext } from '../../appContext'
import { db } from '../../../Firebase'
import ToastNotification from '../../ToastNotification'

const UpdateDefaulTax = () => {
  const { nickname } = useContext(userContext)

  const [countLoop, setCountLoop] = useState(0)
  const [blocks, setBlocks] = useState([])
  const [sellerZoopPlan, setSellerZoopPlan] = useState({})
  const [sellerZoopPlanObject, setSellerZoopPlanObject] = useState({})
  const [sellerZoopPlanForFirebase, setSellerZoopPlanForFirebase] = useState({})
  const [sellerActualZoopPlanForFirebase, setActualZoopPlanForFirebase] = useState({})
  const [otherPlansForFirebase, setOtherPlansForFirebase] = useState({})
  const [selectedPlanForFirebase, setSelectedPlanForFirebase] = useState('')
  const [typeOfToast, setTypeOfToast] = useState('success')
  const [isLoading, setIsLoading] = useState(true)
  const [openToast, setOpenToast] = useState(false)
  const [messageToast, setMessageToast] = useState('')
  const [fees, setFees] = useState(null)
  const [, setLocation] = useLocation()
  const [nothing, setNothing] = useState(false)
  const [supplier, setSupplier] = useState({ docId: '', name: '', reason: '', markupPercentage: '', antifraudPercentage: '', sellerZoopPlan: '' })
  const [error, setError] = useState(false)
  const [matchSellerId, paramsSellerId] = useRoute('/alterar-tarifas-padrao/:fee?/:selectedPlan?')

  const { selectedPlan, fee } = paramsSellerId
  let newPlan = {}
  useEffect(() => {
    if (countLoop < 4) {
      const newCount = countLoop + 1
      setCountLoop(newCount)
      if (selectedPlan !== selectedPlanForFirebase) {
        setSelectedPlanForFirebase(selectedPlan)
      }
      setNothing(false)

      async function getFee(setSellerZoopPlan, setFees, selectedPlanForFirebase, fees, setIsLoading) {
        await fetch(setSellerZoopPlan, setFees, selectedPlanForFirebase, fees, setIsLoading)
      }

      getFee(setSellerZoopPlan, setFees, selectedPlanForFirebase, fees, setIsLoading)
    }
  }, [fee, error, selectedPlanForFirebase])

  const state = {
    sellerZoopPlanForFirebase,
    fee,
    setSellerZoopPlanForFirebase,
    nickname,
    selectedPlan,
    sellerZoopPlan,
    otherPlansForFirebase,
    sellerActualZoopPlanForFirebase,
    setMessageToast,
    setOpenToast,
    setTypeOfToast,
  }
  if (isLoading || fee === null) return <SpinnerWithDiv size="5rem" />
  if (typeof fee !== 'undefined') {
    if (nothing || (Object.keys(fee).length === 0 && fee.constructor === Object)) {
      return (
        <Error
          message="Taxa inválida ou não encontrada, retorne e tente novamente."
          type="noData"
          title="Erro ao buscar detalhes da transação"
          backRoute="/atualizar-plano-venda"
          backRouteFunction={route => {
            setLocation(route)
          }}
        />
      )
    }
  }
  const order = { mastercard: 1, visa: 2, elo: 3, americanexpress: 4, hipercard: 5, default: 1000 }
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={containerWithPadding}>
      <ToastNotification openToastRoot={openToast} setOpenToastRoot={setOpenToast} messageToastRoot={messageToast} type={typeOfToast} />
      <Header
        type="icon-link"
        title={`Editar ${translateTaxes(selectedPlan)} ${translateFees(fee)}`}
        navigateTo="/alterar-tarifas-padrao"
        icon="back"
      />
      {supplier.fantasia && <Details blocks={blocks} />}
      <div style={{ marginTop: '35px' }}>
        {fees !== null &&
          fees.map(
            feeMap =>
              feeMap[0] === fee && (
                <div key={feeMap[0]} style={wrapper}>
                  {Object.entries(feeMap[1])
                    .sort(function (a, b) {
                      return (order[a[0]] || order.default) - (order[b[0]] || order.default)
                    })
                    .map(card => (
                      <div key={card} style={item}>
                        <div key={card} style={cardTitle}>
                          {card[0].toUpperCase()}
                        </div>
                        <div>
                          {returnInstallmentsWithFee(card).map(item => (
                            <div key={item} style={content}>
                              <label
                                style={{
                                  paddingBottom: '20px',
                                  width: '25px',
                                }}
                              >{`${translateInstallments(item.split(' ')[0])} `}</label>

                              <FormInput
                                key={item}
                                label=""
                                name="percentage"
                                input={
                                  card[0].toUpperCase() === 'AMERICANEXPRESS' && item.split(' ')[0] === 'installment0' ? (
                                    <InputPercentage
                                      disabled
                                      id={`${card[0]}${item.split(' ')[0]}${item.split(' ')[1]}${item.split(' ')[2]}`}
                                      value={sellerZoopPlanObject[`${card[0]}${item.split(' ')[0]}${item.split(' ')[1]}${item.split(' ')[2]}`]}
                                      setValue={setSellerZoopPlanObject}
                                      defaultValue={item.split(' ')[2] || ''}
                                    />
                                  ) : (
                                    <InputPercentage
                                      id={`${card[0]}${item.split(' ')[0]}${item.split(' ')[1]}${item.split(' ')[2]}`}
                                      value={sellerZoopPlanObject[`${card[0]}${item.split(' ')[0]}${item.split(' ')[1]}${item.split(' ')[2]}`]}
                                      setValue={setSellerZoopPlanObject}
                                      defaultValue={item.split(' ')[2] || ''}
                                    />
                                  )
                                }
                              />
                            </div>
                          ))}
                        </div>
                        <br />
                      </div>
                    ))}
                </div>
              ),
          )}
      </div>
      <Button
        type="button"
        cta={`Atualizar ${translateFees(fee)}`}
        template="regular"
        click={() => {
          fees.map(
            feeMap =>
              feeMap[0] === fee &&
              // eslint-disable-next-line array-callback-return
              Object.entries(feeMap[1]).map(card => {
                // eslint-disable-next-line array-callback-return
                Object.entries(sellerZoopPlanObject).map(installment => {
                  const actualInstallment = installment[0].split(card[0])[1]
                    ? installment[0].split(card[0])[1].split(':')[0]
                    : installment[0].split(card[0])[1]
                  let actualInstallmentPercentage = installment[1] // ? parseFloat(installment[1]) / 100 : installment[1]
                  if (!actualInstallmentPercentage) actualInstallmentPercentage = 0
                  const actualCard = card[0]
                  // console.log('actualInstallment,actualInstallmentPercentage', actualInstallment, actualInstallmentPercentage)
                  if ((actualInstallment && actualInstallmentPercentage) || (actualInstallment && actualInstallmentPercentage === 0)) {
                    // console.log('actualInstallment,actualInstallmentPercentage', actualInstallment, actualInstallmentPercentage)
                    const newItem = sellerZoopPlanForFirebase
                    // newItem[actualCard] = {}
                    if (!Object.prototype.hasOwnProperty.call(newItem, actualCard)) newItem[actualCard] = {}
                    newItem[actualCard][actualInstallment] = actualInstallmentPercentage
                    setSellerZoopPlanForFirebase(prevState => ({ ...prevState, ...newItem }))
                    const newZoopPlan = sellerZoopPlan
                    newZoopPlan[selectedPlan][fee] = sellerZoopPlanForFirebase
                    setActualZoopPlanForFirebase(newZoopPlan)
                    newPlan = newZoopPlan
                  }
                })
              }),
          )
          // console.log('contador de length', Object.keys(sellerActualZoopPlanForFirebase).length)
          // console.log('newPlan', newPlan)
          if (sendToBackend && Object.keys(newPlan).length !== 0) {
            sendToBackend(state, newPlan)
          } else {
            return () => null
          }
        }}
      />
    </motion.div>
  )
}

export default memo(UpdateDefaulTax)
