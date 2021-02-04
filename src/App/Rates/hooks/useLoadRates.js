import { useContext, useEffect, useState } from 'react';
import { useMessage } from "@bit/vitorbarbosa19.ziro.message-modal"

import fetchRates from '../utils/fetchRates'
import { userContext } from '../../appContext'

const useGetRates = (sellerId) => {
    const [dataRows, setDataRows] = useState([])
    const [isLoading, setLoading] = useState(true)
    const [isError, setError] = useState(false)

    const setMessage = useMessage();
    //const { zoopId } = useContext(userContext);

    const brands = [
        'americanexpress',
        'elo',
        'hipercard',
        'mastercard',
        'visa'
    ]

    useEffect(() => {
        fetchRates(
            sellerId,
            setLoading,
            setError,
            setDataRows,
            brands,
            setMessage
        )
    }, [])

    return {
        dataRows,
        isLoading,
        isError
    }
}

export default useGetRates
