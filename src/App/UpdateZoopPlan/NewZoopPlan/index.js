import React, { useContext, memo, useState, useEffect } from 'react'
import { useRoute } from 'wouter'
import Header from '@bit/vitorbarbosa19.ziro.header'
import { motion } from 'framer-motion'
import { containerWithPadding } from '@ziro/theme'
import Button from '@bit/vitorbarbosa19.ziro.button'
import InputText from '@bit/vitorbarbosa19.ziro.input-text'
import { userContext } from '../../appContext'
import sendToBackend from './sendToBackend'
import { translateFees } from '../functions'
import fetch from './fetch'

const NewZoopPlan = () => {
  const defaultValues = {
    zoopFee: {
      hipercard: {
        installment2: 0,
        installment7: 0,
        installment10: 0,
        installment6: 0,
        installment8: 0,
        installment0: 0,
        installment1: 0,
        installment12: 0,
        installment3: 0,
        installment9: 0,
        installment5: 0,
        installment4: 0,
        installment11: 0,
      },
      mastercard: {
        installment12: 0,
        installment6: 0,
        installment7: 0,
        installment5: 0,
        installment0: 0,
        installment9: 0,
        installment3: 0,
        installment10: 0,
        installment11: 0,
        installment8: 0,
        installment1: 0,
        installment2: 0,
        installment4: 0,
      },
      visa: {
        installment10: 0,
        installment1: 0,
        installment5: 0,
        installment6: 0,
        installment8: 0,
        installment4: 0,
        installment0: 0,
        installment7: 0,
        installment9: 0,
        installment2: 0,
        installment11: 0,
        installment12: 0,
        installment3: 0,
      },
      elo: {
        installment6: 0,
        installment0: 0,
        installment8: 0,
        installment5: 0,
        installment1: 0,
        installment9: 0,
        installment10: 0,
        installment11: 0,
        installment12: 0,
        installment4: 0,
        installment3: 0,
        installment2: 0,
        installment7: 0,
      },
      americanexpress: {
        installment1: 0,
        installment2: 0,
        installment6: 0,
        installment10: 0,
        installment9: 0,
        installment11: 0,
        installment8: 0,
        installment3: 0,
        installment12: 0,
        installment0: 0,
        installment4: 0,
        installment7: 0,
        installment5: 0,
      },
    },
    ziroAntifraudFee: {
      visa: {
        installment12: 0,
        installment3: 0,
        installment4: 0,
        installment5: 0,
        installment2: 0,
        installment6: 0,
        installment0: 0,
        installment11: 0,
        installment8: 0,
        installment7: 0,
        installment9: 0,
        installment1: 0,
        installment10: 0,
      },
      hipercard: {
        installment6: 0,
        installment7: 0,
        installment5: 0,
        installment0: 0,
        installment2: 0,
        installment9: 0,
        installment12: 0,
        installment1: 0,
        installment10: 0,
        installment11: 0,
        installment3: 0,
        installment8: 0,
        installment4: 0,
      },
      americanexpress: {
        installment4: 0,
        installment1: 0,
        installment5: 0,
        installment8: 0,
        installment7: 0,
        installment6: 0,
        installment10: 0,
        installment3: 0,
        installment12: 0,
        installment2: 0,
        installment9: 0,
        installment0: 0,
        installment11: 0,
      },
      elo: {
        installment10: 0,
        installment5: 0,
        installment6: 0,
        installment2: 0,
        installment11: 0,
        installment0: 0,
        installment3: 0,
        installment8: 0,
        installment4: 0,
        installment12: 0,
        installment9: 0,
        installment7: 0,
        installment1: 0,
      },
      mastercard: {
        installment12: 0,
        installment8: 0,
        installment4: 0,
        installment7: 0,
        installment9: 0,
        installment2: 0,
        installment5: 0,
        installment6: 0,
        installment0: 0,
        installment10: 0,
        installment11: 0,
        installment1: 0,
        installment3: 0,
      },
    },
    ziroMarkupFee: {
      hipercard: {
        installment6: 0,
        installment11: 0,
        installment10: 0,
        installment1: 0,
        installment12: 0,
        installment8: 0,
        installment4: 0,
        installment3: 0,
        installment2: 0,
        installment0: 0,
        installment9: 0,
        installment7: 0,
        installment5: 0,
      },
      elo: {
        installment0: 0,
        installment10: 0,
        installment3: 0,
        installment7: 0,
        installment8: 0,
        installment9: 0,
        installment2: 0,
        installment5: 0,
        installment6: 0,
        installment1: 0,
        installment4: 0,
        installment11: 0,
        installment12: 0,
      },
      visa: {
        installment0: 0,
        installment1: 0,
        installment11: 0,
        installment4: 0,
        installment9: 0,
        installment6: 0,
        installment5: 0,
        installment7: 0,
        installment2: 0,
        installment8: 0,
        installment10: 0,
        installment3: 0,
        installment12: 0,
      },
      mastercard: {
        installment1: 0,
        installment0: 0,
        installment2: 0,
        installment12: 0,
        installment3: 0,
        installment10: 0,
        installment8: 0,
        installment4: 0,
        installment6: 0,
        installment7: 0,
        installment11: 0,
        installment9: 0,
        installment5: 0,
      },
      americanexpress: {
        installment8: 0,
        installment1: 0,
        installment2: 0,
        installment9: 0,
        installment12: 0,
        installment4: 0,
        installment3: 0,
        installment11: 0,
        installment10: 0,
        installment7: 0,
        installment6: 0,
        installment5: 0,
        installment0: 0,
      },
    },
  }
  const defaultValuesForNewPlanWithoutNumbers = {
    zoopFee: {
      hipercard: {
        installment2: 0,
        installment7: 0,
        installment10: 0,
        installment6: 0,
        installment8: 0,
        installment0: 0,
        installment1: 0,
        installment12: 0,
        installment3: 0,
        installment9: 0,
        installment5: 0,
        installment4: 0,
        installment11: 0,
      },
      mastercard: {
        installment12: 0,
        installment6: 0,
        installment7: 0,
        installment5: 0,
        installment0: 0,
        installment9: 0,
        installment3: 0,
        installment10: 0,
        installment11: 0,
        installment8: 0,
        installment1: 0,
        installment2: 0,
        installment4: 0,
      },
      visa: {
        installment10: 0,
        installment1: 0,
        installment5: 0,
        installment6: 0,
        installment8: 0,
        installment4: 0,
        installment0: 0,
        installment7: 0,
        installment9: 0,
        installment2: 0,
        installment11: 0,
        installment12: 0,
        installment3: 0,
      },
      elo: {
        installment6: 0,
        installment0: 0,
        installment8: 0,
        installment5: 0,
        installment1: 0,
        installment9: 0,
        installment10: 0,
        installment11: 0,
        installment12: 0,
        installment4: 0,
        installment3: 0,
        installment2: 0,
        installment7: 0,
      },
      americanexpress: {
        installment1: 0,
        installment2: 0,
        installment6: 0,
        installment10: 0,
        installment9: 0,
        installment11: 0,
        installment8: 0,
        installment3: 0,
        installment12: 0,
        installment0: 0,
        installment4: 0,
        installment7: 0,
        installment5: 0,
      },
    },
    ziroAntifraudFee: {
      visa: {
        installment12: 0,
        installment3: 0,
        installment4: 0,
        installment5: 0,
        installment2: 0,
        installment6: 0,
        installment0: 0,
        installment11: 0,
        installment8: 0,
        installment7: 0,
        installment9: 0,
        installment1: 0,
        installment10: 0,
      },
      hipercard: {
        installment6: 0,
        installment7: 0,
        installment5: 0,
        installment0: 0,
        installment2: 0,
        installment9: 0,
        installment12: 0,
        installment1: 0,
        installment10: 0,
        installment11: 0,
        installment3: 0,
        installment8: 0,
        installment4: 0,
      },
      americanexpress: {
        installment4: 0,
        installment1: 0,
        installment5: 0,
        installment8: 0,
        installment7: 0,
        installment6: 0,
        installment10: 0,
        installment3: 0,
        installment12: 0,
        installment2: 0,
        installment9: 0,
        installment0: 0,
        installment11: 0,
      },
      elo: {
        installment10: 0,
        installment5: 0,
        installment6: 0,
        installment2: 0,
        installment11: 0,
        installment0: 0,
        installment3: 0,
        installment8: 0,
        installment4: 0,
        installment12: 0,
        installment9: 0,
        installment7: 0,
        installment1: 0,
      },
      mastercard: {
        installment12: 0,
        installment8: 0,
        installment4: 0,
        installment7: 0,
        installment9: 0,
        installment2: 0,
        installment5: 0,
        installment6: 0,
        installment0: 0,
        installment10: 0,
        installment11: 0,
        installment1: 0,
        installment3: 0,
      },
    },
    ziroMarkupFee: {
      hipercard: {
        installment6: 0,
        installment11: 0,
        installment10: 0,
        installment1: 0,
        installment12: 0,
        installment8: 0,
        installment4: 0,
        installment3: 0,
        installment2: 0,
        installment0: 0,
        installment9: 0,
        installment7: 0,
        installment5: 0,
      },
      elo: {
        installment0: 0,
        installment10: 0,
        installment3: 0,
        installment7: 0,
        installment8: 0,
        installment9: 0,
        installment2: 0,
        installment5: 0,
        installment6: 0,
        installment1: 0,
        installment4: 0,
        installment11: 0,
        installment12: 0,
      },
      visa: {
        installment0: 0,
        installment1: 0,
        installment11: 0,
        installment4: 0,
        installment9: 0,
        installment6: 0,
        installment5: 0,
        installment7: 0,
        installment2: 0,
        installment8: 0,
        installment10: 0,
        installment3: 0,
        installment12: 0,
      },
      mastercard: {
        installment1: 0,
        installment0: 0,
        installment2: 0,
        installment12: 0,
        installment3: 0,
        installment10: 0,
        installment8: 0,
        installment4: 0,
        installment6: 0,
        installment7: 0,
        installment11: 0,
        installment9: 0,
        installment5: 0,
      },
      americanexpress: {
        installment8: 0,
        installment1: 0,
        installment2: 0,
        installment9: 0,
        installment12: 0,
        installment4: 0,
        installment3: 0,
        installment11: 0,
        installment10: 0,
        installment7: 0,
        installment6: 0,
        installment5: 0,
        installment0: 0,
      },
    },
  }
  const { nickname } = useContext(userContext)
  const [isLoading, setIsLoading] = useState(true)
  const [errorLoading, setErrorLoading] = useState(false)
  const [sellerZoopPlan2, setSellerZoopPlan2] = useState({})
  const [selectedPlan, setSelectedPlan] = useState(null)

  const [planName, setPlanName] = useState('')
  const [matchSellerId, paramsSellerId] = useRoute('/atualizar-plano-zoop/:sellerId?/newPlan')
  const { sellerId } = paramsSellerId
  useEffect(() => fetch(setIsLoading, setErrorLoading, setSellerZoopPlan2, selectedPlan, sellerId), [])
  const newPlan = {}

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={containerWithPadding}>
      <Header type="icon-link" title="Adicionar Plano de Venda" navigateTo={`atualizar-plano-zoop/${sellerId}`} icon="back" />
      <div style={{ padding: '5px' }}>
        <InputText
          value={planName}
          onChange={({ target: { value } }) => {
            if (value.includes(' ')) {
              const newValue = value.replace(/\s/g, '')
              setPlanName(newValue)
            } else {
              setPlanName(value)
            }
          }}
          placeholder="Nome do plano"
        />
      </div>
      <div style={{ padding: '5px' }}>
        <Button
          type="button"
          cta="Criar plano"
          template="regular"
          click={() => {
            console.log('sellerZoopPlan2', sellerZoopPlan2)
            if (sellerZoopPlan2 === null || !Object.keys(sellerZoopPlan2).includes(planName)) {
              let sellerZoopPlanForFirebase = sellerZoopPlan2
              const defaultValue = 'standard'
              if (sellerZoopPlan2 !== null) {
                sellerZoopPlanForFirebase[planName] = {}
                sellerZoopPlanForFirebase[planName] = defaultValuesForNewPlanWithoutNumbers
              } else {
                sellerZoopPlanForFirebase = {}
                sellerZoopPlanForFirebase[planName] = defaultValues
              }
              // sellerZoopPlan2[defaultValue] // defaultValuesForNewPlanWithNumber
              // console.log('teste 2', sellerZoopPlanForFirebase.teste2)

              sendToBackend && Object.keys(sellerZoopPlanForFirebase).length !== 0
                ? sendToBackend(sellerZoopPlanForFirebase, nickname, sellerId, setPlanName)
                : () => null
            }
          }}
        />
      </div>
    </motion.div>
  )
}

export default memo(NewZoopPlan)
