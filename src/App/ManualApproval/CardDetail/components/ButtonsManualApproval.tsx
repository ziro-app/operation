import React from 'react'
import Button from '@bit/vitorbarbosa19.ziro.button'
import { getShortDate } from '../../utils/functions'
import { labelStyle } from '../style'
import { db, fs } from '../../../../Firebase/index'
const ButtonsManualApproval = ({ isLoadingButton, setIsLoading, actualCardCollection }) => {
  return (
    <>
      <div style={{ marginTop: '40px' }}>
        <Button
          type="button"
          cta="Aprovar"
          submitting={isLoadingButton}
          click={async () => {
            console.log('click')
            setIsLoading(true)
            await db
              .collection('catalog-user-data')
              .doc(actualCardCollection.idParent)
              .collection('cards')
              .doc(actualCardCollection.id)
              .update({ status: 'approved' })
            setIsLoading(false)
            window.location.reload()
            //setLocation('aprovacao-manual');
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
            console.log('click')
            setIsLoading(true)
            await db
              .collection('catalog-user-data')
              .doc(actualCardCollection.idParent)
              .collection('cards')
              .doc(actualCardCollection.id)
              .update({ status: 'archived' })
            setIsLoading(false)
            window.location.reload()
            //setLocation('aprovacao-manual');
          }}
        />
      </div>
    </>
  )
}
export default ButtonsManualApproval
