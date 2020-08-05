import React from 'react';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import { checkbox } from './styles';

export default ({ setThumbPhoto, thumbPhoto, identifierOfPicture }) => {
    return (
        <>
            <div>
                {thumbPhoto.identifierOfPicture === identifierOfPicture ? (
                    <Icon style={checkbox} type="circleChecked" size={15} strokeWidth={2}
                          onClick={() => setThumbPhoto({ identifierOfPicture })}/>
                ) : (
                    <Icon style={checkbox} type="circle" size={15} strokeWidth={2}
                          onClick={() => setThumbPhoto({ identifierOfPicture })}/>
                )}
            </div>
        </>
    );
}
