import React, { useEffect, useReducer, useState } from 'react';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import Button from '@bit/vitorbarbosa19.ziro.button';
import ImageUpload from '@bit/vitorbarbosa19.ziro.image-upload';
import fetch from './fetch';
import { fileContainerClass, fileContainerUploadIconClass, inputImagesId } from './styles';
import isValidBrand from '../ImageUpload/isValidBrand';
import sendToBackend from './sendToBackend';
import { onDragOver, onUploadClick, removeImage, settingThePicturesAndFiles } from './functions';
import Card from '../CardForm';
import inputs from './inputs';

const UploadImages = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [brands, setBrands] = useState([]);
    const [brandsAndTrends, setBrandsAndTrends] = useState('');
    const [brand, setBrand] = useState('');
    const [pricetag, setPricetag] = useState('');
    const [photoPeriod, setPhotoPeriod] = useState('');
    const [pictures, setPictures] = useState([]);
    const [filesList, setFiles] = useState([]);
    const [errors, setErrors] = useState([]);
    const initialValue = { status: 'available' };

    const [states, dispatch] = useReducer((state, payload) => {
        const { userValue, identifierOfPicture, inputType } = payload;
        switch (inputType) {
            case 'description':
                return { ...state, [`description${identifierOfPicture}`]: userValue };
            case 'price':
                return { ...state, [`price${identifierOfPicture}`]: userValue };
            case 'sizes':
                return { ...state, [`sizes${identifierOfPicture}`]: userValue };
            case 'colors':
                return { ...state, [`colors${identifierOfPicture}`]: userValue };
            case 'availableQuantities':
                if (/^[0-9]*$/gm.test(userValue)) {
                    return {
                        ...state,
                        [`availableQuantities${identifierOfPicture}`]: userValue,
                    };
                }
                return {
                    ...state,
                    [`availableQuantities${identifierOfPicture}`]: '',
                };

                break;
            case 'clear':
                return {};
            default:
            // code block
        }
    }, {});

    useEffect(() => fetch(setIsLoading, setIsError, setBrands, setBrandsAndTrends), []);

    function onClickChoosePhotos(e) {
        e.stopPropagation();
        e.preventDefault();
        const { files } = e.target;
        settingThePicturesAndFiles(files, setErrors, pictures, filesList, setPictures, setFiles);
    }

    return (
        <div>
            <div style={fileContainerClass} className="fileContainer" onDragOver={onDragOver}>
                <input style={inputImagesId} id="inputImages" type="file" multiple onChange={onClickChoosePhotos}
                       onClick={onUploadClick} accept="image/*"/>

                <Icon style={fileContainerUploadIconClass} type="upload" size={50} strokeWidth={3}
                      className="uploadIcon" alt="Upload Icon"/>
                <ImageUpload
                    sendToBackend={data => settingThePicturesAndFiles(data, setErrors, pictures, filesList, setPictures, setFiles)}
                    //isDisabled={!isValidBrand(brands, brand) || isSubmitting}
                />
                {pictures[1] && (
                    <>
                        <div style={{ marginTop: '10px' }}/>
                        <Button
                            click={() => sendToBackend(setIsSubmitting)}
                            submitting={!pricetag || !photoPeriod || !brand || !isValidBrand(brands, brand) || isSubmitting}
                            cta={'Enviar todas fotos'}
                            type="button"
                        />
                    </>
                )}
                {pictures.map((picture, index) => {
                    const identifierOfPicture = picture.slice(5, 60);
                    //console.log(picture);
                    return (
                        <Card
                            key={index}
                            identifierOfPicture={identifierOfPicture}
                            states={states}
                            filesList={filesList}
                            setFiles={setFiles}
                            initialValue={initialValue}
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
                <Button
                    click={() => sendToBackend(setIsSubmitting)}
                    submitting={!pricetag || !photoPeriod || !brand || !isValidBrand(brands, brand) || isSubmitting}
                    cta={'Enviar todas fotos'}
                    type="button"
                />
            </div>
        </div>
    );
};
export default UploadImages;
