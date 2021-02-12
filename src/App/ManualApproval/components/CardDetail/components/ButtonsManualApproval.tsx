import React from 'react'
import Button from '@bit/vitorbarbosa19.ziro.button'
import { db } from '../../../../../Firebase/index'
import { useMessage, useMessagePromise } from '@bit/vitorbarbosa19.ziro.message-modal'
import { ZiroPromptMessage, ZiroWaitingMessage } from 'ziro-messages'

interface cardCollection {
  idParent: string;
  id: string;
}
interface Props {
  removeRow: Function;
  setLocation: Function;
  isLoadingButton: boolean;
  setIsLoading: Function;
  actualCardCollection: cardCollection;
  marginTop?: string;
}
const ButtonsManualApproval = ({ setLocation, removeRow, isLoadingButton, setIsLoading, actualCardCollection, marginTop }: Props) => {
  const setPromiseMessage = useMessagePromise()
  const setMessage = useMessage()

  const PromptMessage = new ZiroPromptMessage({
    name: 'promptReceivingPolicy',
    type: 'neutral',
    code: '201',
    title: 'Aprovação manual',
    userDescription: `A pessoa poderá realizar pagamentos após a aprovação.`,
    userResolution: 'Deseja continuar?',
    internalDescription: 'prompt política de recebimento',
    illustration: 'profileData',
    additionalData: undefined,
  })
  const PromptMessageArchived = new ZiroPromptMessage({
    name: 'promptReceivingPolicy',
    type: 'neutral',
    code: '201',
    title: 'Aprovação manual',
    userDescription: `O cartão da pessoa será atualizado para arquivado e não aparecerá na aprovação manual.`,
    userResolution: 'Deseja continuar?',
    internalDescription: 'prompt política de recebimento',
    illustration: 'profileData',
    additionalData: undefined,
  })
  const WaitingMessage = new ZiroWaitingMessage({
    name: 'waitingReceivingPolicy',
    type: 'neutral',
    code: '202',
    title: 'Aprovação manual',
    userDescription: 'Efetuando a mudança. Aguarde enquanto finalizamos.',
    internalDescription: 'waiting política de recebimento',
    illustration: 'waiting',
    additionalData: undefined,
  })

  const SuccessMessage = new ZiroPromptMessage({
    name: 'successReceivingPolicy',
    type: 'success',
    code: '203',
    title: 'Sucesso',
    userDescription: 'Agora o cliente poderá realizar os pagamentos!',
    userResolution: 'Clique em ok para sair.',
    internalDescription: 'prompt de sucesso',
    illustration: 'paymentSuccess',
    additionalData: undefined,
  })

  const SuccessMessageArchived = new ZiroPromptMessage({
    name: 'successReceivingPolicy',
    type: 'success',
    code: '203',
    title: 'Sucesso',
    userDescription: 'Arquivado!',
    userResolution: 'Clique em ok para sair.',
    internalDescription: 'prompt de sucesso',
    illustration: 'paymentSuccess',
    additionalData: undefined,
  })
  const FailureMessage = new ZiroPromptMessage({
    name: 'failureReceivingPolicy',
    type: 'destructive',
    code: '204',
    title: 'Falha',
    userDescription: 'Falha ao atualizar o status de antifraude do cliente, tente novamente.',
    userResolution: 'Clique em ok para sair.',
    internalDescription: 'prompt de falha',
    illustration: 'errorLoading',
    additionalData: undefined,
  })
  return (
    <>
      <div style={{ marginTop: marginTop || '0px' }}>
        <Button
          type="button"
          cta="Aprovar"
          submitting={isLoadingButton}
          click={async () => {
            await setPromiseMessage(PromptMessage)
            const promise = new Promise(async resolve => {
              try {
                setIsLoading(true)

                await db
                  .collection('catalog-user-data')
                  .doc(actualCardCollection.idParent)
                  .collection('cards')
                  .doc(actualCardCollection.id)
                  .update({ status: 'approved' })
                  removeRow(actualCardCollection.id)
                  setLocation('aprovacao-manual')
                resolve('Ok')
              } catch (error) {
                resolve(null)
              }
            })

            setMessage(WaitingMessage.withPromise(promise))
            const result = await promise
            setMessage(result ? SuccessMessage : FailureMessage)
          }}
        />
      </div>
      <div style={{ marginTop: '10px', marginBottom: '20px' }}>
        <Button
          type="button"
          cta="Arquivar"
          template="destructive"
          submitting={isLoadingButton}
          click={async () => {
            await setPromiseMessage(PromptMessageArchived)
            const promise = new Promise(async resolve => {
              try {
                setIsLoading(true)

                await db
                  .collection('catalog-user-data')
                  .doc(actualCardCollection.idParent)
                  .collection('cards')
                  .doc(actualCardCollection.id)
                  .update({ status: 'archived' })
                  removeRow(actualCardCollection.id)
                  setLocation('aprovacao-manual')
                resolve('Ok')
              } catch (error) {
                resolve(null)
              }
            })
            setMessage(WaitingMessage.withPromise(promise))
            const result = await promise
            setMessage(result ? SuccessMessageArchived : FailureMessage)
          }}
        />
      </div>
    </>
  )
}
export default ButtonsManualApproval
