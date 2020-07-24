import React from 'react';
import { checkBoxClass } from './styles';

export default ({ setThumbPhoto, thumbPhoto, identifierOfPicture }) => {
    return (
        <>
            <input
                type="checkbox"
                defaultChecked={thumbPhoto.identifierOfPicture === identifierOfPicture}
                style={checkBoxClass}
                onChange={() => setThumbPhoto({ ...thumbPhoto, identifierOfPicture })}
                checked={thumbPhoto.identifierOfPicture === identifierOfPicture}
            />
        </>
    );
}
