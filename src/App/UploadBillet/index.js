import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Error from '@bit/vitorbarbosa19.ziro.error';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner';
import Form from '@bit/vitorbarbosa19.ziro.form';
import FormInput from '@bit/vitorbarbosa19.ziro.form-input';
import InputText from '@bit/vitorbarbosa19.ziro.input-text';
import maskInput from '@ziro/mask-input';
import SingleImageUpload from '../SingleImageUpload/index';
import fetch from './fetch';
import sendToBackend from './sendToBackend';
import { container, block, title } from './styles';

export default () => {
    const [isError, setIsError] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [billets, setBillets] = useState([]);
    const [billet, setBillet] = useState('');
    const [filename, setFilename] = useState('');
    const [fileBillet, setFileBillet] = useState({});
    const setState = { setBillet, setFileBillet, setFilename };
    const state = { billet, fileBillet, ...setState };
    const validations = [
        {
            name: 'billet',
            validation: value => (/\d/g).test(value) && value.length === 5,
            value: billet,
            message: 'Boleto inválido'
        }, {
            name: 'fileBillet',
            validation: value => value !== undefined && value !== '' && /(\.jpg|\.jpeg|\.png)$/.test(value.name),
            value: fileBillet,
            message: 'Formatos válidos: .png, .jpg e .jpeg'
        }
    ];
    /*
        useEffect(() => fetch(setIsLoading, setIsError, setBillets), []);

        if (isLoading) return <div style={{ display: 'grid', marginTop: '15px' }}><Spinner size='5rem' /></div>
        if (isError) return <Error />
    */
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'grid', gridTemplateRows: '1fr auto', gridRowGap: '10px' }}>
            <div style={container}>
                <div style={block}>
                    <label style={title}>Como usar</label>
                    <label>Faça upload de imagens do seu dispositivo para atualizar a base de boletos da Ziro</label>
                </div>
            </div>
            <Form
                validations={validations}
                sendToBackend={sendToBackend ? sendToBackend(state) : () => null}
                inputs={[
                    <FormInput name='billet' label='Boleto' input={
                        <InputText
                            value={billet}
                            onChange={({ target: { value } }) => setBillet(maskInput(value, '#####', true))}
                            placeholder='Nº do boleto'
                            inputMode='numeric'
                        />
                    } />,
                    <FormInput name='fileBillet' label='Foto do boleto' input={
                        <SingleImageUpload
                            setFile={setFileBillet}
                            filename={filename ? filename : ''}
                            setFilename={setFilename}
                            indexOfFile={0}
                        />
                    } />
                ]}
            />
        </motion.div>
    )
}
