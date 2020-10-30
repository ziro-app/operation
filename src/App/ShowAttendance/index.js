import React, { useState, useEffect, useRef } from 'react'
import InputEdit from '@bit/vitorbarbosa19.ziro.input-edit'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner'
import Error from '@bit/vitorbarbosa19.ziro.error'
import Logo from '@bit/vitorbarbosa19.ziro.logo'
import SocialMedia from '@bit/vitorbarbosa19.ziro.social-media'
import { containerWithPadding } from '@ziro/theme'
import fetch from './fetch'
import { container, name, block, blockTitle, containerOneColumn, containerTwoColumnButton, bar } from './styles'

const ShowInfo = () => {
    const atendimento = new URLSearchParams(window.location.search).get('atendimento')
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const textAreaRef = useRef(null)
    const [attendanceInfo, setAttendanceInfo] = useState({ assessor: '', lojista:'', categoria: '', tipo: '', despacho: '', horario: '', transporte:'', endereco:'', tipoFardo: '', nota:''})
    useEffect(() => fetch(setIsLoading, setIsError, setAttendanceInfo, new URLSearchParams(window.location.search).get('atendimento')), [])

    if (isLoading) return <div style={{ display: 'grid' }}><Spinner size='5rem' /></div>
    if (isError) return <Error />

    return (
        <div style={containerWithPadding}>
            <input type="text" style={{ position: 'absolute', left: '-9999px' }} value={attendanceInfo.cnpj} ref={textAreaRef} readOnly />
            <div style={container}>
                <Logo />
                <label style={name}>Ziro Negócios Digitais Ltda</label>
                <label>28.026.371/0001-61</label>
                <label>R. Lubavitch, 71, Bom Retiro</label>
                <label>01123-110, São Paulo - SP</label>
                <SocialMedia />
            </div>
            <div style={block}>
                <hr style={bar} />
                <label style={blockTitle}>Informações do Atendimento</label>
                <div style={containerTwoColumnButton} >
                    <InputEdit
                        name="Atendimento"
                        value={atendimento || ''}
                        onChange={() => { }}
                        validateInput={() => { }}
                        submit={() => { }}
                        setError={() => { }}
                        error={''}
                        editable={false}
                        isLoading={false}
                    />
                </div>
                <div style={containerOneColumn} >
                    <InputEdit
                        name="Assessor"
                        value={attendanceInfo.assessor ? attendanceInfo.assessor : ''}
                        onChange={() => {}}
                        validateInput={() => {}}
                        submit={() => { }}
                        setError={() => { }}
                        error={''}
                        editable={false}
                        isLoading={false}
                    />
                    <InputEdit
                        name="Lojista"
                        value={attendanceInfo.lojista? attendanceInfo.lojista : ''}
                        onChange={() => { }}
                        validateInput={() => { }}
                        submit={() => { }}
                        setError={() => { }}
                        error={''}
                        editable={false}
                        isLoading={false}
                    />
                    <InputEdit
                        name="Data de Despacho"
                        value={attendanceInfo.despacho? attendanceInfo.despacho: ''}
                        onChange={() => { }}
                        validateInput={() => { }}
                        submit={() => { }}
                        setError={() => { }}
                        error={''}
                        editable={false}
                        isLoading={false}
                    />
                    <InputEdit
                        name="Horário de Despacho"
                        value={attendanceInfo.horario? attendanceInfo.horario : ''}
                        onChange={() => {}}
                        validateInput={() => {}}
                        submit={() => {}}
                        setError={() => { }}
                        error={''}
                        editable={false}
                        isLoading={false}
                    />
                    <InputEdit
                        name="Transporte"
                        value={attendanceInfo.transporte? attendanceInfo.transporte : ''}
                        onChange={() => {}}
                        validateInput={() => {}}
                        submit={() => {}}
                        setError={() => { }}
                        error={''}
                        editable={false}
                        isLoading={false}
                    />
                    <InputEdit
                        name="Endereço de Entrega"
                        value={attendanceInfo.endereco? attendanceInfo.endereco : ''}
                        onChange={() => {}}
                        validateInput={() => {}}
                        submit={() => {}}
                        setError={() => { }}
                        error={''}
                        editable={false}
                        isLoading={false}
                    />
                    <InputEdit
                        name="Nota Fiscal"
                        value={attendanceInfo.nota? attendanceInfo.nota : ''}
                        onChange={() => {}}
                        validateInput={() => {}}
                        submit={() => {}}
                        setError={() => { }}
                        error={''}
                        editable={false}
                        isLoading={false}
                    />
                    <InputEdit
                        name="Observação"
                        value={attendanceInfo.obs? attendanceInfo.obs : ''}
                        onChange={() => {}}
                        validateInput={() => {}}
                        submit={() => {}}
                        setError={() => { }}
                        error={''}
                        editable={false}
                        isLoading={false}
                    />
                </div>
                <hr style={bar} />
                    <InputEdit
                        name="A Retirar"
                        value={attendanceInfo.aRetirar? attendanceInfo.aRetirar : ''}
                        onChange={() => {}}
                        validateInput={() => {}}
                        submit={() => {}}
                        setError={() => { }}
                        error={''}
                        editable={false}
                        isLoading={false}
                    />
                    <InputEdit
                        name="Retirados"
                        value={attendanceInfo.retirados? attendanceInfo.retirados : ''}
                        onChange={() => {}}
                        validateInput={() => {}}
                        submit={() => {}}
                        setError={() => { }}
                        error={''}
                        editable={false}
                        isLoading={false}
                    />
                    <InputEdit
                        name="Rastreio"
                        value={attendanceInfo.rastreio? attendanceInfo.rastreio : ''}
                        onChange={() => {}}
                        validateInput={() => {}}
                        submit={() => {}}
                        setError={() => { }}
                        error={''}
                        editable={false}
                        isLoading={false}
                    />
                    <InputEdit
                        name="Status"
                        value={attendanceInfo.status? attendanceInfo.status : ''}
                        onChange={() => {}}
                        validateInput={() => {}}
                        submit={() => {}}
                        setError={() => { }}
                        error={''}
                        editable={false}
                        isLoading={false}
                    />
            </div>
        </div>
    )
}

export default ShowInfo
