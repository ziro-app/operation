import React from 'react';
import { checkBoxClass } from './styles';

export default ({ setThumbPhoto, thumbPhoto, identifierOfPicture }) => {
    //console.log('checkbox', 'thumbPhoto', thumbPhoto)
    //console.log('checkbox', 'identifierOfPicture', identifierOfPicture)
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
