import React, { useState, useContext } from 'react'
import { post } from 'axios'
import { motion } from 'framer-motion'
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import InputEmail from '@bit/vitorbarbosa19.ziro.input-email'
import Modal from '@bit/vitorbarbosa19.ziro.modal'
import Illustration from '@bit/vitorbarbosa19.ziro.illustration'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner'
import Button from '@bit/vitorbarbosa19.ziro.button'
import { userContext } from '../appContext';
import sendToBackend from './sendToBackend'
import { modalBox, container, title, svg } from './styles'

const CheckEmailVerified = () => {
    const [email, setEmail] = useState('');
    const [uid, setUid] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [resendingEmail, setResendingEmail] = useState(false);
    const [finished, setFinished] = useState(false);
    const [successEmail, setSuccessEmail] = useState(false);
    const [resendStatus, setResendStatus] = useState('');
    const { nickname } = useContext(userContext);
    const setState = { setEmail, setUid, setIsOpen, resendingEmail, setResendingEmail, setResendStatus, setFinished };
    const state = { email, uid, nickname, ...setState };
    const validations = [
        {
            name: 'email',
            validation: value => /^\S+@\S+\.\S+$/g.test(value),
            value: email,
            message: 'Email inválido'
        }
    ];

    const apiValidEmail = async () => {
        const urlValidEmail = `${process.env.FIREBASE_AUTH_URL}updateUserInfo`;
        const configValidEmail = {
            headers: {
                'Content-type': 'application/json',
                'Authorization': process.env.FIREBASE_AUTH_TOKEN
            }
        };
        const body = {
            uid,
            prop: {
                emailVerified: true
            }
        };
        setEmail('');
        try {
            await post(urlValidEmail, body, configValidEmail);
            setSuccessEmail(true);
            setResendingEmail(false);
            setFinished(true);
            setResendStatus('Email validado com sucesso');
        } catch (error) {
            console.log(error);
            setSuccessEmail(false);
            setResendingEmail(false);
            setFinished(true);
            setResendStatus('Erro ao validar email. Tente novamente');
        }
    }

    const matchTitle = () => {
        if (isOpen && !resendingEmail && !finished) return 'Email não validado';
        if (isOpen && resendingEmail && !finished) return 'Aguarde...';
        if (isOpen && !resendingEmail && finished && successEmail) return 'Email validado';
        if (isOpen && !resendingEmail && finished && !successEmail) return 'Erro ao validar email';
    }

    const matchIllustration = () => {
        if (isOpen && !resendingEmail && !finished) return <Illustration type="timelineStart" size={150} />;
        if (isOpen && resendingEmail && !finished) return <Illustration type="waiting" size={150} />;
        if (isOpen && !resendingEmail && finished && successEmail) return <Illustration type="paymentSuccess" size={150} />;
        if (isOpen && !resendingEmail && finished && !successEmail) return <Illustration type="paymentError" size={150} />;
    }

    const closeModal = () => {
        setIsOpen(false);
        setResendingEmail(false);
        setFinished(false);
        setSuccessEmail(false);
        setResendStatus('');
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <>
                <Modal boxStyle={modalBox} isOpen={isOpen} setIsOpen={finished ? () => closeModal() : () => null}>
                    <div style={container}>
                        <div style={svg} >{matchIllustration()}</div>
                        <label style={title}>{matchTitle()}</label>
                        <label>{resendStatus}</label>
                        {
                            !resendingEmail && !finished &&
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap: '15px' }} >
                                <Button type="button" cta="Sim" click={async () => {
                                    setResendingEmail(true);
                                    setFinished(false);
                                    setResendStatus('Validando o email, aguarde ...');
                                    await apiValidEmail();
                                }} />
                                <Button type="button" cta="Não" template="destructive" click={() => closeModal()} />
                            </div>
                        }
                        {
                            resendingEmail && !finished && <Spinner size='3rem' />
                        }
                        {
                            !resendingEmail && finished &&
                            <Button type="button" cta="Ok" click={() => {
                                setIsOpen(false);
                                setResendingEmail(false);

                                setFinished(false);
                            }} />
                        }
                    </div>
                </Modal>

                <Form
                    validations={validations}
                    sendToBackend={sendToBackend ? sendToBackend(state) : () => null}
                    inputs={[
                        <FormInput name='email' label='Email' input={
                            <InputEmail
                                value={email}
                                setValue={setEmail}
                                placeholder='Email do usuário referido'
                            />
                        } />
                    ]}
                />
            </>
        </motion.div>
    )

}

export default CheckEmailVerified
