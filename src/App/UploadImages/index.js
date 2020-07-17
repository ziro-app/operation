import React, { useEffect, useReducer, useState } from 'react';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown';
import Button from '@bit/vitorbarbosa19.ziro.button';
import fetch from './fetch';
import { fileContainerClass, fileContainerUploadIconClass, inputImagesId, phases } from './styles';
import isValidBrand from '../ImageUpload/isValidBrand';
import { title } from '../ImageUpload/styles';
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
        //console.log('state', state);
        //console.log('payload', payload);
        const { userValue, index } = payload;
        const newState = { [`description${index}`]: userValue };
        console.log('newState', newState);
        return newState;
    }, {});

    useEffect(() => fetch(setIsLoading, setIsError, setBrands, setBrandsAndTrends), []);
    useEffect(() => {
        console.log('teste', states);
    }, [states]);

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
                <div style={phases}>
                    <label style={title}>Etapa 1</label>
                    <Dropdown
                        readOnly={false}
                        submitting={isSubmitting}
                        value={brand}
                        onChange={({ target: { value } }) => setBrand(value)}
                        list={brands}
                        placeholder="Escolha uma marca"
                        onChangeKeyboard={element => (element ? setBrand(element.value) : null)}
                    />
                </div>
                <div style={phases}>
                    <label style={title}>Etapa 2</label>
                    <Dropdown
                        readOnly
                        submitting={isSubmitting}
                        value={pricetag}
                        onChange={({ target: { value } }) => setPricetag(value)}
                        list={['Sim', 'Não']}
                        placeholder="Tem o preço na imagem?"
                        onChangeKeyboard={element => (element ? setPricetag(element.value) : null)}
                    />
                </div>
                <div style={phases}>
                    <label style={title}>Etapa 3</label>
                    <Dropdown
                        readOnly
                        submitting={isSubmitting}
                        value={photoPeriod}
                        onChange={({ target: { value } }) => setPhotoPeriod(value)}
                        list={['Nova', 'Antiga']}
                        placeholder="A imagem é nova ou antiga?"
                        onChangeKeyboard={element => (element ? setPhotoPeriod(element.value) : null)}
                    />
                </div>

                <label style={title}>Etapa 4</label>
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
                            arrayOfInputs={inputs(filesList, index, dispatch)}
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
