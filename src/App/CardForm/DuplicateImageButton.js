import React from 'react';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import { fileContainerDuplicateImageClass } from './styles';

export default ({ setDuplicateImageModal }) => {
    return (
        <>
            <Icon
                type="copy"
                size={15}
                className="btn"
                strokeWidth={2}
                style={fileContainerDuplicateImageClass}
                onClick={() => setDuplicateImageModal(true)}
                color="blue"
            />
        </>
    );
}
