import React from 'react';
import { fileContainerDeleteImageClass } from './styles';
import Icon from '@bit/vitorbarbosa19.ziro.icon';

export default ({ removeImage, filesList, pictures, picture, setPictures, setFiles }) => {
    return (
        <>
            <Icon
                type="trash"
                size={15}
                strokeWidth={2}
                style={fileContainerDeleteImageClass}
                onClick={() => removeImage(filesList, pictures, picture, setPictures, setFiles)}
                color={'red'}
            />
        </>
    );
};
