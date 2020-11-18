import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import currencyFormat from './currencyFormat'
import sanitizeValue from './sanitizeValue'
import { inline, styleTag } from './styles'

const InputPercentage = ({ defaultValue, id, value, setValue, style = inline, css = styleTag, disabled, submitting, ...rest }) => {
  const inputProps = { style, disabled: disabled || submitting, inputMode: 'numeric', placeholder: '% 20', ...rest }
  const displayValue = `% ${currencyFormat((value * 100).toFixed(2)).replace(/[R$]/g, '')}`
  const handleChangeValue = (id, defaultValue) => {
    // console.log('id,defaultValue',id,defaultValue)
    setValue(prev => ({ ...prev, [id]: sanitizeValue(defaultValue) }))
  }
  return (
    <>
      <style>{css}</style>
      <input
        disabled={disabled}
        {...inputProps}
        className="input-text"
        value={value !== undefined ? displayValue : handleChangeValue(id, defaultValue)}
        onChange={({ target: { value } }) => {
          setValue(prev => ({ ...prev, [id]: sanitizeValue(value) }))
        }}
      />
    </>
  )
}

InputPercentage.propTypes = {
  value: PropTypes.string,
  setValue: PropTypes.func,
  style: PropTypes.object,
  css: PropTypes.string,
  disabled: PropTypes.bool,
  submitting: PropTypes.bool,
}

export default InputPercentage
