import React, { useEffect, useReducer, useState } from 'react';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import Button from '@bit/vitorbarbosa19.ziro.button';
import fetch from './fetch';
import { fileContainerClass, fileContainerUploadIconClass, inputImagesId } from './styles';
import isValidBrand from '../ImageUpload/isValidBrand';
import sendToBackend from './sendToBackend';
import { onDragOver, onUploadClick, removeImage, settingThePicturesAndFiles } from './functions';
import Card from '../CardForm';
import ImageUpload from '@bit/vitorbarbosa19.ziro.image-upload';
import inputs from './inputs';

const UploadImages = () => {
    const [product, setProduct] = useState({ status: 'available' });
    const [products, setProducts] = useState([{}]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [brands, setBrands] = useState([]);
    const [brandsAndTrends, setBrandsAndTrends] = useState('');
    const [brand, setBrand] = useState('');
    const [pricetag, setPricetag] = useState('');
    const [photoPeriod, setPhotoPeriod] = useState('');
    const [pictures, setPictures] = useState([]);
    const [filesList, setFiles] = useState([]);
    const [errors, setErrors] = useState([]);
    const initialValue = { status: 'available' };
    const maxFileSize = 5242880;
    const desiredStates = ['sizes', 'colors', 'status', 'price', 'description', 'availableQuantitiesTest'];
    const [itemsWithState, setItemsWithState] = useState([]);

    const [states, dispatch] = useReducer((state, payload) => {
        const { userValue, index, inputType } = payload;
        switch (inputType) {
            case 'description':
                return { ...state, [`description${index}`]: userValue };
            case 'price':
                return { ...state, [`price${index}`]: userValue };
            case 'sizes':
                return { ...state, [`sizes${index}`]: userValue };
            case 'colors':
                return { ...state, [`colors${index}`]: userValue };
            case 'availableQuantities':
                return { ...state, [`availableQuantities${index}`]: userValue };
            default:
            // code block
        }
    }, {});

    useEffect(() => fetch(setIsLoading, setIsError, setBrands, setBrandsAndTrends), []);

    function onClickChoosePhotos(e) {
        e.stopPropagation();
        e.preventDefault();
        const { files } = e.target;
        settingThePicturesAndFiles(files, maxFileSize, setErrors, pictures, filesList, setPictures, setFiles, itemsWithState, setItemsWithState);
    }

    return (
        <div>
            <div style={fileContainerClass} className="fileContainer" onDragOver={onDragOver}>
                <input style={inputImagesId} id="inputImages" type="file" multiple onChange={onClickChoosePhotos}
                       onClick={onUploadClick} accept="image/*"/>

                <Icon style={fileContainerUploadIconClass} type="upload" size={50} strokeWidth={3}
                      className="uploadIcon" alt="Upload Icon"/>
                <ImageUpload
                    sendToBackend={data =>
                        settingThePicturesAndFiles(data, maxFileSize, setErrors, pictures, filesList, setPictures, setFiles, itemsWithState, setItemsWithState)
                    }
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
                    return (
                        <Card
                            key={index}
                            products={products}
                            setProducts={setProducts}
                            filesList={filesList}
                            setFiles={setFiles}
                            product={product}
                            initialValue={initialValue}
                            setProduct={setProduct}
                            index={index}
                            picture={picture}
                            removeImage={removeImage}
                            arrayOfInputs={inputs(states, index, dispatch)}
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
