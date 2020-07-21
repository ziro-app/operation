import React, { useEffect, useReducer, useState } from 'react';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import Button from '@bit/vitorbarbosa19.ziro.button';
import ImageUpload from '@bit/vitorbarbosa19.ziro.image-upload';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner-with-div';
import fetch from './fetch';
import { fileContainerClass, fileContainerUploadIconClass } from './styles';
import isValidBrand from '../ImageUpload/isValidBrand';
import sendToBackend from './sendToBackend';
import { inputStateControl, onDragOver, removeImage, settingThePicturesAndFiles } from './functions';
import Card from '../CardForm';
import BrandChoose from './BrandChoose';
import inputs from './inputs';

const UploadImages = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [brands, setBrands] = useState([]);
    const [brandsAndTrends, setBrandsAndTrends] = useState('');
    const [brand, setBrand] = useState('');
    const [pictures, setPictures] = useState([]);
    const [filesList, setFiles] = useState([]);
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

    if (isLoading) return <Spinner size="5rem"/>;

    //if (isError) return <Error />;

    return (
        <div>
            <BrandChoose isSubmitting={isSubmitting} brand={brand} setBrand={setBrand} brands={brands}/>
            <div style={fileContainerClass} className="fileContainer" onDragOver={onDragOver}>
                <Icon style={fileContainerUploadIconClass} type="upload" size={50} strokeWidth={3}
                      className="uploadIcon" alt="Upload Icon"/>
                <ImageUpload
                    sendToBackend={data => settingThePicturesAndFiles(data, setIsError, pictures, filesList, setPictures, setFiles)}
                    isDisabled={!isValidBrand(brands, brand) || isSubmitting}
                />
                {showButtonTop && (
                    <>
                        <div style={{ marginTop: '10px' }}/>
                        <Button click={() => sendToBackend(setIsSubmitting)} submitting={isSubmitting}
                                cta="Enviar todas fotos" type="button"/>
                    </>
                )}
                {pictures.map((picture, index) => {
                    const identifierOfPicture = picture.split(';')[1].split('=')[1];
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
                <Button click={() => sendToBackend(setIsSubmitting)} submitting={!showButtonBot || isSubmitting}
                        cta="Enviar todas fotos" type="button"/>
            </div>
        </div>
    );
};
export default UploadImages;
