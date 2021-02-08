import React, {useEffect, useState, useContext} from 'react'
import Chart from 'react-apexcharts'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import Error from '@bit/vitorbarbosa19.ziro.error'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import {dataConfig, optionsConfig} from './configGraph'
import { userContext } from '../appContext'
import fetch from './fetch'
import fetchGraph from './fetchGraph'

const Pagamentos = () => {
    const [arrayParcela1, setArrayParcela1] = useState([])
    const [arrayParcela2, setArrayParcela2] = useState([])
    const [categories, setCategories] = useState([])
    const [paymentResume, setPaymentResume] = useState([])
    const [ano, setAno] = useState('2020')
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(false)
    const { nickname } = useContext(userContext)
    const state = {paymentResume, setPaymentResume, ano, arrayParcela1, setArrayParcela1, arrayParcela2, setArrayParcela2, categories, setCategories, isLoading, setIsLoading, error, setError, nickname}
    useEffect(() => fetch(state),[])
    useEffect(() => fetchGraph(state),[ano, paymentResume])
    if(error) return <Error />
    if(isLoading) return <Spinner />
    return (
        <>
            <FormInput name='ano' label='Ano do pagamento' input={
                <Dropdown
                    readOnly={false}
                    value={ano}
                    onChange={({ target: { value } }) => setAno(value)}
                    list={['2020', '2021']}
                    placeholder="Escolha um ano"
                    onChangeKeyboard={element =>
                    element ? setAno(element.value) : null
                    }
                />
            } />
            <Chart series={dataConfig(arrayParcela1, arrayParcela2)} options={optionsConfig(categories, nickname)} type="bar" width="100%" height='400px' />
        </>
    )
}

export default Pagamentos