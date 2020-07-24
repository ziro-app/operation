import React, { useEffect, useReducer, useState } from 'react';
import Button from '@bit/vitorbarbosa19.ziro.button';
import ImageUpload from '@bit/vitorbarbosa19.ziro.image-upload';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner-with-div';
import fetch from './fetch';
import { cardContainerClass, fileContainerClass } from './styles';
import sendToBackend from './sendToBackend';
import {
    duplicateImage,
    inputStateControl,
    isValidBrand,
    onDragOver,
    removeImage,
    settingThePicturesAndFiles,
} from './functionsUploadImages';
import Card from '../CardForm';
import BrandChoose from './BrandChoose';
import inputs from './inputs';
import SubmitBlock from './SubmitBlock';
import { v4 as uuid } from 'uuid';

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
    const [thumbPhoto, setThumbPhoto] = useState('');
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
        thumbPhoto,
        setThumbPhoto,
    };
    return (
        <>
            <BrandChoose isSubmitting={isSubmitting} brand={brand} setBrand={setBrand} brands={brands}/>
            <div style={fileContainerClass} className="fileContainer" onDragOver={onDragOver}>
                {showUpload && (
                    <>
                        <ImageUpload
                            sendToBackend={data => settingThePicturesAndFiles(data, setIsError, pictures, filesList, setPictures, setFiles, uuid)}
                            isDisabled={!isValidBrand(brands, brand) || isSubmitting}
                        />
                        <div style={cardContainerClass}>
                            {showButtonTop && (
                                <>
                                    <Button click={() => sendToBackend(state)} submitting={isSubmitting}
                                            cta="Enviar todas fotos" type="button"/>
                                </>
                            )}
                            {pictures.map((picture, index) => {
                                return (
                                    <Card
                                        key={index}
                                        identifierOfPicture={picture.identifier}
                                        states={states}
                                        filesList={filesList}
                                        setFiles={setFiles}
                                        index={index}
                                        picture={picture.urlImage}
                                        removeImage={removeImage}
                                        duplicateImage={duplicateImage}
                                        arrayOfInputs={inputs(states, picture.identifier, dispatch)}
                                        pictures={pictures}
                                        setPictures={setPictures}
                                        dispatch={dispatch}
                                        uuid={uuid}
                                        thumbPhoto={thumbPhoto}
                                        setThumbPhoto={setThumbPhoto}
                                    />
                                );
                            })}
                            {showButtonBot && (
                                <Button click={() => sendToBackend(state)} submitting={!showButtonBot || isSubmitting}
                                        cta="Enviar todas fotos" type="button"/>
                            )}
                        </div>
                    </>
                )}
            </div>
            <SubmitBlock isSubmitting={isSubmitting} isSubmitted={isSubmitted}/>
        </>
    );
}
export default UploadImages;
