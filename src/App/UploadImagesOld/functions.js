const imgExtension = ['.jpg', '.jpeg', '.gif', '.png'];

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
