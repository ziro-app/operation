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

export function removeImage(filesList, pictures, picture, setPictures, setFiles) {
    const removeIndex = pictures.findIndex(e => e === picture);
    const filteredPictures = pictures.filter((e, index) => index !== removeIndex);
    const filteredFiles = filesList.filter((e, index) => index !== removeIndex);

    setPictures(filteredPictures);
    setFiles(filteredFiles);
}

export function settingThePicturesAndFiles(files, setIsError, pictures, filesList, setPictures, setFiles) {
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

        file.identifierOfPicture = file.name;

        allFilePromises.push(readFile(file));
    }

    setIsError(fileErrors);

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

export function inputStateControl(state, payload) {
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
            return {
                ...state,
                [`availableQuantities${identifierOfPicture}`]: userValue,
            };
        case 'clear':
            return {};
        default:
        // code block
    }
}

export function onClickChoosePhotos(e, setIsError, pictures, filesList, setPictures, setFiles) {
    e.stopPropagation();
    e.preventDefault();
    const { files } = e.target;
    settingThePicturesAndFiles(files, setIsError, pictures, filesList, setPictures, setFiles);
}

export function getMostRecentImage(uploadResult) {
    uploadResult.reduce(([prevUrl, prevTime], [currentUrl, currentTime]) => (prevTime > currentTime ? [prevUrl, prevTime] : [currentUrl, currentTime]));
}
