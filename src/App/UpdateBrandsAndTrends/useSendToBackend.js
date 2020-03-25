import { useCallback, useState } from "react"
import { db } from '../../Firebase'

export default (brandsAndTrends) => {

    const [isSending, setIsSending] = useState(false)
    const [sendError, setError] = useState(false)
    const [success, setSuccess] = useState(false)

    const sendToBackend = useCallback(() => {
        setIsSending(true)
        const batch = db.batch()
        brandsAndTrends.forEach(([brand, trends, price]) => 
            batch.set(db.collection('catalog-brands').doc(brand),{ trends, price },{ merge: true }))
        batch.commit()
            .then(() => {
                setIsSending(false)
                setSuccess(true)
            })
            .catch(setError)
    },[brandsAndTrends])

    return { isSending, sendError, success, sendToBackend }
}