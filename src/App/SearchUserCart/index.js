import React, { useState, useCallback } from 'react'
import { useLocation } from 'wouter'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import Input from '@bit/vitorbarbosa19.ziro.input-text'
import Button from '@bit/vitorbarbosa19.ziro.button'
import { db } from '../../Firebase'
import { fontTitle } from '@ziro/theme'

export default () => {
    const [l,setLocation] = useLocation()
    const [email, setEmail] = useState()
    const [notFound, setNotFound] = useState(false)
    const [searching, setSearching] = useState(false)

    const search = useCallback(() => {
        setNotFound(false)
        setSearching(true)
        db.collection('storeowners')
            .where('email','==',email)
            .get()
            .then(snap => {
                if(!snap.empty) {
                    setLocation(`/pedidos/${snap.docs[0].id}`)
                }
                else {
                    setNotFound(true)
                    setSearching(false)
                }
            })
    },[email])

    return (
        <div style={{ display: 'grid', gridGap: '20px' }}>
            <label>Digite o email do lojista para ver seus pedidos</label>
            <Input
                placeholder='lojista@exemplo.com'
                value={email}
                onChange={({ target: { value } }) => setEmail(value)}
            />
            <Button
                type='button'
                cta='Procurar'
                click={search}
            />
            { searching && <Spinner /> }
            { !searching && notFound && 
                <label style={{
                    marginTop: '20px',
                    fontFamily: fontTitle,
                    fontSize: '1.5rem',
                    textAlign: 'center'
                }}>Nenhum lojista encontrado</label> }
        </div>
    )
}