import React, { useEffect, useReducer, useState } from 'react';
import Button from '@bit/vitorbarbosa19.ziro.button';
import ImageUpload from '@bit/vitorbarbosa19.ziro.image-upload';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner-with-div';
import fetch from './fetch';
import { fileContainerClass } from './styles';
import isValidBrand from '../ImageUpload/isValidBrand';
import sendToBackend from './sendToBackend';
import { inputStateControl, onDragOver, removeImage, settingThePicturesAndFiles } from './functionsUploadImages';
import Card from '../CardForm';
import BrandChoose from './BrandChoose';
import inputs from './inputs';
import SubmitBlock from './SubmitBlock';

const UploadImages = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [brands, setBrands] = useState([]);
    const [brandsAndTrends, setBrandsAndTrends] = useState('');
    const [brand, setBrand] = useState('');
    const [pictures, setPictures] = useState([]);
    const [filesList, setFiles] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const [showButtonTop, setShowButtonTop] = useState(false);
    const [showButtonBot, setShowButtonBot] = useState(false);

    const [states, dispatch] = useReducer((state, payload) => inputStateControl(state, payload), {});

    useEffect(() => fetch(setIsLoading, setIsError, setBrands, setBrandsAndTrends), []);

    useEffect(() => {
        if (pictures[0]) setShowButtonBot(true);
        else setShowButtonBot(false);
        if (pictures[1]) setShowButtonTop(true);
        else setShowButtonTop(false);
    }, [pictures]);

    useEffect(() => {
        if (isValidBrand(brands, brand)) {
            setShowUpload(true);
        } else setShowUpload(false);
    }, [brand]);

    if (isLoading) return <Spinner size="5rem"/>;

    //if (isError) return <Error />;

    const state = {
        setIsSubmitting,
        setIsSubmitted,
        setBrand,
        states,
        brand,
        brandsAndTrends,
        filesList,
        setPictures,
        setFiles,
        dispatch,
    };

    return (
        <div>
            <BrandChoose isSubmitting={isSubmitting} brand={brand} setBrand={setBrand} brands={brands}/>
            <div style={fileContainerClass} className="fileContainer" onDragOver={onDragOver}>
                {showUpload && (
                    <>
                        <ImageUpload
                            sendToBackend={data => settingThePicturesAndFiles(data, setIsError, pictures, filesList, setPictures, setFiles)}
                            isDisabled={!isValidBrand(brands, brand) || isSubmitting}
                        />
                        {showButtonTop && (
                            <>
                                <div style={{ marginTop: '10px' }}/>
                                <Button click={() => sendToBackend(state)} submitting={isSubmitting}
                                        cta="Enviar todas fotos" type="button"/>
                            </>
                        )}
                        {pictures.map((picture, index) => {
                            const identifierOfPicture = picture.split(';')[1].split('=')[1];
                            console.log(states[`availableQuantities${identifierOfPicture}`]);
                            return (
                                <Card
                                    key={index}
                                    identifierOfPicture={identifierOfPicture}
                                    states={states}
                                    filesList={filesList}
                                    setFiles={setFiles}
                                    index={index}
                                    picture={picture}
                                    removeImage={removeImage}
                                    arrayOfInputs={inputs(states, identifierOfPicture, dispatch)}
                                    pictures={pictures}
                                    setPictures={setPictures}
                                />
                            );
                        })}
                        <div style={{ marginTop: '10px' }}/>
                        <Button click={() => sendToBackend(state)} submitting={!showButtonBot || isSubmitting}
                                cta="Enviar todas fotos" type="button"/>
                    </>
                )}
            </div>
            <SubmitBlock isSubmitting={isSubmitting} isSubmitted={isSubmitted}/>
        </div>
    );
};
export default UploadImages;
