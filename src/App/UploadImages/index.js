import React, { useEffect, useState } from 'react';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown';
import Button from '@bit/vitorbarbosa19.ziro.button';
import fetch from './fetch';
import { fileContainerClass, fileContainerUploadIconClass, inputImagesId, phases } from './styles';
import isValidBrand from '../ImageUpload/isValidBrand';
import { title } from '../ImageUpload/styles';
import sendToBackend from './sendToBackend';
import { hasExtension, onDragOver, onUploadClick, readFile } from './functions';
import PreviewPictures from './previewPictures';

const UploadImages = () => {
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

    return (
        <div>
            <div style={fileContainerClass} className="fileContainer" onDrop={onDropFile} onDragOver={onDragOver}>
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

                <Button
                    submitting={!pricetag || !photoPeriod || !brand || !isValidBrand(brands, brand) || isSubmitting}
                    cta="Escolha as imagens"
                    type="button"
                    click={triggerFileUpload}
                />
                <PreviewPictures
                    pictures={pictures}
                    setPictures={setPictures}
                    products={products}
                    setProducts={setProducts}
                    filesList={filesList}
                    setFiles={setFiles}
                />
                {pictures[1] && (
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
                )}
            </div>
        </div>
    );
};
export default UploadImages;
