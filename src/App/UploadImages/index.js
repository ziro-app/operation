import React, { useEffect, useMemo, useState } from 'react';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown';
import Button from '@bit/vitorbarbosa19.ziro.button';
import fetch from './fetch';
import { fileContainerClass, fileContainerUploadIconClass, inputImagesId, phases } from './styles';
import isValidBrand from '../ImageUpload/isValidBrand';
import { title } from '../ImageUpload/styles';
import sendToBackend from './sendToBackend';
import { hasExtension, onDragOver, onUploadClick, readFile } from './functions';
import Card from '../CardForm';
import inputs from './inputs';
//import Card from '@bit/vitorbarbosa19.ziro.card-form';
import ImageUpload from '@bit/vitorbarbosa19.ziro.image-upload';

const PTstatus = {
    available: 'Disponível',
    unavailable: 'Indisponível',
    closed: 'Disponível',
    waitingInfo: '',
    soldOut: 'Indisponível',
};

const INstatus = {
    Disponível: 'available',
    Indisponível: 'soldOut',
};

const UploadImages = () => {
    const [product, setProduct] = useState({ status: 'available' });
    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);
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
    const [pictures, setPictures] = React.useState([]);
    const [filesList, setFiles] = React.useState([]);
    const [errors, setErrors] = React.useState([]);
    const initialValue = { status: 'available' };
    const maxFileSize = 5242880;
    useEffect(() => {
        console.log(products);
    }, [products]);

    useEffect(() => fetch(setIsLoading, setIsError, setBrands, setBrandsAndTrends), []);

    function settingThePicturesAndFiles(files) {
        const allFilePromises = [];
        const fileErrors = [];

        // Iterate over all uploaded files
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            let fileError = {
                name: file.name,
            };
            // Check for file extension
            if (!hasExtension(file.name)) {
                fileError = Object.assign(fileError, {
                    type: 'Extensão não permitida',
                });
                fileErrors.push(fileError);
                continue;
            }
            // Check for file size
            if (file.size > maxFileSize) {
                fileError = Object.assign(fileError, {
                    type: 'Imagem grande demais',
                });
                fileErrors.push(fileError);
                continue;
            }

            allFilePromises.push(readFile(file));
        }

        setErrors(fileErrors);

        Promise.all(allFilePromises).then(newFilesData => {
            const dataURLs = pictures.slice();
            const files = filesList.slice();

            newFilesData.forEach(newFileData => {
                dataURLs.push(newFileData.dataURL);
                files.push(newFileData.file);
            });

            setPictures(dataURLs);
            setFiles(files);
        });
    }

    function onClickChoosePhotos(e) {
        e.stopPropagation();
        e.preventDefault();
        console.log(e.dataTransfer);
        const { files } = e.target;
        settingThePicturesAndFiles(files);
    }

    function onDropFile(e) {
        e.stopPropagation();
        e.preventDefault();
        console.log(e.dataTransfer);
        const { files } = e.dataTransfer;
        settingThePicturesAndFiles(files);
    }

    let inputElement = '';

    function triggerFileUpload() {
        inputElement.click();
    }

    function removeImage(picture) {
        console.log(typeof picture);
        const removeIndex = pictures.findIndex(e => e === picture);
        const filteredPictures = pictures.filter((e, index) => index !== removeIndex);
        const filteredFiles = filesList.filter((e, index) => index !== removeIndex);
        //const listOfProducts = products.filter((e, index) => index !== removeIndex);
        console.log('lista de arquivos: ', filesList);
        // console.log('lista de produtos: ', listOfProducts);

        //setProducts(listOfProducts);
        setPictures(filteredPictures);
        setFiles(filteredFiles);
    }

    const validations = useMemo(
        () => [
            {
                name: 'availability',
                validation: value => value !== 'waitingInfo',
                value: product.status,
                message: 'Campo obrigatório',
            },
            ...(product.status !== 'available'
                ? []
                : [
                    {
                        name: 'price',
                        validation: ([price, totalQty]) => (totalQty > 0 ? !!price : true),
                        value: [product.price, Object.values(product.availableQuantities || {}).reduce((acc, prev) => acc + parseInt(prev), 0)],
                        message: 'Campo obrigatório',
                    },
                ]),
        ],
        [product],
    );
    return (
        <div>
            <div style={fileContainerClass} className="fileContainer" onDragOver={onDragOver}>
                <input
                    style={inputImagesId}
                    id="inputImages"
                    ref={input => (inputElement = input)}
                    type="file"
                    multiple
                    onChange={onClickChoosePhotos}
                    onClick={onUploadClick}
                    accept="image/*"
                />
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
                    sendToBackend={data => console.log(settingThePicturesAndFiles(data))}
                    isDisabled={!isValidBrand(brands, brand) || isSubmitting}
                />
                {pictures[1] && (
                    <>
                        <div style={{ marginTop: '10px' }}/>
                        <Button
                            click={() =>
                                sendToBackend(
                                    setIsSubmitting,
                                    setIsSubmitted,
                                    setBrand,
                                    brand,
                                    brandsAndTrends,
                                    pricetag,
                                    setPricetag,
                                    photoPeriod,
                                    setPhotoPeriod,
                                    filesList,
                                    products,
                                    setProducts,
                                    setPictures,
                                    setFiles,
                                )
                            }
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
                            arrayOfInputs={inputs}
                            validations={validations}
                        />
                    );
                })}
                <div style={{ marginTop: '10px' }}/>
                <Button
                    click={() =>
                        sendToBackend(
                            setIsSubmitting,
                            setIsSubmitted,
                            setBrand,
                            brand,
                            brandsAndTrends,
                            pricetag,
                            setPricetag,
                            photoPeriod,
                            setPhotoPeriod,
                            filesList,
                            products,
                            setProducts,
                            setPictures,
                            setFiles,
                        )
                    }
                    submitting={!pricetag || !photoPeriod || !brand || !isValidBrand(brands, brand) || isSubmitting}
                    cta={'Enviar todas fotos'}
                    type="button"
                />
            </div>
        </div>
    );
};
export default UploadImages;
