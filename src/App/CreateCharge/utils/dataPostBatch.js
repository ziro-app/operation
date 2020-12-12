const rowPosition = (arrayObj, param, valor) => {
  const arrayPosition = arrayObj.map((item, index) => {
    if (item[param] === valor) return index
    return ''
  })
  return Number(arrayPosition.join('')) + 2
}

const alfabetoNumber = number => {
  console.log('number inside alfabeto', number)
  console.log('(number + 9).toString(36).toUpperCase() inside alfabeto', (number + 9).toString(36).toUpperCase())
  return (number + 9).toString(36).toUpperCase()
}

const columnPosition = (obj, parm, count) => {
  console.log('obj', obj)
  console.log('parm', parm)
  const number = count + 1 // Object.keys(obj).indexOf(parm) + 1
  return alfabetoNumber(number)
}

const updateSheet = (arrayObj, parm, valor, updateObj, aba) => {
  const posicaoRow = rowPosition(arrayObj, parm, valor)
  const obj = arrayObj[posicaoRow - 2]
  console.log('obj', obj)
  let count = 0
  const objetoUpdateSheet = Object.keys(updateObj).map((item, index) => {
    count += 1
    console.log('item', item)
    console.log('index', index)
    const posicaoColuna = columnPosition(obj, item, count)
    console.log('posicaoColuna', posicaoColuna)
    console.log('range', `${aba}!${posicaoColuna}${posicaoRow}`)
    console.log('[[Object.values(updateObj)[index]]]', [[Object.values(updateObj)[index]]])
    return {
      range: `${aba}!${posicaoColuna}${posicaoRow}`,
      values: [[Object.values(updateObj)[index]]],
    }
  })
  return objetoUpdateSheet
}

module.exports = updateSheet
