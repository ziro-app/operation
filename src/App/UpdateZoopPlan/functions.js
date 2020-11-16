import React from 'react'
import { db } from '../../Firebase'

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

export const createNewPlan = async (sellerZoopPlanForFirebase, nickname, sellerId) => {
  const allowedUsers = ['Uiller', 'Vitor', 'Alessandro', 'Wermeson', 'Ale']
  const nome = nickname ? nickname.trim() : ''
  return new Promise(async (resolve, reject) => {
    try {
      if (process.env.HOMOLOG ? true : allowedUsers.includes(nome)) {
        // console.log('entrou 1')
        // if (Object.keys(sellerZoopPlanForFirebase).length !== 0) {
        // console.log('newPlan dentro do backend', sellerZoopPlanForFirebase)
        await db.collection('suppliers').doc(sellerId).update({
          sellerZoopPlan2: sellerZoopPlanForFirebase, // newPlan, // sellerActualZoopPlanForFirebase,
        })
        // console.log('entrou 3')
        resolve('Plano atualizado')
        // } else throw { msg: 'Atualize ao menos um campo', customError: true }
      } else throw { msg: 'Permissão insuficiente', customError: true }
    } catch (error) {
      console.log(error)
      if (error.customError) reject(error)
      else if (error.response && error.response.data) {
        const { erro, message } = error.response.data
        console.log(message)
        reject({ msg: erro, customError: true })
      } else reject(error)
    }
  })
}

export const defaultValues = {
  ziroAntifraudFee: {
    visa: {
      installment12: '0',
      installment3: '0',
      installment4: '0',
      installment5: '0',
      installment2: '0',
      installment6: '0',
      installment0: '0',
      installment11: '0',
      installment8: '0',
      installment7: '0',
      installment9: '0',
      installment1: '0',
      installment10: '0',
    },
    hipercard: {
      installment6: '0',
      installment7: '0',
      installment5: '0',
      installment0: '0',
      installment2: '0',
      installment9: '0',
      installment12: '0',
      installment1: '0',
      installment10: '0',
      installment11: '0',
      installment3: '0',
      installment8: '0',
      installment4: '0',
    },
    americanexpress: {
      installment6: '0',
      installment7: '0',
      installment5: '0',
      installment0: '0',
      installment2: '0',
      installment9: '0',
      installment12: '0',
      installment1: '0',
      installment10: '0',
      installment11: '0',
      installment3: '0',
      installment8: '0',
      installment4: '0',
    },
    elo: {
      installment6: '0',
      installment7: '0',
      installment5: '0',
      installment0: '0',
      installment2: '0',
      installment9: '0',
      installment12: '0',
      installment1: '0',
      installment10: '0',
      installment11: '0',
      installment3: '0',
      installment8: '0',
      installment4: '0',
    },
    mastercard: {
      installment6: '0',
      installment7: '0',
      installment5: '0',
      installment0: '0',
      installment2: '0',
      installment9: '0',
      installment12: '0',
      installment1: '0',
      installment10: '0',
      installment11: '0',
      installment3: '0',
      installment8: '0',
      installment4: '0',
    },
  },
  ziroMarkupFee: {
    hipercard: {
      installment6: '0',
      installment7: '0',
      installment5: '0',
      installment0: '0',
      installment2: '0',
      installment9: '0',
      installment12: '0',
      installment1: '0',
      installment10: '0',
      installment11: '0',
      installment3: '0',
      installment8: '0',
      installment4: '0',
    },
    elo: {
      installment6: '0',
      installment7: '0',
      installment5: '0',
      installment0: '0',
      installment2: '0',
      installment9: '0',
      installment12: '0',
      installment1: '0',
      installment10: '0',
      installment11: '0',
      installment3: '0',
      installment8: '0',
      installment4: '0',
    },
    visa: {
      installment6: '0',
      installment7: '0',
      installment5: '0',
      installment0: '0',
      installment2: '0',
      installment9: '0',
      installment12: '0',
      installment1: '0',
      installment10: '0',
      installment11: '0',
      installment3: '0',
      installment8: '0',
      installment4: '0',
    },
    mastercard: {
      installment6: '0',
      installment7: '0',
      installment5: '0',
      installment0: '0',
      installment2: '0',
      installment9: '0',
      installment12: '0',
      installment1: '0',
      installment10: '0',
      installment11: '0',
      installment3: '0',
      installment8: '0',
      installment4: '0',
    },
    americanexpress: {
      installment6: '0',
      installment7: '0',
      installment5: '0',
      installment0: '0',
      installment2: '0',
      installment9: '0',
      installment12: '0',
      installment1: '0',
      installment10: '0',
      installment11: '0',
      installment3: '0',
      installment8: '0',
      installment4: '0',
    },
  },
  zoopFee: {
    hipercard: {
      installment0: '1.32',
      installment1: '2.08',
      installment2: '2.93',
      installment3: '2.93',
      installment4: '2.93',
      installment5: '2.93',
      installment6: '2.93',
      installment7: '3.23',
      installment8: '3.23',
      installment9: '3.23',
      installment10: '3.23',
      installment11: '3.23',
      installment12: '3.23',
    },
    elo: {
      installment0: '1.28',
      installment1: '2.27',
      installment2: '2.51',
      installment3: '2.51',
      installment4: '2.51',
      installment5: '2.51',
      installment6: '2.51',
      installment7: '2.93',
      installment8: '2.93',
      installment9: '2.93',
      installment10: '2.93',
      installment11: '2.93',
      installment12: '2.93',
    },
    visa: {
      installment0: '1.12',
      installment1: '1.54',
      installment2: '1.73',
      installment3: '1.73',
      installment4: '1.73',
      installment5: '1.73',
      installment6: '1.73',
      installment7: '2.19',
      installment8: '2.19',
      installment9: '2.19',
      installment10: '2.19',
      installment11: '2.19',
      installment12: '2.19',
    },
    mastercard: {
      installment0: '1.32',
      installment1: '2.30',
      installment2: '2.54',
      installment3: '2.54',
      installment4: '2.54',
      installment5: '2.54',
      installment6: '2.54',
      installment7: '2.65',
      installment8: '2.65',
      installment9: '2.65',
      installment10: '2.65',
      installment11: '2.65',
      installment12: '2.65',
    },
    americanexpress: {
      installment0: '0',
      installment1: '2.77',
      installment2: '2.99',
      installment3: '2.99',
      installment4: '2.99',
      installment5: '2.99',
      installment6: '2.99',
      installment7: '3.14',
      installment8: '3.14',
      installment9: '3.14',
      installment10: '3.14',
      installment11: '3.14',
      installment12: '3.14',
    },
  },
}
