import React,{useEffect, useState} from 'react'
import Details from '@bit/vitorbarbosa19.ziro.details'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import Error from '@bit/vitorbarbosa19.ziro.error'
import useLoadManualApproval from './hooks/useLoadManualApproval'
import Illustration from '@bit/vitorbarbosa19.ziro.illustration'
import CardsList from './components/CardsList/index';
import CardDetail from './components/CardDetail/index';
import { illustration, empty } from './styles'

const ManualApproval = ({cardId}) => {
  const { removeRow, dataRows, isLoading, isError, modifyCardId, card } = useLoadManualApproval();
    const [timeout, setTimeoutFunction] = useState(false)
    const [submitMsg, setSubmitMsg] = useState('')
    const [timeoutMessage, setTimeoutMessageFunction] = useState(false)
    useEffect(() => {
        if(cardId)
      modifyCardId(cardId)
    },[dataRows,card,cardId])
    useEffect(() => {
      // if user start typing on any field, reset submit message after 10 seconds
      const clearMsg = setTimeout(() => submitMsg ? setSubmitMsg("") : null, 10000);
      return () => clearTimeout(clearMsg);
  }, [submitMsg]);
  useEffect(() => {
    // if user start typing on any field, reset submit message after 10 seconds
    const clearMsg = setTimeout(() => dataRows.length === 0 ? setTimeoutMessageFunction(true) : setTimeoutMessageFunction(false) , 10000);
    return () => clearTimeout(clearMsg);
}, [dataRows]);

  if (isError)
    return (
      <Error />
    )

  if (isLoading) return <Spinner />
  //return (<CardsList dataRows={dataRows} />)setTimeout(
    if (dataRows.length === 0 && !isLoading && timeoutMessage) {
        return (
          <div>
            <div style={illustration}>
              <Illustration type="timelineStart" />
            </div>
            <label style={empty}>Sem cartões para aprovar manualmente!</label>
          </div>
        )
      }
    if(typeof cardId !== 'undefined' && dataRows.length>0){
        return <CardDetail removeRow={removeRow} dataRows={dataRows} cardId={cardId} card={card} />
    }
    else{
        return <CardsList dataRows={dataRows} isLoading={isLoading} />
    }

}

export default ManualApproval
