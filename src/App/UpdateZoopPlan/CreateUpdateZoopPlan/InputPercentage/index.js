import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import currencyFormat from '@ziro/currency-format'
import maskInput from '@ziro/mask-input'
import { inline, styleTag } from './styles'

const InputPercentage = forwardRef(({ defaultValue, id, value, setValue, style = inline, css = styleTag, disabled, submitting, ...rest }, ref) => {
  const inputProps = { style, disabled: disabled || submitting, ref, inputMode: 'numeric', placeholder: '% 20', ...rest }
  // console.log('value,defaultValue', value, defaultValue)
  console.log('value', value)
  return (
    <>
      <style>{css}</style>
      <input
        {...inputProps}
        className="input-text"
        value={
          value
            ? value === '% 0,00'
              ? '% 0,00'
              : `% ${value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }).replace(/[R$]/g, '')}`
            : setValue(prev => ({
                ...prev,
                [id]: parseFloat(defaultValue.split('%')[0])
                  ? parseFloat(defaultValue.split('%')[0]) <= 10000
                    ? maskInput(parseFloat(defaultValue.split('%')[0]), '#######', true)
                    : maskInput(10000, '#######', true)
                  : '% 0,00',
              }))
        }
        onChange={({ target: { value } }) => {
          const toInteger = parseInt(value.replace(/[\.,\s%]/g, ''), 10)
          setValue(prev => ({
            ...prev,
            // eslint-disable-next-line no-nested-ternary
            [id]: toInteger
              ? toInteger <= 10000
                ? maskInput(toInteger, '#######', true)
                : maskInput(10000, '#######', true)
              : toInteger === 0
              ? '0'
              : '',
          }))
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
