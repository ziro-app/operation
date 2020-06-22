import React, { useEffect, useState } from 'react';
import './index.css';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import FlipMove from 'react-flip-move';
import InputText from '@bit/vitorbarbosa19.ziro.input-text';
import FormInput from '@bit/vitorbarbosa19.ziro.form-input';
//import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown';
import Dropdown from './Dropdown/index';
import fetch from './fetch';

const styles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    width: '100%',
};

const UploadImages = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [brands, setBrands] = useState('');
    const [brandsAndTrends, setBrandsAndTrends] = useState('');
    const [brand, setBrand] = useState('');
    const [pricetag, setPricetag] = useState('');
    const [photoPeriod, setPhotoPeriod] = useState('');
    const [pictures, setPictures] = React.useState([]);
    const [filesList, setFiles] = React.useState([]);
    const [errors, setErrors] = React.useState([]);
    const [sizes, setSizes] = React.useState(['P,M,G']);
    const imgExtension = ['.jpg', '.jpeg', '.gif', '.png'];
    const maxFileSize = 5242880;
    useEffect(() => fetch(setIsLoading, setIsError, setBrands, setBrandsAndTrends), []);

    const onDrop = picture => {
        setPictures([...pictures, picture]);
    };

    function hasExtension(fileName) {
        const pattern = '(' + imgExtension.join('|').replace(/\./g, '\\.') + ')$';
        return new RegExp(pattern, 'i').test(fileName);
    }

    function readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            // Read the image via FileReader API and save image result in state.
            reader.onload = function(e) {
                // Add the file name to the data URL
                let dataURL = e.target.result;
                dataURL = dataURL.replace(';base64', `;name=${file.name};base64`);
                resolve({ file, dataURL });
            };

            reader.readAsDataURL(file);
        });
    }

    function onDropFile(e) {
        const files = e.target.files;
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
        console.log(errors);

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

    console.log(pictures);
    console.log(filesList);
    let inputElement = '';

    function onUploadClick(e) {
        // Fixes https://github.com/JakeHartnell/react-images-upload/issues/55
        e.target.value = null;
    }

    function removeImage(picture) {
        const removeIndex = pictures.findIndex(e => e === picture);
        const filteredPictures = pictures.filter((e, index) => index !== removeIndex);
        const filteredFiles = filesList.filter((e, index) => index !== removeIndex);

        setPictures(filteredPictures);
        setFiles(filteredFiles);
    }

    function renderInputs() {
        return pictures.map((picture, index) => {
            return (
                <FormInput
                    name="sizes"
                    label="Tamanhos"
                    input={
                        <InputText
                            placeholder="P,M,G"
                            value={(sizes && sizes.join(',')) || ''}
                            onChange={({ target: { value } }) => setSizes(value ? value.split(',') : '')}
                        />
                    }
                />
            );
        });
    }

    function renderPreviewPictures() {
        return pictures.map((picture, index) => {
            return (
                <div key={index} className="uploadPictureContainer">
                    <div className="deleteImage" onClick={() => removeImage(picture)}>
                        X
                    </div>
                    <img src={picture} className="uploadPicture" alt="preview"/>
                    <FormInput
                        name="sizes"
                        label="Tamanhos"
                        input={
                            <InputText
                                placeholder="P,M,G"
                                id="uploadPictureInput"
                                value={(sizes && sizes.join(',')) || ''}
                                onChange={({ target: { value } }) => setSizes(value ? value.split(',') : '')}
                            />
                        }
                    />
                    <FormInput
                        name="sizes"
                        label="Tamanhos"
                        input={
                            <InputText
                                placeholder="P,M,G"
                                id="uploadPictureInput"
                                value={(sizes && sizes.join(',')) || ''}
                                onChange={({ target: { value } }) => setSizes(value ? value.split(',') : '')}
                            />
                        }
                    />
                    <FormInput
                        name="sizes"
                        label="Tamanhos"
                        input={
                            <InputText
                                placeholder="P,M,G"
                                id="uploadPictureInput"
                                value={(sizes && sizes.join(',')) || ''}
                                onChange={({ target: { value } }) => setSizes(value ? value.split(',') : '')}
                            />
                        }
                    />
                    <FormInput
                        name="brands"
                        label="Marcas"
                        input={
                            <Dropdown
                                id="uploadPictureInput"
                                readOnly={false}
                                submitting={isSubmitting}
                                value={brand}
                                onChange={({ target: { value } }) => setBrand(value)}
                                list={brands}
                                placeholder="Marcas"
                                onChangeKeyboard={element => (element ? setBrand(element.value) : null)}
                            />
                        }
                    />
                    <FormInput
                        name="brands"
                        label="Preços"
                        input={
                            <Dropdown
                                id="uploadPictureInput"
                                readOnly={false}
                                submitting={isSubmitting}
                                value={pricetag}
                                onChange={({ target: { value } }) => setPricetag(value)}
                                list={['Sim', 'Não']}
                                placeholder="Tem o preço na imagem?"
                                onChangeKeyboard={element => (element ? setPricetag(element.value) : null)}
                            />
                        }
                    />
                </div>
            );
        });
    }

    function renderPreview() {
        return (
            <div className="uploadPicturesWrapper">
                <FlipMove enterAnimation="fade" leaveAnimation="fade" style={styles}>
                    {renderPreviewPictures()}
                </FlipMove>
            </div>
        );
    }

    function triggerFileUpload() {
        inputElement.click();
    }

    return (
        <div>
            <div className="fileContainer">
                <Icon type="upload" size={50} strokeWidth={3} className="uploadIcon" alt="Upload Icon"/>
                <button type="button" className={'chooseFileButton'} onClick={triggerFileUpload}>
                    Escolha as imagens
                </button>
                <input ref={input => (inputElement = input)} type="file" multiple onChange={onDropFile}
                       onClick={onUploadClick} accept="image/*"/>
                {renderPreview()}
            </div>
        </div>
    );
};
export default UploadImages;
