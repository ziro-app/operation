import React from 'react'
import PropTypes from 'prop-types'
import currencyFormat from './currencyFormat'
import sanitizeValue from './sanitizeValue'
import { inline, styleTag } from './styles'

const InputPercentage = ({ defaultValue, id, value, setValue, style = inline, css = styleTag, disabled, submitting, ...rest }) => {
  const inputProps = { style, disabled: disabled || submitting, inputMode: 'numeric', placeholder: '% 20', ...rest }
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
            : setValue(prev => ({ ...prev, [id]: sanitizeValue(defaultValue) }))
        }
        onChange={({ target: { value } }) => {
          setValue(prev => ({ ...prev, [id]: sanitizeValue(value) }))
        }}
      />
    </>
  )
}

InputPercentage.propTypes = {
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  style: PropTypes.object,
  css: PropTypes.string,
  disabled: PropTypes.bool,
  submitting: PropTypes.bool,
}

export default InputPercentage
