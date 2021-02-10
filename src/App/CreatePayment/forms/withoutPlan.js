import React from 'react'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import InputText from '@bit/vitorbarbosa19.ziro.input-text'
import InputEmail from '@bit/vitorbarbosa19.ziro.input-email'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import currencyFormat from '@ziro/currency-format'
import maskInput from '@ziro/mask-input'
import ToggleButton from '@bit/vitorbarbosa19.ziro.toggle-button'
import { inline, center } from '../styles'
const withoutPlan = ({
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
  ]
  return fields
}

export default withoutPlan
