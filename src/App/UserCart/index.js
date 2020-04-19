import React, { useEffect, useState } from 'react'
import { useRoute, useLocation } from 'wouter'
import Header from '@bit/vitorbarbosa19.ziro.header'
import Icon from '@bit/vitorbarbosa19.ziro.icon'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import { motion } from 'framer-motion'
import { db } from '../../Firebase'
import { cart, statusBlock, statusName, button, bubble } from './styles'
import { containerWithPadding } from '@ziro/theme'

const statusTitles = {
    open: 'Em aberto',
    waitingPayment: 'Esperando Pagamento',
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
        <div style={containerWithPadding}>
            <Header type='icon-link' title={userData.razao} navigateTo='pedidos' icon='back' />
            <div style={cart}>
                {requests && Object.entries(requests).map(([status, _requests]) => (
                    <div key={status} style={statusBlock}>
                        <label style={statusName}>{statusTitles[status]||status}</label>
                        {
                            Object.entries(_requests).map(([id, { brandName, products }]) => (
                                <motion.div 
                                    key={id}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setLocation(`pedidos/${userId}/${id}`)}
                                    style={button}
                                >
                                    <label style={{ fontSize: 16 }}>{brandName}</label>
                                    <div style={bubble}>{Object.keys(products).length}</div>
                                    <div style={{ transform: 'rotate(90deg)' }}>
                                        <Icon type='chevronUp' size={20} color='black' />
                                    </div>
                                </motion.div>
                            ))
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}