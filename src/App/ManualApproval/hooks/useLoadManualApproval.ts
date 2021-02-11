import { useContext, useEffect, useState } from 'react'
import { useMessage } from '@bit/vitorbarbosa19.ziro.message-modal'
import fetchFirebaseCatalogUserData from '../utils/fetchFirebaseCatalogUserData'
import fetchZoop from '../utils/fetchZoop'
import { userContext } from '../../appContext'

const useLoadManualApproval = () => {
  const [cardIds, setCardIds] = useState([])
  const [cards, setCards] = useState([])
  const [blockDetails, setBlockDetails] = useState([])
  const [dataRows, setDataRows] = useState([])
  const [cardId, setCardId] = useState('')
  const [card, setCard] = useState({})
  const [isLoading, setLoading] = useState(true)
  const [isError, setError] = useState(false)
  const setMessage = useMessage()

  useEffect(() => {
    if(dataRows.length === 0) fetchFirebaseCatalogUserData(setLoading, setError, setMessage, setCardIds, setCards, setDataRows)
    //fetchZoop(setLoading, setError, setMessage, cardId, setCard)
  }, [])

  useEffect(() => {
    fetchZoop(setLoading, setError, setMessage, cardId, setCard)
  }, [cardId])
  const modifyCardId = cardId => {
    setCardId(cardId)
  }
  const removeRow = (idDocument) => {
    setDataRows(dataRows.filter(function (el) {
      return el.id !== idDocument
    }))
  }

  return {
    blockDetails,
    dataRows,
    removeRow,
    isLoading,
    isError,
    modifyCardId,
    card,
  }
}

export default useLoadManualApproval
