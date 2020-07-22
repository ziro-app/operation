import React from 'react';
import { fileContainerDuplicateImageClass } from './styles';
import Icon from '@bit/vitorbarbosa19.ziro.icon';

export default ({ setDuplicateImageModal }) => {
    return (
        <>
            <Icon
                type="plusCircle"
                size={15}
                strokeWidth={2}
                style={fileContainerDuplicateImageClass}
                onClick={() => setDuplicateImageModal(true)}
                color={'blue'}
            />
        </>
    );
};
