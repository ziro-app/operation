import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Error from '@bit/vitorbarbosa19.ziro.error';
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown';
import ImageUpload from '@bit/vitorbarbosa19.ziro.image-upload';
import SpinnerWithDiv from '@bit/vitorbarbosa19.ziro.spinner-with-div';
import SubmitBlock from './SubmitBlock';
import fetch from './fetch';
import sendToBackend from './sendToBackend';
import isValidBrand from './isValidBrand';
import { block, container, title } from './styles';

export default () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [brands, setBrands] = useState('');
    const [brandsAndTrends, setBrandsAndTrends] = useState('');
    const [brand, setBrand] = useState('');
    const [pricetag, setPricetag] = useState('');
    const [photoPeriod, setPhotoPeriod] = useState('')
    useEffect(() => fetch(setIsLoading, setIsError, setBrands, setBrandsAndTrends), [])
    useEffect(() => {
        if (brand !== '' && setIsSubmitted) setIsSubmitted(false)
    }, [brand])
    if (isLoading) return <SpinnerWithDiv size={'6rem'} />
    if (isError) return <Error />
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={container}>
            <div style={block}>
                <label style={title}>Como usar</label>
                <label>Faça upload de imagens do seu dispositivo para atualizar o catálogo Ziro com novidades das marcas</label>
            </div>
            <div style={block}>
                <label style={title}>Etapa 1</label>
                <Dropdown
                    readOnly={false}
                    submitting={isSubmitting}
                    value={brand}
                    onChange={({ target: { value } }) => setBrand(value)}
                    list={brands}
                    placeholder='Escolha uma marca'
                    onChangeKeyboard={element => element ? setBrand(element.value) : null}
                />
            </div>
            <div style={block}>
                <label style={title}>Etapa 2</label>
                <Dropdown
                    readOnly={false}
                    submitting={isSubmitting}
                    value={pricetag}
                    onChange={({ target: { value } }) => setPricetag(value)}
                    list={['Sim', 'Não']}
                    placeholder='Tem o preço na imagem?'
                    onChangeKeyboard={element => element ? setPricetag(element.value) : null}
                />
            </div>
            <div style={block}>
                <label style={title}>Etapa 3</label>
                <Dropdown
                    readOnly={false}
                    submitting={isSubmitting}
                    value={photoPeriod}
                    onChange={({ target: { value } }) => setPhotoPeriod(value)}
                    list={['Nova', 'Antiga']}
                    placeholder='A imagem é nova ou antiga?'
                    onChangeKeyboard={element => element ? setPhotoPeriod(element.value) : null}
                />
            </div>
            <div style={block}>
                <label style={title}>Etapa 4</label>
                <ImageUpload
                    sendToBackend={sendToBackend(setIsSubmitting, setIsSubmitted, setBrand, brand, brandsAndTrends, pricetag, setPricetag, photoPeriod, setPhotoPeriod)}
                    isDisabled={!isValidBrand(brands, brand) || isSubmitting}
                />
                <SubmitBlock isSubmitting={isSubmitting} isSubmitted={isSubmitted} />
            </div>
        </motion.div>
    )
}
