import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import currencyFormat from '@ziro/currency-format'
import maskInput from '@ziro/mask-input'
import { inline, styleTag } from './styles'

const InputPercentage = forwardRef(({ defaultValue, id, value, setValue, style = inline, css = styleTag, disabled, submitting, ...rest }, ref) => {
  const inputProps = { style, disabled: disabled || submitting, ref, inputMode: 'numeric', placeholder: '% 20', ...rest }
  console.log('value', value)
  return (
    <>
      <style>{css}</style>
      <input
        {...inputProps}
        className="input-text"
        value={
          value
            ? `% ${currencyFormat(value).replace(/[R$]/g, '')}`
            : setValue(prev => ({
                ...prev,
                [id]:
                  parseFloat(defaultValue.split('%')[0]) * 100
                    ? parseFloat(defaultValue.split('%')[0]) * 100 <= 10000
                      ? maskInput(parseFloat(defaultValue.split('%')[0]) * 100, '#######', true)
                      : maskInput(10000, '#######', true)
                    : parseFloat(defaultValue.split('%')[0]) === 0
                    ? '% 0,00'
                    : '% 0,00',
              })) || '% 0,00'
        }
        onChange={({ target: { value } }) => {
          if (value === '% 0,0') {
            setValue(prev => ({
              ...prev,
              [id]: '000',
            }))
            // setValue('% 0,00');
          } else {
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
          }
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
