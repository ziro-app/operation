import React,{useEffect, useState} from 'react'
import Details from '@bit/vitorbarbosa19.ziro.details'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import Error from '@bit/vitorbarbosa19.ziro.error'
import useLoadManualApproval from './hooks/useLoadManualApproval'
import Illustration from '@bit/vitorbarbosa19.ziro.illustration'
import CardsList from './CardsList/index';
import CardDetail from './CardDetail/index';
import { illustration, empty } from './styles'

const ManualApproval = ({cardId}) => {
  const { blockDetails, dataRows, isLoading, isError, modifyCardId, card } = useLoadManualApproval();
    const [timeout, setTimeoutFunction] = useState(false)
    useEffect(() => {
        if(cardId)
      modifyCardId(cardId)
    },[dataRows,card,cardId])
  if (isError)
    return (
      <Error />
    )

  if (isLoading) return <Spinner />
  setTimeout(
    function() {
      setTimeoutFunction(true)
    }, 5000);
  //return (<CardsList dataRows={dataRows} />)setTimeout(
    if (dataRows.length === 0 && !isLoading && timeout) {
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
        return <CardDetail dataRows={dataRows} cardId={cardId} card={card} />
    }
    else{
        return <CardsList dataRows={dataRows} isLoading={isLoading} />
    }

}

export default ManualApproval
