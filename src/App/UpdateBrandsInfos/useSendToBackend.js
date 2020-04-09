import { useCallback, useState } from "react"
import { db } from '../../Firebase'

export default (brandsInfos) => {

    const [isSending, setIsSending] = useState(false)
    const [sendError, setError] = useState(false)
    const [success, setSuccess] = useState(false)

    const sendToBackend = useCallback(() => {
        setIsSending(true)
        const batch = db.batch()
        brandsInfos.forEach(([brand, price, trends]) => 
            batch.set(db.collection('catalog-brands').doc(brand),{ trends, price },{ merge: true }))
        batch.commit()
            .then(() => {
                setIsSending(false)
                setSuccess(true)
            })
            .catch((error) => {
                setError(error)
                console.log({ error })
                throw error
            })
    },[brandsInfos])

    return { isSending, sendError, success, sendToBackend }
}