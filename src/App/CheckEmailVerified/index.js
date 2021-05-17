import React, { useState } from 'react'
import { post } from 'axios'
import { motion } from 'framer-motion'
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import Modal from '@bit/vitorbarbosa19.ziro.modal'
import Illustration from '@bit/vitorbarbosa19.ziro.illustration'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner'
import Button from '@bit/vitorbarbosa19.ziro.button'
import matchForm from './matchForm'
import sendToBackend from './sendToBackend'
import { modalBox, container, title, svg } from './styles'
import validateDocuments from '../utils/validateDocuments'

const CheckEmailVerified = () => {
    const [app, setApp] = useState('');
    const appList = ['Catálogo', 'Fabricantes'];
    const [type, setType] = useState('');
    const typeList = ['CNPJ', 'Email'];
    const [cnpj, setCnpj] = useState('');
    const [email, setEmail] = useState('');
    const [link, setLink] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [resendingEmail, setResendingEmail] = useState(false);
    const [finished, setFinished] = useState(false);
    const [successEmail, setSuccessEmail] = useState(false);
    const [resendStatus, setResendStatus] = useState('');
    const [uid, setUid] = useState('');
    const [appName, setAppName] = useState('');
    const setState = { setCnpj, setEmail, setType, setApp, setIsOpen, resendingEmail, setResendingEmail, setResendStatus, setLink, setFinished, setUid, setAppName };
    const state = { cnpj, email, type, link, app, appList, uid, appName, ...setState };
    const validations = [
        {
            name: 'cnpj',
            validation: value => type === 'CNPJ' ? /(^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$)/.test(value) && (process.env.HOMOLOG ? true : validateDocuments(value)) : true,
            value: cnpj,
            message: 'CNPJ inválido'
        }, {
            name: 'email',
            validation: value => type === 'Email' ? /^\S+@\S+\.\S+$/g.test(value) : true,
            value: email,
            message: 'Email inválido'
        }, {
            name: 'type',
            validation: value => typeList.includes(value),
            value: type,
            message: 'Tipo inválido'
        }, {
            name: 'app',
            validation: value => type === 'CNPJ' ? appList.includes(value) : true,
            value: app,
            message: 'Aplicativo inválido'
        }
    ];

    const generateLink = async () => {
        let body;
        if (type === 'Email') {
            body = {
                email,
                type
            };
        } else {
            body = {
                type,
                uid,
                app: appName
            };
        }
        const url = `${process.env.FIREBASE_AUTH_URL}resendConfirmEmail`;
        const config = {
            headers: {
                'Content-type': 'application/json',
                'Authorization': process.env.FIREBASE_AUTH_TOKEN
            }
        };
        try {
            const { data: { link } } = await post(url, body, config);
            return link;
        } catch (error) {
            clear();
            setType('');
            throw error;
        }
    }

    const apiResendEmail = async () => {
        const urlEmail = process.env.API_EMAIL;
        const configEmail = {
            headers: {
                'Content-type': 'application/json',
                'Authorization': process.env.EMAIL_TOKEN
            }
        };
        try {
            const confirmLink = await generateLink();
            const body = {
                to: email,
                customEmail: false,
                confirmEmail: {
                    link: confirmLink
                }
            };
            setCnpj('');
            setEmail('');
            setApp('');
            setType('');
            await post(urlEmail, body, configEmail);
            setSuccessEmail(true);
            setResendingEmail(false);
            setFinished(true);
            setResendStatus('Email de confirmação enviado com sucesso');
        } catch (error) {
            console.log(error);
            if (error.response && error.response.data.erro) setResendStatus(error.response.data.erro);
            else setResendStatus('Erro ao enviar email de confirmação. Tente novamente');
            setSuccessEmail(false);
            setResendingEmail(false);
            setFinished(true);
        }
    }

    const clear = () => {
        setCnpj('');
        setEmail('');
        setApp('');
    }

    const matchTitle = () => {
        if (isOpen && !resendingEmail && !finished) return 'Email não confirmado';
        if (isOpen && resendingEmail && !finished) return 'Aguarde...';
        if (isOpen && !resendingEmail && finished && successEmail) return 'Email enviado';
        if (isOpen && !resendingEmail && finished && !successEmail) return 'Erro ao enviar email';
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
                                    setResendStatus('Enviando email de confirmação, aguarde ...');
                                    await apiResendEmail();
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
                        <FormInput name='type' label='Campo de busca' input={
                            <Dropdown
                                value={type}
                                onChange={({ target: { value } }) => {
                                    setType(value);
                                    clear();
                                }}
                                onChangeKeyboard={element => {
                                    if (element) {
                                        setType(element.value)
                                        clear();
                                    }
                                    else null
                                }
                                }
                                readOnly={true}
                                list={typeList}
                                placeholder="Buscar por cnpj ou email"
                            />}
                        />,
                        ...matchForm(state)
                    ]}
                />
            </>
        </motion.div>
    )

}

export default CheckEmailVerified
