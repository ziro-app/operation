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
  const allowedUsers = ['Uiller', 'Vitor', 'Fernanda', 'Wermeson', 'Ale', 'Russi']
  const nome = nickname ? nickname.trim() : ''
  return new Promise(async (resolve, reject) => {
    try {
      if (process.env.HOMOLOG ? true : allowedUsers.includes(nome)) {
        // console.log('entrou 1')
        // if (Object.keys(sellerZoopPlanForFirebase).length !== 0) {
        // console.log('newPlan dentro do backend', sellerZoopPlanForFirebase)
        await db.collection('suppliers').doc(sellerId).update({
          sellerZoopPlan: sellerZoopPlanForFirebase, // newPlan, // sellerActualZoopPlanForFirebase,
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

export function translateFirebaseToFees(text) {
  const financed30 = 'd+30'
  const financed14 = 'd+14'
  const financed1 = 'd+1'
  const standard = 'fluxo'
  if (text === 'financed1') return financed1
  if (text === 'financed30') return financed30
  if (text === 'financed14') return financed14
  if (text === 'standard') return standard
  return text
}
export function translateFeesToFirebase(text) {
  const d30 = 'financed30'
  const d1 = 'financed1'
  const d14 = 'financed14'
  const fluxo = 'standard'
  if (text === 'd+1') return d1
  if (text === 'd+30') return d30
  if (text === 'd+14') return d14
  if (text === 'fluxo') return fluxo
  return 'Taxa sem nome cadastrado'
}

export function translateFeesToZoop(text) {
  const d30 = 'plano_pro_ziro_d30smkup_d1'
  const d14 = 'plano_pro_ziro_antd14s_d1'
  const fluxo = 'plano_std_ziro_smarkup_d30'
  const d1 = 'plano_pro_ziro_antd1smk_d1'
  if (text === 'd+1') return d1
  if (text === 'd+30') return d30
  if (text === 'd+14') return d14
  if (text === 'fluxo') return fluxo
  return 'Taxa sem nome cadastrado'
}
