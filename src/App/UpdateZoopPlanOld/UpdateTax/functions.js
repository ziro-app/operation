import React from 'react'

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })

export function returnInstallmentAndFee(fees) {
  Object.keys(Object.entries(fees[0][1])[0][1]).forEach(function (key) {
    console.log(key, Object.entries(fees[0][1])[0][1][key])
  })
}
export function translateInstallments(text) {
  const installmentName = text.match(/[\d\.]+|\D+/g)[0]
  const installmentNumber = text.match(/[\d\.]+|\D+/g)[1]
  return `${installmentName === 'installment' ? `x  ${installmentNumber}` : 'Débito'}`
}
export function translateFees(text) {
  const ziroMarkupFee = 'Taxa Ziro'
  const zoopFee = 'Taxa Zoop'
  const ziroAntifraudFee = 'Taxa Antifraude'
  if (text === 'ziroMarkupFee') return ziroMarkupFee
  if (text === 'zoopFee') return zoopFee
  if (text === 'ziroAntifraudFee') return ziroAntifraudFee
  return 'Taxa sem nome cadastrado'
}
export function alphanum(a, b) {
  function chunkify(t) {
    let tz = [],
      x = 0,
      y = -1,
      n = 0,
      i,
      j

    while ((i = (j = t.charAt(x++)).charCodeAt(0))) {
      const m = i == 46 || (i >= 48 && i <= 57)
      if (m !== n) {
        tz[++y] = ''
        n = m
      }
      tz[y] += j
    }
    return tz
  }

  const aa = chunkify(a)
  const bb = chunkify(b)

  for (x = 0; aa[x] && bb[x]; x++) {
    if (aa[x] !== bb[x]) {
      const c = Number(aa[x]),
        d = Number(bb[x])
      if (c == aa[x] && d == bb[x]) {
        return c - d
      }
      return aa[x] > bb[x] ? 1 : -1
    }
  }
  return aa.length - bb.length
}

export function returnInstallmentsWithFee(card) {
  // console.log('teste dentro do return', card)
  return Object.keys(card[1])
    .map(function (key) {
      // console.log('test', key, card[1][key], card)
      return `${key} : ${card[1][key]}%`
    })
    .sort(collator.compare)
}
export function returnUniqueKey(card) {
  return Object.keys(card[1])
    .map(function (key) {
      console.log('test', key, card[1][key], card)
      return `${translateInstallments(key)} : ${card[1][key]}%`
    })
    .sort(collator.compare)
}
export function testInstallments(card, item) {
  // console.log('teste do functions', `${card[0]}${item.split(' ')[0]}${item.split(' ')[1]}${item.split(' ')[2]}`)
}
