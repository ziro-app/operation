import React, { useState, useEffect } from 'react'
import { useLocation } from 'wouter'
import fetch from './fetch'
import sendToBackend from './sendToBackend'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import Error from '@bit/vitorbarbosa19.ziro.error'
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'

export default () => {
    const [, setLocation] = useLocation()
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [storeowners, setStoreowners] = useState([])
    const [razao, setRazao] = useState('')
    const state = { razao, setLocation }
    const validations = [
        {
            name: 'razao',
            validation: value => storeowners.includes(value),
            value: razao,
            message: 'Razão inválida'
        }
    ]
    useEffect(() => fetch(setIsLoading, setIsError, setStoreowners), [])
    if (isLoading) return <Spinner />
    if (isError) return <Error />
    return (
        <div style={{ display: 'grid', gridRowGap: '20px' }}>
            <label>Procure o pedido pela razão social do lojista</label>
            <Form
                buttonOnTop={true}
                buttonName='Procurar pedido'
                validations={validations}
                sendToBackend={sendToBackend ? sendToBackend(state) : () => null}
                inputs={[
                    <FormInput name='razao' label='Razão social' input={
                        <Dropdown
                            value={razao}
                            onChange={({ target: { value } }) => setRazao(value)}
                            onChangeKeyboard={element => element ? setRazao(element.value) : null}
                            list={storeowners}
                            placeholder='Razão do lojista'
                        />
                    } />,
                ]}
            />
        </div>
    )
}