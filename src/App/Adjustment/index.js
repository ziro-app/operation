import React, { useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import Error from '@bit/vitorbarbosa19.ziro.error'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import Calendar from '@bit/vitorbarbosa19.ziro.calendar'
import currencyFormat from '@ziro/currency-format'
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import maskInput from '@ziro/mask-input'
import InputText from '@bit/vitorbarbosa19.ziro.input-text'
// import Button from '@bit/vitorbarbosa19.ziro.button'
// import Modal from '@bit/vitorbarbosa19.ziro.modal'
// import shutdown from './shutdown'
import fetch from './fetch'
import listModeloParcela2 from '../CommissionModels/utils/arrayModelos'
import sendToBackend from './sendToBackend'
import { userContext } from '../appContext'

const CommissionModels = () => {
    const [apelidos, setApelidos] = useState([])
    const [apelido, setApelido] = useState('')
    const [parcela, setParcela] = useState('')
    const [escopo, setEscopo] = useState('')
    const [inputDate, setInputDate] = useState('')
    const [focused, setFocused] = useState('')
    const [modeloParcela, setModeloParcela] = useState('')
    const [dataReajuste, setDataReajuste] = useState('')
    const [informacoes, setInformacoes] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const [error, setError] = useState(false)
    const { nickname } = useContext(userContext)
    const nome = nickname ? nickname.trim() : ''
    const state = { setIsLoading, setError, setApelidos, setIsOpen, setApelido, setDataReajuste, parcela, modeloParcela, escopo, apelido, inputDate }
    const newListModelos = [...listModeloParcela2(), 'nenhum']
    const allowedUsers = ['Mud', 'Uiller', 'Vitor', 'Claudia', 'Cesar', 'Guilherme', 'Carolina']
    useEffect(() => fetch(state), [])
    useEffect(() => {
        if (apelido && apelidos.includes(apelido)) {
            const filter = dataReajuste.filter(item => item.apelido === apelido)[0]
            setInformacoes(filter)
            setParcela(`${filter.parcela1}00`)
            setModeloParcela(filter.modeloParcela2)
            setEscopo(filter.escopo)
        }
    }, [apelido])
    if (process.env.HOMOLOG ? false : !allowedUsers.includes(nome)) return <Error type='paymentError' title='Sem acesso' message='Sem permissão para acessar essa página' btnMsg='Voltar' backRoute='/administrativo' />
    if (error) return <Error />
    if (isLoading) return <Spinner />
    const validations = [
        {
            name: 'parcela',
            validation: value => value,
            value: parcela,
            message: 'Parcela 1 incorreta'
        },
        {
            name: 'modeloParcela',
            validation: value => newListModelos.includes(value),
            value: modeloParcela,
            message: 'Valor não esta na lista'
        },
        {
            name: 'escopo',
            validation: value => value,
            value: escopo,
            message: 'Escopo incorreto'
        }
    ]
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Dropdown
                value={apelido || ''}
                list={apelidos}
                placeholder="Escolha um membro do time"
                onChange={({ target: { value } }) => { setApelido(value) }}
                onChangeKeyboard={element => element ? setApelido(element.value) : null}
            />
            {apelidos.includes(apelido) && (
                <div style={{ marginTop: '20px' }}>
                    <Form
                        validations={validations}
                        sendToBackend={() => sendToBackend(state)}
                        inputs={[
                            <FormInput
                                name="inputDate"
                                label="Data do Reajuste"
                                input={
                                    <Calendar
                                        inputDate={inputDate}
                                        setInputDate={setInputDate}
                                        focused={focused}
                                        setFocused={setFocused}
                                        placeholder={'Data de reajuste'}
                                    />
                                }
                            />,
                            <FormInput
                                name="parcela"
                                label="Parcela 1"
                                input={
                                    <InputText
                                        value={currencyFormat(parcela)}
                                        onChange={({ target: { value } }) => {
                                            const toInteger = parseInt(value.replace(/[R$\.,]/g, ''), 10)
                                            return setParcela(maskInput(toInteger, '#######', true))
                                        }}
                                        placeholder='Digite a nova parcela 1'
                                        inputMode="numeric"
                                    />
                                }
                            />,
                            <FormInput
                                name="modeloParcela"
                                label="Modelo Parcela 2"
                                input={
                                    <Dropdown
                                        value={modeloParcela || ''}
                                        list={newListModelos}
                                        placeholder="Digite o novo modelo de parcela"
                                        onChange={({ target: { value } }) => { setModeloParcela(value) }}
                                        onChangeKeyboard={element => element ? setModeloParcela(element.value) : null}
                                    />
                                }
                            />,
                            <FormInput
                                name="escopo"
                                label="Escopo"
                                input={
                                    <InputText
                                        value={escopo}
                                        onChange={({ target: { value } }) => {
                                            return setEscopo(value)
                                        }}
                                        placeholder='Digite o novo escopo'
                                    />
                                }
                            />,
                        ]}
                    />
                    {/* <div style={{marginTop:'20px'}}>
                            <Button type="button" cta="Desligamento" template="destructive" click={() => setIsOpen(true)}/>
                        </div>
                        <Modal isOpen={isOpen} setIsOpen={() => setIsOpen(false)}>
                            {!inputDate ? (
                                <>
                                    <label>Preencha o campo de data reajuste com a data de desligamento</label>
                                    <div style={{marginTop:'20px'}}>
                                        <Button type="button" cta="Voltar" click={() => setIsOpen(false)}/>
                                    </div>
                                </>
                            ):(
                                <>
                                    <label>Desligamento de <b>{apelido}</b> no dia <b>{inputDate}</b></label>
                                    <div style={{display:'flex',marginTop:'20px', justifyContent:'space-around'}}>
                                        <div style={{width:'45%'}}>
                                            <Button type="button" cta="Confirmar" click={() => shutdown(state)}/>
                                        </div>
                                        <div style={{width:'45%'}}>
                                            <Button type="button" cta="Voltar" click={() => setIsOpen(false)}/>
                                        </div>
                                    </div>
                                </>
                            )}
                        </Modal> */}
                </div>
            )}
        </motion.div>
    )
}

export default CommissionModels
