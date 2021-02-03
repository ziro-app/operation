import React from 'react'
import Button from '@bit/vitorbarbosa19.ziro.button'
import { getShortDate } from '../../utils/functions'
import { labelStyle } from '../style'
import { db, fs } from '../../../../Firebase/index'

interface cardCollection {
    idParent:string;
    id:string;
}
interface Props {
    setLocation:Function;
    isLoadingButton:boolean;
    setIsLoading:Function;
    actualCardCollection:cardCollection;
    marginTop?:string
}
const ButtonsManualApproval = ({ setLocation,isLoadingButton, setIsLoading, actualCardCollection,marginTop }:Props) => {
  return (
    <>
      <div style={{ marginTop: marginTop || '0px' }}>
        <Button
          type="button"
          cta="Aprovar"
          submitting={isLoadingButton}
          click={async () => {
            setIsLoading(true)
            await db
              .collection('catalog-user-data')
              .doc(actualCardCollection.idParent)
              .collection('cards')
              .doc(actualCardCollection.id)
              .update({ status: 'approved' })
            setIsLoading(false)
            setLocation('aprovacao-manual');
            window.location.reload()
          }}
        />
      </div>
      <div style={{ marginTop: '10px', marginBottom:'20px' }}>
        <Button
          type="button"
          cta="Arquivar"
          template="destructive"
          submitting={isLoadingButton}
          click={async () => {
            setIsLoading(true)
            await db
              .collection('catalog-user-data')
              .doc(actualCardCollection.idParent)
              .collection('cards')
              .doc(actualCardCollection.id)
              .update({ status: 'archived' })
            setIsLoading(false)
            setLocation('aprovacao-manual');
            window.location.reload()
          }}
        />
      </div>
    </>
  )
}
export default ButtonsManualApproval
