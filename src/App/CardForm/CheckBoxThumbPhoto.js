import React from 'react';
import { checkBox, checkBoxClass } from './styles';

export default ({ setThumbPhoto, thumbPhoto, identifierOfPicture }) => {
    return (
        <>
            <style>{checkBox}</style>
            <label className="containerCheckBox">
                <input
                    type="checkbox"
                    defaultChecked={thumbPhoto.identifierOfPicture === identifierOfPicture}
                    style={checkBoxClass}
                    onChange={() => setThumbPhoto({ ...thumbPhoto, identifierOfPicture })}
                    checked={thumbPhoto.identifierOfPicture === identifierOfPicture}
                />
                <span className="checkmarkCheckBox"/>
            </label>
        </>
    );
}
