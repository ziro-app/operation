import React, { useEffect, useState } from 'react'
import { useRoute, useLocation } from 'wouter'
import Icon from '@bit/vitorbarbosa19.ziro.icon'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import { motion } from 'framer-motion'
import { db } from '../../Firebase'
import { button, bubble } from './styles'

const statusTitles = {
    waitingResponse: 'Esperando Resposta',
    waitingCheckout: 'Esperando Checkout',
}

export default () => {

    const { userId } = useRoute('/pedidos/:userId')[1]
    const setLocation = useLocation()[1]
    const [requests, setRequests] = useState({})
    const [queringRequests, setQueringRequests] = useState(true)
    const [userData, setUserData] = useState('')
    const [queringUser, setQueringUser] = useState(true)

    useEffect(() => {
        if(!userId) return;
        const cartObserver = db.collection('catalog-user-data')
            .doc(userId)
            .collection('cart')
            .onSnapshot((snap) => {
                const docs = snap.docChanges().reduce((prev, cur) => {
                    const { status, ...data } = cur.doc.data()
                    return { ...prev, [status]: { ...(prev[status]||{}), [cur.doc.id]: data } }
                },{})
                setRequests(old => ({ ...old, ...docs }))
                setQueringRequests(false)
            })
        const userObserver = db.collection('storeowners')
            .doc(userId)
            .onSnapshot((snap) => {
                const data = snap.data()
                setUserData(data)
                setQueringUser(false)
            })
        return () => {
            cartObserver()
            userObserver()
        }
    },[userId])

    if(!userData&&!queringUser) throw 'USER_NOT_FOUND'

    if(queringRequests||queringUser) return <Spinner />

    return (
        <div style={{ display: 'grid', gridGap: '10px' }}>
            {userData.fname && <label style={{ fontSize: '20px' }}>{`${userData.fname} ${userData.lname}`}</label>}
            {
                requests && Object.entries(requests).map(([status, _requests]) => (
                    <div key={status} style={{ display: 'grid', gridGap: '10px' }}>
                        <label style={{ fontSize: 15, color: 'grey', padding: '10px' }}>{statusTitles[status]||status}</label>
                        {
                            Object.entries(_requests).map(([id, { brand, products }]) => (
                                <motion.div 
                                    key={id}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setLocation(`pedidos/${userId}/${id}`)}
                                    style={button}
                                >
                                    <label style={{ fontSize: 16 }}>{brand}</label>
                                    <div style={bubble}>{products.length}</div>
                                    <div style={{ transform: 'rotate(90deg)' }}>
                                        <Icon type='chevronUp' size={20} color='black' />
                                    </div>
                                </motion.div>
                            ))
                        }
                    </div>
                ))
            }
        </div>
    )
}