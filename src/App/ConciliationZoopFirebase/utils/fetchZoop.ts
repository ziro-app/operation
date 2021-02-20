import { db } from '../../../Firebase'
import { FailureMessage } from './promptMessages'
import axios from 'axios'

export function getShortDate(date: Date) {
  const dia = date.getDate().toString(),
    diaF = dia.length == 1 ? '0' + dia : dia,
    mes = (date.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
    mesF = mes.length == 1 ? '0' + mes : mes,
    anoF = date.getFullYear()
  return diaF + '/' + mesF + '/' + anoF
}
const fetchZoop = async (zoopData, setZoopData, setLoading, setError, setMessage, hasMore, setHasMore, quantityItems,setLoadingMore) => {
  try {
    //setLoading(true)
    setLoadingMore(true)
    const last8DaysSeconds = Math.floor((new Date().getTime() - 700000000) / 1000)
    var date = new Date()
    date.setDate(date.getDate() - 7)
    const last7DaysUTC = getShortDate(date)
    const utcDate = Date.UTC(Number(last7DaysUTC.split('/')[2]), Number(last7DaysUTC.split('/')[1]), Number(last7DaysUTC.split('/')[0]))
    const { data } = await axios.get(
      `https://api.zoop.ws/v1/marketplaces/${
        process.env.ZIRO_MARKETPLACE
      }/transactions?limit=100&sort=time-descending&offset=${quantityItems}&payment_type=credit`, //await axios.get(`https://api.zoop.ws/v1/marketplaces/${process.env.ZIRO_MARKETPLACE}/transactions?limit=100&sort=time-descending&status=pre_authorized`,
      { headers: { Authorization: process.env.ZOOP_TOKEN } },
    )
    let arrayItems = []
    if (hasMore) {
      const { items, has_more } = data
      arrayItems = [ ...zoopData, ...items ]

      if (items.length === 0 || has_more === false) setHasMore(false)
      else setHasMore(true)
      setZoopData(arrayItems)
    }
    setLoading(false)
    setLoadingMore(false)
  } catch (error) {
    setMessage(FailureMessage('Ocorreu um erro inesperado.'))
    setError(true)
    setLoading(false)
    setLoadingMore(false)
  }
}

export default fetchZoop
