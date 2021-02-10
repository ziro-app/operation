import React from 'react'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import InputText from '@bit/vitorbarbosa19.ziro.input-text'
import InputEmail from '@bit/vitorbarbosa19.ziro.input-email'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import currencyFormat from '@ziro/currency-format'
import maskInput from '@ziro/mask-input'
import ToggleButton from '@bit/vitorbarbosa19.ziro.toggle-button'
import { inline, center } from '../styles'
const withPlanWithoutInsurance = ({
  nickname,
  setBrand,
  seller,
  onBehalfOfBrand,
  sellerId,
  charge,
  installmentsMax,
  setFantasy,
  setCharge,
  setInstallmentsMax,
  observations,
  setObservations,
  hasSellerZoopPlan,
  setHasSellerZoopPlan,
  hasBrandZoopPlan,
  setHasBrandZoopPlan,
  insurance,
  setInsurance,
  setInsurenceDropdownValue,
  checkoutWithoutRegister,
  setCheckoutWithoutRegister,
  options,
  suppliers,
  setZoopId,
  setMaximumInstallmentToChoose,
  fantasy,
  fantasyNames,
  setFantasyNames,
  onlyUnique,
  brand,
  catalogBrands,
  maximumInstallmentToChoose,
  insurenceDropdownValue,
}) => {
  const fields = [
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
        <InputText value={observations} onChange={({ target: { value } }) => setObservations(value)} placeholder="Romaneio, nome do cliente, etc" />
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
  ]
  return fields
}

export default withPlanWithoutInsurance
