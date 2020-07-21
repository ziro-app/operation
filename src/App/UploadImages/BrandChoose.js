import React from 'react';
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown';
import { phases } from '../UploadImagesOld/styles';
import { title } from '../ImageUpload/styles';

export default ({ isSubmitting, brand, setBrand, brands }) => {
    return (
        <>
            <div style={phases}>
                <label style={title}>Selecione a marca!</label>
                <Dropdown
                    readOnly={false}
                    submitting={isSubmitting}
                    value={brand}
                    onChange={({ target: { value } }) => setBrand(value)}
                    list={brands}
                    placeholder="Escolha uma marca"
                    onChangeKeyboard={element => (element ? setBrand(element.value) : null)}
                />
            </div>
        </>
    );
};
