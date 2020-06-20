import React from 'react';
import './index.css';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import FlipMove from 'react-flip-move';

const styles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    width: '100%',
};

const UploadImages = () => {
    const [pictures, setPictures] = React.useState([]);
    const [filesList, setFiles] = React.useState([]);
    const [errors, setErrors] = React.useState([]);
    const imgExtension = ['.jpg', '.jpeg', '.gif', '.png'];
    const maxFileSize = 5242880;

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

    function renderPreviewPictures() {
        return pictures.map((picture, index) => {
            return (
                <div key={index} className="uploadPictureContainer">
                    <div className="deleteImage" onClick={() => removeImage(picture)}>
                        X
                    </div>
                    <img src={picture} className="uploadPicture" alt="preview"/>
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
