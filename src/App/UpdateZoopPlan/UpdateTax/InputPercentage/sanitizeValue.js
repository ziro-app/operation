import maskInput from '@ziro/mask-input'

const sanitizeValue = value => {
  const toInteger = parseInt(value.replace(/[\.,\s%]/g, ''), 10)
  let validValue
  if (toInteger === 0) validValue = 0
  else if (!toInteger) validValue = ''
  else if (toInteger <= 10000) validValue = maskInput(toInteger, '#######', true)
  else validValue = maskInput(10000, '#######', true)
  return (validValue / 100).toFixed(2)
}

export default sanitizeValue