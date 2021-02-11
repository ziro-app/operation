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
  }
  useEffect(() => {
    if (fantasy) {
      async function getSellerZoopPlan() {
        const getSupplierData = await db.collection('suppliers').where('fantasia', '==', fantasy.toUpperCase()).get()
        getSupplierData.forEach(doc => {
          setHasSellerZoopPlan(doc.data().sellerZoopPlan)
        })
      }
      getSellerZoopPlan()
    }
  }, [fantasy])
  const validations = [
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

  useEffect(() => fetch(setIsLoading, setErrorLoading, setSuppliers, setFantasyNames, setCatalogBrands), [])

  if (isLoading) return <SpinnerWithDiv size="5rem" />
  if (errorLoading) return <Error />

  return (
    <Menu title="Criar Cobrança">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {
            fantasy === 'ZIRO'
            ? (
                insurance || insurance === null
                ? (
                    <Form
                        buttonName="Criar Link"
                        validations={validations}
                        sendToBackend={sendToBackend ? sendToBackend(state) : () => null}
                        inputs={[
                        <FormInput
                        name="fantasy"
                        label="Fabricante"
                        input={
                        <Dropdown
                        value={fantasy}
                        onChange={({ target: { value } }) => {
                            setFantasy(value)
                            if (fantasyNames.includes(value)) {
                            const supplier = suppliers.filter(supplier => supplier.fantasia === value)
                            if (supplier) {
                                setZoopId(supplier[0].zoopId)
                                if (supplier[0].fantasia !== 'ZIRO') setMaximumInstallmentToChoose(supplier[0].maxParcelas)
                                else setMaximumInstallmentToChoose('10')
                            }
                            }
                        }}
                        onChangeKeyboard={element => {
                            if (element) {
                            const { value } = element
                            setFantasy(value)
                            if (fantasyNames.includes(value)) {
                                const supplier = suppliers.filter(supplier => supplier.fantasia === value)
                                if (supplier) {
                                setZoopId(supplier[0].zoopId)
                                if (supplier[0].fantasia !== 'ZIRO') setMaximumInstallmentToChoose(supplier[0].maxParcelas)
                                else setMaximumInstallmentToChoose('10')
                                }
                            }
                            } else null
                        }}
                        list={fantasyNames.sort()}
                        placeholder="Fabricante referido"
                        />
                        }
                        />,
                        <FormInput
                        name="brands"
                        label="Pagamento em nome de:"
                        input={
                        <Dropdown
                        value={brand}
                        onChange={({ target: { value } }) => {
                            setBrand(value)
                            if (catalogBrands.includes(value)) {
                            const selectedBrand = catalogBrands.filter(item => item.brand === value)
                            if (selectedBrand) {
                                setBrand(value)
                            } else setBrand('')
                            }
                        }}
                        onChangeKeyboard={element => {
                            if (element) {
                            const { value } = element
                            setBrand(value)
                            if (catalogBrands.includes(value)) {
                                const selectedBrand = catalogBrands.filter(item => item.brand === value)
                                if (selectedBrand) {
                                setBrand(value)
                                } else setBrand('')
                            }
                            } else null
                        }}
                        list={catalogBrands.sort()}
                        placeholder="Fabricante"
                        />
                        }
                        />,
                        <FormInput
                        name="charge"
                        label="Valor a cobrar"
                        input={
                        <InputText
                        value={currencyFormat(charge)}
                        onChange={({ target: { value } }) => {
                            const toInteger = parseInt(value.replace(/[R$\.,]/g, ''), 10)
                            return setCharge(maskInput(toInteger, '#######', true))
                        }}
                        placeholder="R$1.299,99"
                        inputMode="numeric"
                        />
                        }
                        />,
                        <FormInput
                        name="installmentsMax"
                        label="Parcelamento máximo"
                        input={
                        <InputText
                        value={installmentsMax}
                        onChange={({ target: { value } }) => {
                            const toInteger = parseInt(value, 10)
                            setInstallmentsMax(maskInput(toInteger, '##', true))
                        }}
                        placeholder={maximumInstallmentToChoose}
                        inputMode="numeric"
                        />
                        }
                        />,
                        <FormInput
                        name="insurance"
                        label="Seguro antifraude na transação"
                        input={
                        <Dropdown
                        disabled={!hasSellerZoopPlan || checkoutWithoutRegister}
                        value={insurenceDropdownValue}
                        onChange={({ target: { value } }) => {
                            if (value === 'Com seguro') {
                            setInsurance(true)
                            setInsurenceDropdownValue('Com seguro')
                            } else if (value === 'Sem seguro') {
                            setInsurance(false)
                            setInsurenceDropdownValue('Sem seguro')
                            } else if (checkoutWithoutRegister === true) {
                            setInsurance(false)
                            setInsurenceDropdownValue('Sem seguro')
                            } else {
                            setInsurance(null)
                            setInsurenceDropdownValue('')
                            }
                        }}
                        onChangeKeyboard={element => {
                            if (element.value === 'Com seguro') {
                            setInsurance(true)
                            setInsurenceDropdownValue('Com seguro')
                            } else if (element.value === 'Sem seguro') {
                            setInsurance(false)
                            setInsurenceDropdownValue('Sem seguro')
                            } else {
                            setInsurance(false)
                            setInsurenceDropdownValue('')
                            }
                        }}
                        list={options}
                        placeholder="Escolha com ou sem seguro"
                        readOnly
                        />
                        }
                        />,
                        <FormInput
                        name="observation"
                        label="Observações (opcional)"
                        input={
                        <InputText
                        value={observations}
                        onChange={({ target: { value } }) => setObservations(value)}
                        placeholder="Romaneio, nome do cliente, etc"
                        />
                        }
                        />,
                        ]}
                    />
                ) : (
                    <Form
                        buttonName="Criar Link"
                        validations={validations}
                        sendToBackend={sendToBackend ? sendToBackend(state) : () => null}
                        inputs={[
                        <FormInput
                            name="fantasy"
                            label="Fabricante"
                            input={
                            <Dropdown
                                value={fantasy}
                                onChange={({ target: { value } }) => {
                                setFantasy(value)
                                if (fantasyNames.includes(value)) {
                                    const supplier = suppliers.filter(supplier => supplier.fantasia === value)
                                    if (supplier) {
                                    setZoopId(supplier[0].zoopId)
                                    if (supplier[0].fantasia !== 'ZIRO') setMaximumInstallmentToChoose(supplier[0].maxParcelas)
                                    else setMaximumInstallmentToChoose('10')
                                    }
                                }
                                }}
                                onChangeKeyboard={element => {
                                if (element) {
                                    const { value } = element
                                    setFantasy(value)
                                    if (fantasyNames.includes(value)) {
                                    const supplier = suppliers.filter(supplier => supplier.fantasia === value)
                                    if (supplier) {
                                        setZoopId(supplier[0].zoopId)
                                        if (supplier[0].fantasia !== 'ZIRO') setMaximumInstallmentToChoose(supplier[0].maxParcelas)
                                        else setMaximumInstallmentToChoose('10')
                                    }
                                    }
                                } else null
                                }}
                                list={fantasyNames.sort()}
                                placeholder="Fabricante referido"
                            />
                            }
                        />,
                        <FormInput
                            name="brands"
                            label="Pagamento em nome de:"
                            input={
                            <Dropdown
                                value={brand}
                                onChange={({ target: { value } }) => {
                                setBrand(value)
                                if (catalogBrands.includes(value)) {
                                    const selectedBrand = catalogBrands.filter(item => item.brand === value)
                                    if (selectedBrand) {
                                    setBrand(value)
                                    } else setBrand('')
                                }
                                }}
                                onChangeKeyboard={element => {
                                if (element) {
                                    const { value } = element
                                    setBrand(value)
                                    if (catalogBrands.includes(value)) {
                                    const selectedBrand = catalogBrands.filter(item => item.brand === value)
                                    if (selectedBrand) {
                                        setBrand(value)
                                    } else setBrand('')
                                    }
                                } else null
                                }}
                                list={catalogBrands.sort()}
                                placeholder="Fabricante"
                            />
                            }
                        />,
                        <FormInput
                            name="charge"
                            label="Valor a cobrar"
                            input={
                            <InputText
                                value={currencyFormat(charge)}
                                onChange={({ target: { value } }) => {
                                const toInteger = parseInt(value.replace(/[R$\.,]/g, ''), 10)
                                return setCharge(maskInput(toInteger, '#######', true))
                                }}
                                placeholder="R$1.299,99"
                                inputMode="numeric"
                            />
                            }
                        />,
                        <FormInput
                            name="installmentsMax"
                            label="Parcelamento máximo"
                            input={
                            <InputText
                                value={installmentsMax}
                                onChange={({ target: { value } }) => {
                                const toInteger = parseInt(value, 10)
                                setInstallmentsMax(maskInput(toInteger, '##', true))
                                }}
                                placeholder={maximumInstallmentToChoose}
                                inputMode="numeric"
                            />
                            }
                        />,
                        <FormInput
                            name="insurance"
                            label="Seguro antifraude na transação"
                            input={
                            <Dropdown
                                disabled={!hasSellerZoopPlan || checkoutWithoutRegister}
                                value={insurenceDropdownValue}
                                onChange={({ target: { value } }) => {
                                if (value === 'Com seguro') {
                                    setInsurance(true)
                                    setInsurenceDropdownValue('Com seguro')
                                } else if (value === 'Sem seguro') {
                                    setInsurance(false)
                                    setInsurenceDropdownValue('Sem seguro')
                                } else if (checkoutWithoutRegister === true) {
                                    setInsurance(false)
                                    setInsurenceDropdownValue('Sem seguro')
                                } else {
                                    setInsurance(null)
                                    setInsurenceDropdownValue('')
                                }
                                }}
                                onChangeKeyboard={element => {
                                if (element.value === 'Com seguro') {
                                    setInsurance(true)
                                    setInsurenceDropdownValue('Com seguro')
                                } else if (element.value === 'Sem seguro') {
                                    setInsurance(false)
                                    setInsurenceDropdownValue('Sem seguro')
                                } else {
                                    setInsurance(false)
                                    setInsurenceDropdownValue('')
                                }
                                }}
                                list={options}
                                placeholder="Escolha com ou sem seguro"
                                readOnly
                            />
                            }
                        />,
                        <FormInput
                            name="observation"
                            label="Observações (opcional)"
                            input={
                            <InputText
                                value={observations}
                                onChange={({ target: { value } }) => setObservations(value)}
                                placeholder="Romaneio, nome do cliente, etc"
                            />
                            }
                        />,
                        <FormInput
                            name="checkoutWithoutRegister"
                            label="Deseja pagamento sem cadastro?"
                            input={
                            <div style={center}>
                                <div style={inline}>Não</div>
                                <ToggleButton
                                size={30}
                                template="primary"
                                active={checkoutWithoutRegister}
                                onClick={() => {
                                    setCheckoutWithoutRegister(!checkoutWithoutRegister)
                                    if (!checkoutWithoutRegister) {
                                    setInsurance(false)
                                    setInsurenceDropdownValue('Sem seguro')
                                    }
                                }}
                                />
                                <div style={inline}>Sim</div>
                            </div>
                            }
                        />,
                        ]}
                    />
                )
            ) : (
                hasSellerZoopPlan
                ? (
                    insurance || insurance === null
                    ? (
                        <Form
                            buttonName="Criar Link"
                            validations={validations}
                            sendToBackend={sendToBackend ? sendToBackend(state) : () => null}
                            inputs={[
                            <FormInput
                                name="fantasy"
                                label="Fabricante"
                                input={
                                <Dropdown
                                    value={fantasy}
                                    onChange={({ target: { value } }) => {
                                    setFantasy(value)
                                    if (fantasyNames.includes(value)) {
                                        const supplier = suppliers.filter(supplier => supplier.fantasia === value)
                                        if (supplier) {
                                        setZoopId(supplier[0].zoopId)
                                        if (supplier[0].fantasia !== 'ZIRO') setMaximumInstallmentToChoose(supplier[0].maxParcelas)
                                        else setMaximumInstallmentToChoose('10')
                                        }
                                    }
                                    }}
                                    onChangeKeyboard={element => {
                                    if (element) {
                                        const { value } = element
                                        setFantasy(value)
                                        if (fantasyNames.includes(value)) {
                                        const supplier = suppliers.filter(supplier => supplier.fantasia === value)
                                        if (supplier) {
                                            setZoopId(supplier[0].zoopId)
                                            if (supplier[0].fantasia !== 'ZIRO') setMaximumInstallmentToChoose(supplier[0].maxParcelas)
                                            else setMaximumInstallmentToChoose('10')
                                        }
                                        }
                                    } else null
                                    }}
                                    list={fantasyNames.sort()}
                                    placeholder="Fabricante referido"
                                />
                                }
                            />,
                            <FormInput
                                name="charge"
                                label="Valor a cobrar"
                                input={
                                <InputText
                                    value={currencyFormat(charge)}
                                    onChange={({ target: { value } }) => {
                                    const toInteger = parseInt(value.replace(/[R$\.,]/g, ''), 10)
                                    return setCharge(maskInput(toInteger, '#######', true))
                                    }}
                                    placeholder="R$1.299,99"
                                    inputMode="numeric"
                                />
                                }
                            />,
                            <FormInput
                                name="installmentsMax"
                                label="Parcelamento máximo"
                                input={
                                <InputText
                                    value={installmentsMax}
                                    onChange={({ target: { value } }) => {
                                    const toInteger = parseInt(value, 10)
                                    setInstallmentsMax(maskInput(toInteger, '##', true))
                                    }}
                                    placeholder={maximumInstallmentToChoose}
                                    inputMode="numeric"
                                />
                                }
                            />,
                            <FormInput
                                name="insurance"
                                label="Seguro antifraude na transação"
                                input={
                                <Dropdown
                                    disabled={!hasSellerZoopPlan || checkoutWithoutRegister}
                                    value={insurenceDropdownValue}
                                    onChange={({ target: { value } }) => {
                                    if (value === 'Com seguro') {
                                        setInsurance(true)
                                        setInsurenceDropdownValue('Com seguro')
                                    } else if (value === 'Sem seguro') {
                                        setInsurance(false)
                                        setInsurenceDropdownValue('Sem seguro')
                                    } else if (checkoutWithoutRegister === true) {
                                        setInsurance(false)
                                        setInsurenceDropdownValue('Sem seguro')
                                    } else {
                                        setInsurance(null)
                                        setInsurenceDropdownValue('')
                                    }
                                    }}
                                    onChangeKeyboard={element => {
                                    if (element.value === 'Com seguro') {
                                        setInsurance(true)
                                        setInsurenceDropdownValue('Com seguro')
                                    } else if (element.value === 'Sem seguro') {
                                        setInsurance(false)
                                        setInsurenceDropdownValue('Sem seguro')
                                    } else {
                                        setInsurance(false)
                                        setInsurenceDropdownValue('')
                                    }
                                    }}
                                    list={options}
                                    placeholder="Escolha com ou sem seguro"
                                    readOnly
                                />
                                }
                            />,

                            <FormInput
                                name="observation"
                                label="Observações(opcional)"
                                input={
                                <InputText
                                    value={observations}
                                    onChange={({ target: { value } }) => setObservations(value)}
                                    placeholder="Romaneio, nome do cliente, etc"
                                />
                                }
                            />,
                            ]}
                        />
                    ) : (
                        <Form
                            buttonName="Criar Link"
                            validations={validations}
                            sendToBackend={sendToBackend ? sendToBackend(state) : () => null}
                            inputs={[
                            <FormInput
                                name="fantasy"
                                label="Fabricante"
                                input={
                                <Dropdown
                                    value={fantasy}
                                    onChange={({ target: { value } }) => {
                                    setFantasy(value)
                                    if (fantasyNames.includes(value)) {
                                        const supplier = suppliers.filter(supplier => supplier.fantasia === value)
                                        if (supplier) {
                                        setZoopId(supplier[0].zoopId)
                                        if (supplier[0].fantasia !== 'ZIRO') setMaximumInstallmentToChoose(supplier[0].maxParcelas)
                                        else setMaximumInstallmentToChoose('10')
                                        }
                                    }
                                    }}
                                    onChangeKeyboard={element => {
                                    if (element) {
                                        const { value } = element
                                        setFantasy(value)
                                        if (fantasyNames.includes(value)) {
                                        const supplier = suppliers.filter(supplier => supplier.fantasia === value)
                                        if (supplier) {
                                            setZoopId(supplier[0].zoopId)
                                            if (supplier[0].fantasia !== 'ZIRO') setMaximumInstallmentToChoose(supplier[0].maxParcelas)
                                            else setMaximumInstallmentToChoose('10')
                                        }
                                        }
                                    } else null
                                    }}
                                    list={fantasyNames.sort()}
                                    placeholder="Fabricante referido"
                                />
                                }
                            />,
                            <FormInput
                                name="charge"
                                label="Valor a cobrar"
                                input={
                                <InputText
                                    value={currencyFormat(charge)}
                                    onChange={({ target: { value } }) => {
                                    const toInteger = parseInt(value.replace(/[R$\.,]/g, ''), 10)
                                    return setCharge(maskInput(toInteger, '#######', true))
                                    }}
                                    placeholder="R$1.299,99"
                                    inputMode="numeric"
                                />
                                }
                            />,
                            <FormInput
                                name="installmentsMax"
                                label="Parcelamento máximo"
                                input={
                                <InputText
                                    value={installmentsMax}
                                    onChange={({ target: { value } }) => {
                                    const toInteger = parseInt(value, 10)
                                    setInstallmentsMax(maskInput(toInteger, '##', true))
                                    }}
                                    placeholder={maximumInstallmentToChoose}
                                    inputMode="numeric"
                                />
                                }
                            />,
                            <FormInput
                                name="insurance"
                                label="Seguro antifraude na transação"
                                input={
                                <Dropdown
                                    disabled={!hasSellerZoopPlan || checkoutWithoutRegister}
                                    value={insurenceDropdownValue}
                                    onChange={({ target: { value } }) => {
                                    if (value === 'Com seguro') {
                                        setInsurance(true)
                                        setInsurenceDropdownValue('Com seguro')
                                    } else if (value === 'Sem seguro') {
                                        setInsurance(false)
                                        setInsurenceDropdownValue('Sem seguro')
                                    } else if (checkoutWithoutRegister === true) {
                                        setInsurance(false)
                                        setInsurenceDropdownValue('Sem seguro')
                                    } else {
                                        setInsurance(null)
                                        setInsurenceDropdownValue('')
                                    }
                                    }}
                                    onChangeKeyboard={element => {
                                    if (element.value === 'Com seguro') {
                                        setInsurance(true)
                                        setInsurenceDropdownValue('Com seguro')
                                    } else if (element.value === 'Sem seguro') {
                                        setInsurance(false)
                                        setInsurenceDropdownValue('Sem seguro')
                                    } else {
                                        setInsurance(false)
                                        setInsurenceDropdownValue('')
                                    }
                                    }}
                                    list={options}
                                    placeholder="Escolha com ou sem seguro"
                                    readOnly
                                />
                                }
                            />,

                            <FormInput
                                name="observation"
                                label="Observações(opcional)"
                                input={
                                <InputText
                                    value={observations}
                                    onChange={({ target: { value } }) => setObservations(value)}
                                    placeholder="Romaneio, nome do cliente, etc"
                                />
                                }
                            />,
                            <FormInput
                                name="checkoutWithoutRegister"
                                label="Deseja pagamento sem cadastro?"
                                input={
                                <div style={center}>
                                    <div style={inline}>Não</div>
                                    <ToggleButton
                                    size={30}
                                    template="primary"
                                    active={checkoutWithoutRegister}
                                    onClick={() => {
                                        setCheckoutWithoutRegister(!checkoutWithoutRegister)
                                        if (!checkoutWithoutRegister) {
                                        setInsurance(false)
                                        setInsurenceDropdownValue('Sem seguro')
                                        }
                                    }}
                                    />
                                    <div style={inline}>Sim</div>
                                </div>
                                }
                            />,
                            ]}
                        />
                    )
                ) : (
                    <Form
                        buttonName="Criar Link"
                        validations={validations}
                        sendToBackend={sendToBackend ? sendToBackend(state) : () => null}
                        inputs={[
                        <FormInput
                            name="fantasy"
                            label="Fabricante"
                            input={
                            <Dropdown
                                value={fantasy}
                                onChange={({ target: { value } }) => {
                                setFantasy(value)
                                if (fantasyNames.includes(value)) {
                                    const supplier = suppliers.filter(supplier => supplier.fantasia === value)
                                    if (supplier) {
                                    setZoopId(supplier[0].zoopId)
                                    if (supplier[0].fantasia !== 'ZIRO') setMaximumInstallmentToChoose(supplier[0].maxParcelas)
                                    else setMaximumInstallmentToChoose('10')
                                    }
                                }
                                }}
                                onChangeKeyboard={element => {
                                if (element) {
                                    const { value } = element
                                    setFantasy(value)
                                    if (fantasyNames.includes(value)) {
                                    const supplier = suppliers.filter(supplier => supplier.fantasia === value)
                                    if (supplier) {
                                        setZoopId(supplier[0].zoopId)
                                        if (supplier[0].fantasia !== 'ZIRO') setMaximumInstallmentToChoose(supplier[0].maxParcelas)
                                        else setMaximumInstallmentToChoose('10')
                                    }
                                    }
                                } else null
                                }}
                                list={fantasyNames.sort()}
                                placeholder="Fabricante referido"
                            />
                            }
                        />,
                        <FormInput
                            name="charge"
                            label="Valor a cobrar"
                            input={
                            <InputText
                                value={currencyFormat(charge)}
                                onChange={({ target: { value } }) => {
                                const toInteger = parseInt(value.replace(/[R$\.,]/g, ''), 10)
                                return setCharge(maskInput(toInteger, '#######', true))
                                }}
                                placeholder="R$1.299,99"
                                inputMode="numeric"
                            />
                            }
                        />,
                        <FormInput
                            name="installmentsMax"
                            label="Parcelamento máximo"
                            input={
                            <InputText
                                value={installmentsMax}
                                onChange={({ target: { value } }) => {
                                const toInteger = parseInt(value, 10)
                                setInstallmentsMax(maskInput(toInteger, '##', true))
                                }}
                                placeholder={maximumInstallmentToChoose}
                                inputMode="numeric"
                            />
                            }
                        />,
                        <FormInput
                            name="observation"
                            label="Observações(opcional)"
                            input={
                            <InputText
                                value={observations}
                                onChange={({ target: { value } }) => setObservations(value)}
                                placeholder="Romaneio, nome do cliente, etc"
                            />
                            }
                        />,
                        ]}
                    />
                )
            )
        }
      </motion.div>
    </Menu>
  )
}

export default CreatePayment
