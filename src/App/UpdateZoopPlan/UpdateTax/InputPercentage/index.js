import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import maskInput from '@ziro/mask-input'
import { inline, styleTag } from './styles'

const currencyFormat = (value) => {
  if (value || value === 0) {
    const valueString = `${parseFloat(value).toFixed(2) * 100}`;
    // checks if string is in integer format and if it only has 2 digits if starts with leading 0
    if (valueString.match(/^0[0-9]{0,1}$|^[1-9]([0-9]?)+$/g)) {
      const noFormat = (parseInt(value, 10) / 100).toFixed(2);
      if (noFormat.length <= "6") return `R$${noFormat.replace(".", ",")}`;
      else {
        const [integer, decimal] = noFormat.split(".");
        const indexToSlice = integer.length - 3;
        const format = [
          integer.slice(0, indexToSlice),
          integer.slice(indexToSlice)
        ].join(".");
        return `R$${[format, decimal].join(",")}`;
      }
    }
  }
  return "";
};

const InputPercentage = forwardRef(({ defaultValue, id, value, setValue, style = inline, css = styleTag, disabled, submitting, ...rest }, ref) => {
  const inputProps = { style, disabled: disabled || submitting, ref, inputMode: 'numeric', placeholder: '% 20', ...rest }
  return (
    <>
      <style>{css}</style>
      <input
        disabled={disabled}
        {...inputProps}
        className="input-text"
        value={
          value !== undefined
            ? `% ${currencyFormat(value).replace(/[R$]/g, '')}`
            : setValue(prev => ({
                ...prev,
                [id]: parseFloat(defaultValue.split('%')[0]) ? parseFloat(defaultValue.split('%')[0]).toFixed(2) * 100 : '% 0,00',
              }))
        }
        onChange={({ target: { value } }) => {
          const toInteger = parseInt(value.replace(/[\.,\s%]/g, ''), 10)
          let validInputValue
          if (toInteger === 0) validInputValue = 0
          else if (!toInteger) validInputValue = ''
          else if (toInteger <= 10000) validInputValue = maskInput(toInteger, '#######', true)
          else validInputValue = maskInput(10000, '#######', true)
          setValue(prev => ({ ...prev, [id]: validInputValue }))
        }}
      />
    </>
  )
})

InputPercentage.propTypes = {
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  style: PropTypes.object,
  css: PropTypes.string,
  disabled: PropTypes.bool,
  submitting: PropTypes.bool,
}

export default InputPercentage
