import React, { useContext, useEffect, useReducer, useState } from 'react';
import Button from '@bit/vitorbarbosa19.ziro.button';
import ImageUpload from '@bit/vitorbarbosa19.ziro.image-upload';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner-with-div';
import { v4 as uuid } from 'uuid';
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
import ToastNotification from '../ToastNotification';
import { userContext } from '../appContext';

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
    const [openToast, setOpenToast] = useState(false);
    const [typeOfToast, setTypeOfToast] = useState('alert');
    const [messageToast, setMessageToast] = useState('');
    const [thumbPhoto, setThumbPhoto] = useState('');
    const [states, dispatch] = useReducer((state, payload) => inputStateControl(state, payload), {});
    const defaultQuantityValue = 2;
    const { device } = useContext(userContext);
    useEffect(() => fetch(setIsLoading, setIsError, setBrands, setBrandsAndTrends), []);

    useEffect(() => {
        if (filesList.length === 0) setThumbPhoto('');
    }, [filesList]);

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

    // if (isError) return <Error />;

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
        setOpenToast,
        setMessageToast,
        setTypeOfToast,
    };
    return (
        <>
            <BrandChoose isSubmitting={isSubmitting} brand={brand} setBrand={setBrand} brands={brands}/>
            <div style={fileContainerClass} className="fileContainer" onDragOver={onDragOver}>
                <ToastNotification openToastRoot={openToast} setOpenToastRoot={setOpenToast}
                                   messageToastRoot={messageToast} type={typeOfToast}/>
                {showUpload && (
                    <>
                        <ImageUpload
                            sendToBackend={data =>
                                settingThePicturesAndFiles(
                                    data,
                                    setIsError,
                                    pictures,
                                    filesList,
                                    setPictures,
                                    setFiles,
                                    uuid,
                                    states,
                                    dispatch,
                                    thumbPhoto,
                                    setThumbPhoto,
                                )
                            }
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
                                    <div key={index} initial={{ scale: 0.5 }} animate={{ scale: 1 }}
                                         transition={{ duration: 0.5 }} exit={{ opacity: 0 }}>
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
                                            arrayOfInputs={inputs(states, picture.identifier, dispatch, defaultQuantityValue, device, isSubmitting)}
                                            pictures={pictures}
                                            setPictures={setPictures}
                                            dispatch={dispatch}
                                            uuid={uuid}
                                            thumbPhoto={thumbPhoto}
                                            setThumbPhoto={setThumbPhoto}
                                        />
                                    </div>
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
        </>
    );
}
export default UploadImages;
