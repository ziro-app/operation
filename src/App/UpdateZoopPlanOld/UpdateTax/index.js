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
import InputPercentage from './InputPercentage/index'
import { returnInstallmentsWithFee, translateFees, translateInstallments, testInstallments } from './functions'
import fetch from './fetch'
import { wrapper, item, content, title, item2 } from './styles'
import sendToBackend from './sendToBackend'
import { userContext } from '../../appContext'
import { db } from '../../../Firebase'

const UpdateTax = ({ fee, setFee }) => {
  const defaultValues = {
    activePlan: 'standard',
    standard: {
      zoopFee: {
        mastercard: {
          installment1: 2,
          installment2: 3,
          installment3: 4,
          installment4: 4,
          installment5: 4,
          installment6: 4,
          installment7: 4,
          installment8: 4,
          installment9: 4,
          installment10: 4,
          installment11: 4,
          installment12: 4,
          debit: 1.5,
        },
        visa: {
          installment1: 2,
          installment2: 3,
          installment3: 4,
          installment4: 4,
          installment5: 4,
          installment6: 4,
          installment7: 4,
          installment8: 4,
          installment9: 4,
          installment10: 4,
          installment11: 4,
          installment12: 4,
          debit: 1.5,
        },
        elo: {
          installment1: 2,
          installment2: 3,
          installment3: 4,
          installment4: 4,
          installment5: 4,
          installment6: 4,
          installment7: 4,
          installment8: 4,
          installment9: 4,
          installment10: 4,
          installment11: 4,
          installment12: 4,
          debit: 1.5,
        },
        americanexpress: {
          installment1: 2,
          installment2: 3,
          installment3: 4,
          installment4: 4,
          installment5: 4,
          installment6: 4,
          installment7: 4,
          installment8: 4,
          installment9: 4,
          installment10: 4,
          installment11: 4,
          installment12: 4,
          debit: 1.5,
        },
        hipercard: {
          installment1: 2,
          installment2: 3,
          installment3: 4,
          installment4: 4,
          installment5: 4,
          installment6: 4,
          installment7: 4,
          installment8: 4,
          installment9: 4,
          installment10: 4,
          installment11: 4,
          installment12: 4,
          debit: 1.5,
        },
      },
      ziroMarkupFee: {
        mastercard: {
          installment1: 2,
          installment2: 3,
          installment3: 4,
          installment4: 4,
          installment5: 4,
          installment6: 4,
          installment7: 4,
          installment8: 4,
          installment9: 4,
          installment10: 4,
          installment11: 4,
          installment12: 4,
          debit: 1.5,
        },

        visa: {
          installment1: 2,
          installment2: 3,
          installment3: 4,
          installment4: 4,
          installment5: 4,
          installment6: 4,
          installment7: 4,
          installment8: 4,
          installment9: 4,
          installment10: 4,
          installment11: 4,
          installment12: 4,
          debit: 1.5,
        },
        elo: {
          installment1: 2,
          installment2: 3,
          installment3: 4,
          installment4: 4,
          installment5: 4,
          installment6: 4,
          installment7: 4,
          installment8: 4,
          installment9: 4,
          installment10: 4,
          installment11: 4,
          installment12: 4,
          debit: 1.5,
        },
        americanexpress: {
          installment1: 2,
          installment2: 3,
          installment3: 4,
          installment4: 4,
          installment5: 4,
          installment6: 4,
          installment7: 4,
          installment8: 4,
          installment9: 4,
          installment10: 4,
          installment11: 4,
          installment12: 4,
          debit: 1.5,
        },
        hipercard: {
          installment1: 2,
          installment2: 3,
          installment3: 4,
          installment4: 4,
          installment5: 4,
          installment6: 4,
          installment7: 4,
          installment8: 4,
          installment9: 4,
          installment10: 4,
          installment11: 4,
          installment12: 4,
          debit: 1.5,
        },
      },
      ziroAntifraudFee: {
        mastercard: {
          installment1: 2,
          installment2: 3,
          installment3: 4,
          installment4: 4,
          installment5: 4,
          installment6: 4,
          installment7: 4,
          installment8: 4,
          installment9: 4,
          installment10: 4,
          installment11: 4,
          installment12: 4,
          debit: 1.5,
        },
        visa: {
          installment1: 2,
          installment2: 3,
          installment3: 4,
          installment4: 4,
          installment5: 4,
          installment6: 4,
          installment7: 4,
          installment8: 4,
          installment9: 4,
          installment10: 4,
          installment11: 4,
          installment12: 4,
          debit: 1.5,
        },
        elo: {
          installment1: 2,
          installment2: 3,
          installment3: 4,
          installment4: 4,
          installment5: 4,
          installment6: 4,
          installment7: 4,
          installment8: 4,
          installment9: 4,
          installment10: 4,
          installment11: 4,
          installment12: 4,
          debit: 1.5,
        },
        americanexpress: {
          installment1: 2,
          installment2: 3,
          installment3: 4,
          installment4: 4,
          installment5: 4,
          installment6: 4,
          installment7: 4,
          installment8: 4,
          installment9: 4,
          installment10: 4,
          installment11: 4,
          installment12: 4,
          debit: 1.5,
        },
        hipercard: {
          installment1: 2,
          installment2: 3,
          installment3: 4,
          installment4: 4,
          installment5: 4,
          installment6: 4,
          installment7: 4,
          installment8: 4,
          installment9: 4,
          installment10: 4,
          installment11: 4,
          installment12: 4,
          debit: 1.5,
        },
      },
    },
    financedD30: {
      zoopFee: {
        mastercard: {
          installment1: 2,
          installment2: 3,
          installment3: 4,
          installment4: 4,
          installment5: 4,
          installment6: 4,
          installment7: 4,
          installment8: 4,
          installment9: 4,
          installment10: 4,
          installment11: 4,
          installment12: 4,
          debit: 1.5,
        },
        visa: {
          installment1: 2,
          installment2: 3,
          installment3: 4,
          installment4: 4,
          installment5: 4,
          installment6: 4,
          installment7: 4,
          installment8: 4,
          installment9: 4,
          installment10: 4,
          installment11: 4,
          installment12: 4,
          debit: 1.5,
        },
        elo: {
          installment1: 2,
          installment2: 3,
          installment3: 4,
          installment4: 4,
          installment5: 4,
          installment6: 4,
          installment7: 4,
          installment8: 4,
          installment9: 4,
          installment10: 4,
          installment11: 4,
          installment12: 4,
          debit: 1.5,
        },
        americanexpress: {
          installment1: 2,
          installment2: 3,
          installment3: 4,
          installment4: 4,
          installment5: 4,
          installment6: 4,
          installment7: 4,
          installment8: 4,
          installment9: 4,
          installment10: 4,
          installment11: 4,
          installment12: 4,
          debit: 1.5,
        },
        hipercard: {
          installment1: 2,
          installment2: 3,
          installment3: 4,
          installment4: 4,
          installment5: 4,
          installment6: 4,
          installment7: 4,
          installment8: 4,
          installment9: 4,
          installment10: 4,
          installment11: 4,
          installment12: 4,
          debit: 1.5,
        },
      },
      ziroMarkupFee: {
        mastercard: {
          installment1: 2,
          installment2: 3,
          installment3: 4,
          installment4: 4,
          installment5: 4,
          installment6: 4,
          installment7: 4,
          installment8: 4,
          installment9: 4,
          installment10: 4,
          installment11: 4,
          installment12: 4,
          debit: 1.5,
        },

        visa: {
          installment1: 2,
          installment2: 3,
          installment3: 4,
          installment4: 4,
          installment5: 4,
          installment6: 4,
          installment7: 4,
          installment8: 4,
          installment9: 4,
          installment10: 4,
          installment11: 4,
          installment12: 4,
          debit: 1.5,
        },
        elo: {
          installment1: 2,
          installment2: 3,
          installment3: 4,
          installment4: 4,
          installment5: 4,
          installment6: 4,
          installment7: 4,
          installment8: 4,
          installment9: 4,
          installment10: 4,
          installment11: 4,
          installment12: 4,
          debit: 1.5,
        },
        americanexpress: {
          installment1: 2,
          installment2: 3,
          installment3: 4,
          installment4: 4,
          installment5: 4,
          installment6: 4,
          installment7: 4,
          installment8: 4,
          installment9: 4,
          installment10: 4,
          installment11: 4,
          installment12: 4,
          debit: 1.5,
        },
        hipercard: {
          installment1: 2,
          installment2: 3,
          installment3: 4,
          installment4: 4,
          installment5: 4,
          installment6: 4,
          installment7: 4,
          installment8: 4,
          installment9: 4,
          installment10: 4,
          installment11: 4,
          installment12: 4,
          debit: 1.5,
        },
      },
      ziroAntifraudFee: {
        mastercard: {
          installment1: 2,
          installment2: 3,
          installment3: 4,
          installment4: 4,
          installment5: 4,
          installment6: 4,
          installment7: 4,
          installment8: 4,
          installment9: 4,
          installment10: 4,
          installment11: 4,
          installment12: 4,
          debit: 1.5,
        },
        visa: {
          installment1: 2,
          installment2: 3,
          installment3: 4,
          installment4: 4,
          installment5: 4,
          installment6: 4,
          installment7: 4,
          installment8: 4,
          installment9: 4,
          installment10: 4,
          installment11: 4,
          installment12: 4,
          debit: 1.5,
        },
        elo: {
          installment1: 2,
          installment2: 3,
          installment3: 4,
          installment4: 4,
          installment5: 4,
          installment6: 4,
          installment7: 4,
          installment8: 4,
          installment9: 4,
          installment10: 4,
          installment11: 4,
          installment12: 4,
          debit: 1.5,
        },
        americanexpress: {
          installment1: 2,
          installment2: 3,
          installment3: 4,
          installment4: 4,
          installment5: 4,
          installment6: 4,
          installment7: 4,
          installment8: 4,
          installment9: 4,
          installment10: 4,
          installment11: 4,
          installment12: 4,
          debit: 1.5,
        },
        hipercard: {
          installment1: 2,
          installment2: 3,
          installment3: 4,
          installment4: 4,
          installment5: 4,
          installment6: 4,
          installment7: 4,
          installment8: 4,
          installment9: 4,
          installment10: 4,
          installment11: 4,
          installment12: 4,
          debit: 1.5,
        },
      },
    },
  }
  const { nickname } = useContext(userContext)

  const [countLoop, setCountLoop] = useState(0)
  const [feesValues, setFeesValues] = useState({})
  const [sellerZoopPlan, setSellerZoopPlan] = useState({})
  const [sellerZoopPlanObject, setSellerZoopPlanObject] = useState({})
  const [sellerZoopPlanForFirebase, setSellerZoopPlanForFirebase] = useState({})
  const [sellerActualZoopPlanForFirebase, setActualZoopPlanForFirebase] = useState({})
  const [otherPlansForFirebase, setOtherPlansForFirebase] = useState({})
  const [selectedPlanForFirebase, setSelectedPlanForFirebase] = useState('')
  const [fees, setFees] = useState(null)
  const [, setLocation] = useLocation()
  const [nothing, setNothing] = useState(false)
  const [error, setError] = useState(false)
  const [matchSellerId, paramsSellerId] = useRoute('/atualizar-plano-zoop/:sellerId?/:fee?/:selectedPlan?')
  const { sellerId, selectedPlan } = paramsSellerId
  const { activePlan } = sellerZoopPlan
  const otherPlans = Object.entries(sellerZoopPlan).filter(item => item[0] !== selectedPlan && item[0] !== 'activePlan')
  let newPlan = {}
  useEffect(() => {
    if (countLoop < 4) {
      const newCount = countLoop + 1
      setCountLoop(newCount)
      if (selectedPlan !== selectedPlanForFirebase) {
        setSelectedPlanForFirebase(selectedPlan)
      }
      setNothing(false)

      async function getFee(setSellerZoopPlan, setFees, sellerId, defaultValues, selectedPlanForFirebase, fees) {
        await fetch(setSellerZoopPlan, setFees, sellerId, defaultValues, selectedPlanForFirebase, fees)
      }

      getFee(setSellerZoopPlan, setFees, sellerId, defaultValues, selectedPlanForFirebase, fees)
    }
  }, [fee, error, selectedPlanForFirebase])
  if (otherPlans.length > 0 && Object.keys(otherPlansForFirebase).length !== 0 && otherPlansForFirebase.constructor !== Object) {
    otherPlans.map(plan => {
      const newItem = { [plan[0]]: plan[1] }
      setOtherPlansForFirebase(prevState => ({ ...prevState, ...newItem }))
    })
  }

  const state = {
    sellerId,
    sellerZoopPlanForFirebase,
    fee,
    setSellerZoopPlanForFirebase,
    nickname,
    defaultValues,
    selectedPlan,
    activePlan,
    sellerZoopPlan,
    otherPlansForFirebase,
    sellerActualZoopPlanForFirebase,
  }

  if (nothing || (Object.keys(fee).length === 0 && fee.constructor === Object))
    return (
      <Error
        message="Taxa inválida ou não encontrada, retorne e tente novamente."
        type="noData"
        title="Erro ao buscar detalhes da transação"
        backRoute="/atualizar-plano-zoop"
        backRouteFunction={route => {
          setLocation(route)
        }}
      />
    )
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={containerWithPadding}>
      <Header type="icon-link" title={`Atualizar ${translateFees(fee)}`} navigateTo={`atualizar-plano-zoop/${sellerId}`} icon="back" />
      <div>
        {fees !== null &&
          fees.map(
            feeMap =>
              feeMap[0] === fee && (
                <div style={wrapper}>
                  {Object.entries(feeMap[1]).map(card => (
                    <div style={item}>
                      <div style={title}>Cartão: {card[0].toUpperCase()}</div>
                      <div>
                        {returnInstallmentsWithFee(card).map(item => (
                          <div style={content}>
                            <label
                              style={{
                                paddingBottom: '20px',
                              }}
                            >{`${translateInstallments(item.split(' ')[0])} `}</label>
                            {testInstallments(card, item)}
                            <FormInput
                              name="percentage"
                              input={
                                <InputPercentage
                                  id={`${card[0]}${item.split(' ')[0]}${item.split(' ')[1]}${item.split(' ')[2]}`}
                                  value={sellerZoopPlanObject[`${card[0]}${item.split(' ')[0]}${item.split(' ')[1]}${item.split(' ')[2]}`]}
                                  setValue={setSellerZoopPlanObject}
                                  defaultValue={item.split(' ')[2] || ''}
                                />
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
              Object.entries(feeMap[1]).map(card => {
                // console.log('card', card[0])
                console.log('sellerZoopPlan', sellerZoopPlan)
                Object.entries(sellerZoopPlanObject).map(installment => {
                  const actualInstallment = installment[0].split(card[0])[1]
                    ? installment[0].split(card[0])[1].split(':')[0]
                    : installment[0].split(card[0])[1]
                  const actualInstallmentPercentage = installment[1] ? parseFloat(installment[1]) / 100 : installment[1]
                  const actualCard = card[0]
                  if (actualInstallment && actualInstallmentPercentage) {
                    const newItem = sellerZoopPlanForFirebase
                    // newItem[actualCard] = {}
                    if (!Object.prototype.hasOwnProperty.call(newItem, actualCard)) newItem[actualCard] = {}
                    newItem[actualCard][actualInstallment] = parseInt(actualInstallmentPercentage)
                    setSellerZoopPlanForFirebase(prevState => ({ ...prevState, ...newItem }))
                    const newZoopPlan = sellerZoopPlan
                    newZoopPlan[selectedPlan][fee] = sellerZoopPlanForFirebase
                    setActualZoopPlanForFirebase(newZoopPlan)
                    newPlan = newZoopPlan
                  }
                })
              }),
          )
          console.log('contador de length', Object.keys(sellerActualZoopPlanForFirebase).length)
          console.log('newPlan', newPlan)
          sendToBackend && Object.keys(newPlan).length !== 0 ? sendToBackend(state, newPlan) : () => null
        }}
      />
    </motion.div>
  )
}

export default memo(UpdateTax)
