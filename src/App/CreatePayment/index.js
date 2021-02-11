import React, { useContext, useEffect, useState } from 'react'

import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import InputText from '@bit/vitorbarbosa19.ziro.input-text'
import SpinnerWithDiv from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import capitalize from '@ziro/capitalize'
import currencyFormat from '@ziro/currency-format'
import maskInput from '@ziro/mask-input'
import { motion } from 'framer-motion'
import ToggleButton from '@bit/vitorbarbosa19.ziro.toggle-button'
import fetch from './fetch'
import { Menu } from '../Menu'
import { db, fs } from '../../Firebase/index'
import sendToBackend from './sendToBackend'
import { userContext } from '../appContext'
import { inline, center } from './styles'
import matchForm from './matchForm'

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

const CreatePayment = () => {
  
  const [isLoading, setIsLoading] = useState(true)
  const [errorLoading, setErrorLoading] = useState(false)
  const [suppliers, setSuppliers] = useState([])
  const [fantasyNames, setFantasyNames] = useState([])
  const [catalogBrands, setCatalogBrands] = useState([])
  const [fantasy, setFantasy] = useState('')
  const [brand, setBrand] = useState('')
  const [zoopId, setZoopId] = useState('')
  const [charge, setCharge] = useState('')
  const [installmentsMax, setInstallmentsMax] = useState('')
  const [observations, setObservations] = useState('')
  const [maximumInstallmentToChoose, setMaximumInstallmentToChoose] = useState('10')
  const [type, setType] = useState("withPlanWithInsurance");
  const { nickname } = useContext(userContext)
  const [hasSellerZoopPlan, setHasSellerZoopPlan] = useState(null)
  const [insurance, setInsurance] = useState(null)
  const [checkoutWithoutRegister, setCheckoutWithoutRegister] = useState(false)
  const [insurenceDropdownValue, setInsurenceDropdownValue] = useState('')
  const options = ['Com seguro', 'Sem seguro']
  const state = {
    nickname,
    setBrand,
    seller: capitalize(fantasy),
    onBehalfOfBrand: capitalize(brand),
    sellerId: zoopId,
    charge,
    installmentsMax,
    setFantasy,
    setCharge,
    setInstallmentsMax,
    observations,
    setObservations,
    hasSellerZoopPlan,
    setHasSellerZoopPlan,
    insurance,
    setInsurance,
    setInsurenceDropdownValue,
    checkoutWithoutRegister,
    setCheckoutWithoutRegister,
    options,type,fantasyNames, setFantasyNames,fantasy,
    setFantasy,onlyUnique,brand, catalogBrands,maximumInstallmentToChoose,insurenceDropdownValue
    ,suppliers,setZoopId,setMaximumInstallmentToChoose
  }
  useEffect(() => {
    if (fantasy) {
      async function getSellerZoopPlan() {
        const getSupplierData = await db.collection('suppliers').where('fantasia', '==', fantasy.toUpperCase()).get()
        getSupplierData.forEach(doc => {
          setHasSellerZoopPlan(doc.data().sellerZoopPlan)
        })
        console.log(hasSellerZoopPlan)
      }
      getSellerZoopPlan()
    }
  }, [fantasy])

  console.log('states', state)
  const validations = [
      {
          name:'fantasy',
          validation: (type) => type === "withoutPlan",
          value: type,
          message: 'Selecione um fabricante que tenha plano!',

      },
    {
      name: 'insurance',
      validation: value => hasSellerZoopPlan ? value !== '' : true,
      value: insurenceDropdownValue,
      message: 'Opção inválida',
    },
    {
      name: 'fantasy',
      validation: value => fantasyNames.includes(value),
      value: fantasy,
      message: 'Fabricante inválido',
    },
    {
      name: 'charge',
      validation: value => value > 9 && value <= 3000000,
      value: charge,
      message: 'Deve ser entre 0,10 e 30mil',
    },
    {
      name: 'brands',
      validation: value => (fantasy === 'ZIRO' ? catalogBrands.includes(value) : true),
      value: brand,
      message: 'Fabricante inválido',
    },
    {
      name: 'installmentsMax',
      validation: value => parseInt(value) > 0 && parseInt(value) <= parseInt(maximumInstallmentToChoose),
      value: installmentsMax,
      message: `Deve ser entre 1 e ${maximumInstallmentToChoose}`,
    },
  ]
  useEffect(() => {
    if(fantasy==='ZIRO' && (insurance || insurance === null))//ziroWithoutPlanWithInsurance
    {
      setType('ziroWithoutPlanWithInsurance')
    }
    else if(fantasy==='ZIRO' && !(insurance || insurance === null))//ziroWithoutPlanWithoutInsurance
    {
      setType('ziroWithoutPlanWithoutInsurance')
    }
    else if(hasSellerZoopPlan && (insurance || insurance === null))//withPlanWithInsurance
    {
      setType('withPlanWithInsurance')
    }
    else if(hasSellerZoopPlan && !(insurance || insurance === null))//withPlanWithoutInsurance
    {
      setType('withPlanWithoutInsurance')
    }else if(!hasSellerZoopPlan && insurance === null)//without everything so he doesnt has a plan
    {
      setType('withoutPlan')
    }

},[insurance,fantasy,hasSellerZoopPlan])

  useEffect(() => fetch(setIsLoading, setErrorLoading, setSuppliers, setFantasyNames, setCatalogBrands), [])

  if (isLoading) return <SpinnerWithDiv size="5rem" />
  if (errorLoading) return <Error />


  return (
    <Menu title="Criar Cobrança">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {
                    <Form
                        buttonName="Criar Link"
                        validations={validations}
                        sendToBackend={sendToBackend ? sendToBackend(state) : () => null}
                        inputs={[
                            ...matchForm(state),
                        ]}
                    />
        }
      </motion.div>
    </Menu>
  )
}

export default CreatePayment
