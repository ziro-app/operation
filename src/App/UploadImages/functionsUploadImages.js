const imgExtension = ['.jpg', '.jpeg', '.gif', '.png'];

const maxFileSize = 5242880;

export function hasExtension(fileName) {
    const pattern = '(' + imgExtension.join('|').replace(/\./g, '\\.') + ')$';
    return new RegExp(pattern, 'i').test(fileName);
}

export function readFile(file) {
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

export function onDragOver(e) {
    e.stopPropagation();
    e.preventDefault();
}

export function onUploadClick(e) {
    e.target.value = null;
}

export function removeImage(filesList, pictures, picture, setPictures, setFiles, setRemoveImageModal, identifierOfPicture) {
    const filteredPictures = pictures.filter(e => e.identifier !== identifierOfPicture);
    const filteredFiles = filesList.filter(e => e.identifierOfPicture !== identifierOfPicture);
    setPictures(filteredPictures);
    setFiles(filteredFiles);
    setRemoveImageModal(false);
}

export function duplicateImage(filesList, pictures, picture, setPictures, setFiles, setDuplicateImageModal, identifierOfPicture, uuid) {
    const filteredPicture = pictures.find(e => e.identifier === identifierOfPicture);
    const filteredFile = filesList.find(e => e.identifierOfPicture === identifierOfPicture);
    console.log(filteredPicture);
    console.log(filteredFile);
    const uid = uuid();
    //filteredPicture.identifier = uid;
    setPictures([...pictures, { urlImage: filteredPicture.urlImage, identifier: uid }]);
    setFiles([
        ...filesList,
        {
            identifierOfPicture: uid,
            lastModified: filteredFile.lastModified,
            lastModifiedDate: filteredFile.lastModifiedDate,
            name: filteredFile.name,
            size: filteredFile.size,
            type: filteredFile.type,
            webkitRelativePath: filteredFile.webkitRelativePath,
        },
    ]);
    console.log(filesList);
    console.log(pictures);
    //const newPictures = { ...pictures,{urlImage:filteredPicture.urlImage,identifierOfPicture:filteredPicture.identifierOfPicture} };

    /*console.log(newPictures[0]);
    console.log('filteredPicture', filteredPicture);
    filteredPicture.identifier = uid;
    console.log('filteredPicture', filteredPicture);
    console.log(pictures);
    console.log(newPictures);*/
    setDuplicateImageModal(false);
}

export function settingThePicturesAndFiles(files, setIsError, pictures, filesList, setPictures, setFiles, uuid) {
    const allFilePromises = [];
    const fileErrors = [];
    console.log('functions', files);
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

        file.identifierOfPicture = uuid();

        allFilePromises.push(readFile(file));
    }

    setIsError(fileErrors);

    Promise.all(allFilePromises).then(newFilesData => {
        const dataURLs = pictures.slice();
        const files = filesList.slice();

        newFilesData.forEach(newFileData => {
            const data = {};
            data.urlImage = newFileData.dataURL;
            data.identifier = newFileData.file.identifierOfPicture;
            dataURLs.push(data);
            files.push(newFileData.file);
        });
        setPictures(dataURLs);
        setFiles(files);
    });
}

export function inputStateControl(state, payload) {
    const { userValue, identifierOfPicture, inputType } = payload;
    switch (inputType) {
        case 'identifier':
            return { ...state, [`identifier${identifierOfPicture}`]: userValue };
        case 'description':
            return { ...state, [`description${identifierOfPicture}`]: userValue };
        case 'price':
            return { ...state, [`price${identifierOfPicture}`]: userValue };
        case 'sizes':
            return { ...state, [`sizes${identifierOfPicture}`]: userValue };
        case 'colors':
            return { ...state, [`colors${identifierOfPicture}`]: userValue };
        case 'availableQuantities':
            return {
                ...state,
                [`availableQuantities${identifierOfPicture}`]: userValue,
            };
        case 'discount':
            return {
                ...state,
                [`discount${identifierOfPicture}`]: userValue,
            };
        case 'clear':
            return { ...(state = {}) };
        default:
        // code block
    }
}

export function getMostRecentImage(uploadResult) {
    uploadResult.reduce(([prevUrl, prevTime], [currentUrl, currentTime]) => (prevTime > currentTime ? [prevUrl, prevTime] : [currentUrl, currentTime]));
}

export function isValidBrand(brands, brand) {
    if (!(brands instanceof Array)) return false;
    if (brands.length === 0) return false;
    return brands.includes(brand);
}
