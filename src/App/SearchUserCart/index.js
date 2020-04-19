import React, { useState } from 'react'
// import { useLocation } from 'wouter'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import Error from '@bit/vitorbarbosa19.ziro.error'
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
// import { db } from '../../Firebase'
// import { fontTitle } from '@ziro/theme'

export default () => {
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [searching, setSearching] = useState(false)
    const [razao, setRazao] = useState('')
    // const search = useCallback(() => {
    //     setNotFound(false)
    //     setSearching(true)
    //     db.collection('storeowners')
    //         .where('email','==',email)
    //         .get()
    //         .then(snap => {
    //             if(!snap.empty) {
    //                 setLocation(`/pedidos/${snap.docs[0].id}`)
    //             }
    //             else {
    //                 setNotFound(true)
    //                 setSearching(false)
    //             }
    //         })
    // },[email])
    const validations = [
        {
            name: 'razao',
            validation: value => ['razão 1','razão 2'].includes(razao),
            value: razao,
            message: 'Razão inválida'
        }
    ]
    if (isLoading) return <Spinner />
    if (isError) return <Error />
    return (
        <div style={{ display: 'grid', gridGap: '20px' }}>
            <label>Procure o pedido pela razão social do lojista</label>
            <Form
                buttonOnTop={true}
                buttonName='Procurar pedido'
                validations={validations}
                sendToBackend={() => null}
                // sendToBackend={sendToBackend ? sendToBackend(state) : () => null}
                inputs={[
                    <FormInput name='razao' label='Razão social' input={
                        <Dropdown
                            value={razao}
                            submitting={searching}
                            onChange={({ target: { value } }) => setRazao(value)}
                            onChangeKeyboard={element => element ? setRazao(element.value) : null}
                            list={['razão 1','razão 2']}
                            placeholder='Razão do lojista'
                        />
                    } />,
                ]}
            />
        </div>
    )
}