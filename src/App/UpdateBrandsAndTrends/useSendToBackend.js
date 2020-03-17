import { useCallback, useState } from "react"
import { db } from '../../Firebase'

export default (brandsAndTrends) => {

    const [isSending, setIsSending] = useState(false)
    const [sendError, setError] = useState(false)
    const [success, setSuccess] = useState(false)

    const sendToBackend = useCallback(() => {
        setIsSending(true)
        const batch = db.batch()
        trends.forEach(([brand, trends]) =>
            batch.set(db.collection('catalog-brands').doc(brand),{ trends },{ merge: true }))
        batch.commit()
            .then(() => {
                setIsSending(false)
                setSuccess(true)
            })
            .catch(setError)
    },[brandsAndTrends])

    return { isSending, sendError, success, sendToBackend }
}