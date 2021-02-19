import { useEffect, useState } from 'react'
import { useMessage } from '@bit/vitorbarbosa19.ziro.message-modal'
import fetchFirebase from '../utils/fetchFirebase'
import fetchZoop from '../utils/fetchZoop'
import axios from 'axios'
import usePinScroll from './usePinScroll'

const arrayTestCards = [] //"alessandro m gentil",'vitor a barbosa', 'cardholder']

const useLoadConciliation = () => {
  const [dataRows, setDataRows] = useState([])
  const [zoopData, setZoopData] = useState([])
  const [firebaseData, setFirebaseData] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [isError, setError] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [quantityItems, setQuantityItems] = useState(0)
  const setMessage = useMessage()

  const handleClick = () => {
    setLoadingMore(true)
    setQuantityItems(quantityItems + 100)
    //fetchZoop(setZoopData, setLoading, setError, setMessage, quantityItems)
    //fetchFirebase(setFirebaseData, setLoading, setError, setMessage, quantityItems)
  }

  useEffect(() => {
    fetchFirebase(setFirebaseData, setLoading, setError, setMessage)
  }, [quantityItems])
  useEffect(() => {
    fetchZoop(zoopData, setZoopData, setLoading, setError, setMessage, hasMore, setHasMore, quantityItems, setLoadingMore)
  }, [quantityItems])
  const firebaseListId = firebaseData.map(element => (element.transactionZoopId ? element.transactionZoopId : null)).filter(element => element)
  const fusionZoopFirebaseData = []
  useEffect(() => {
    try {
      if (zoopData.length > 0 && firebaseData.length > 0) {
        setLoadingMore(true)
        zoopData.map(zoopElement => {
          if (firebaseListId.includes(zoopElement.id)) {
            /*firebaseData.map(firebaseElement => {
            if (zoopElement.id === firebaseElement.transactionZoopId) {
              const { buyerRazao, id } = firebaseElement
              const existFirebase = true
              const newEelement = { ...zoopElement, buyerRazao, id, existFirebase }
              if (Number(zoopElement.amount) > 2) fusionZoopFirebaseData.push(newEelement)
            }
          })*/
          } else {
            const existFirebase = false
            const newElement = { ...zoopElement, existFirebase }
            const existVoidPending = zoopElement.history.filter(item => item.operation_type === 'void')
            if (
              Number(zoopElement.amount) > 2 &&
              zoopElement.status !== 'failed' &&
              (existVoidPending[0] ? existVoidPending[0].status !== 'pending' : true) &&
              (Object.prototype.hasOwnProperty.call(zoopElement, 'payment_method') && zoopElement.payment_method !== null
                ? Object.prototype.hasOwnProperty.call(zoopElement.payment_method, 'holder_name')
                  ? !arrayTestCards.includes(zoopElement.payment_method.holder_name)
                  : false
                : true)
            )
              fusionZoopFirebaseData.push(newElement)
          }
        })
        if (fusionZoopFirebaseData.length < 10) {
          setLoadingMore(true)
          setQuantityItems(quantityItems + 40)
        } else setLoadingMore(false)
      }
    } catch (e) {
      console.log(e)
      setError(true)
    }
  }, [zoopData])

  useEffect(() => {
    //andleScrollPosition()
    if (fusionZoopFirebaseData.length > 0 && fusionZoopFirebaseData.length !== dataRows.length) {
      setLoadingMore(true)
      const sortedFusion = fusionZoopFirebaseData.sort(function (x, y) {
        if (x.status === 'pre_authorized' || y === 'pre_authorized') return -1
        return 1
      })
      const sortedFusionJSON = sortedFusion.map(object => JSON.stringify(object))
      const sortedFusionJSONSet = new Set(sortedFusionJSON)
      const uniqueZoopFirebaseDataJson = Array.from(sortedFusionJSONSet)
      const uniqueZoopFirebaseDataObject = uniqueZoopFirebaseDataJson.map(json => JSON.parse(json))
      setDataRows(uniqueZoopFirebaseDataObject)
      setLoadingMore(false)
    }
  }, [quantityItems, fusionZoopFirebaseData])

  const removeRow = idDocument => {
    setDataRows(
      dataRows.filter(function (el) {
        return el.id !== idDocument
      }),
    )
  }

  return {
    dataRows,
    removeRow,
    isLoading,
    hasMore,
    loadingMore,
    isError,
    handleClick,
    quantityItems,
  }
}

export default useLoadConciliation
