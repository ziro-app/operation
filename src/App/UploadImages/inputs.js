import React from 'react';
import FormInput from '@bit/vitorbarbosa19.ziro.form-input';
import InputText from '@bit/vitorbarbosa19.ziro.input-text';
import currencyFormat from '@ziro/currency-format';
import maskInput from '@ziro/mask-input';

export default (states, identifierOfPicture, dispatch) => {
    const descriptionInput = (
        <FormInput
            name="description"
            label="Descrição"
            input={
                <InputText
                    value={'' || states[`description${identifierOfPicture}`]}
                    onChange={({ target: { value } }) => {
                        const payload = { userValue: value, identifierOfPicture, inputType: 'description' };
                        dispatch(payload);
                    }}
                    placeholder="Descrição"
                />
            }
        />
    );
    const priceInput = (
        <FormInput
            name="price"
            label="Preço"
            input={
                <InputText
                    value={'' || currencyFormat(states[`price${identifierOfPicture}`])}
                    onChange={({ target: { value } }) => {
                        const toInteger = parseInt(value.replace(/[R$\.,]/g, ''), 10);
                        const payload = {
                            userValue: maskInput(toInteger, '#######', true),
                            identifierOfPicture,
                            inputType: 'price',
                        };
                        dispatch(payload);
                    }}
                    placeholder="R$ 100,00"
                    inputMode="numeric"
                />
            }
        />
    );

    const sizesInput = (
        <FormInput
            name="sizes"
            label="Tamanhos"
            input={
                <InputText
                    placeholder="P,M,G"
                    value={'' || (states[`sizes${identifierOfPicture}`] && states[`sizes${identifierOfPicture}`].join(','))}
                    onChange={({ target: { value } }) => {
                        const payload = {
                            userValue: value ? value.split(',') : '',
                            identifierOfPicture,
                            inputType: 'sizes',
                        };
                        dispatch(payload);
                    }}
                />
            }
        />
    );

    const colorsInput = (
        <FormInput
            name="colors"
            label="Cores"
            input={
                <InputText
                    placeholder="Azul,Amarelo"
                    value={'' || (states[`colors${identifierOfPicture}`] && states[`colors${identifierOfPicture}`].join(','))}
                    onChange={({ target: { value } }) => {
                        const newColors = value ? value.split(',') : '';
                        const payload = {
                            userValue: newColors,
                            identifierOfPicture,
                            inputType: 'colors',
                        };
                        dispatch(payload);
                    }}
                />
            }
        />
    );

    const quantitiesInput = states[`colors${identifierOfPicture}`] && (
        <FormInput
            name="quantities"
            label="Quantidades"
            input={
                <div style={{ display: 'grid', gridGap: '10px', padding: '10px' }}>
                    {states[`colors${identifierOfPicture}`] &&
                    states[`colors${identifierOfPicture}`].map(color =>
                        (states[`sizes${identifierOfPicture}`]
                                ? states[`sizes${identifierOfPicture}`].length
                                    ? states[`sizes${identifierOfPicture}`]
                                    : ['']
                                : ['']
                        ).map(size => (
                            <div
                                key={`${color}-${size}`}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 2fr 2fr',
                                    alignItems: 'center',
                                }}
                            >
                                <label>{color}</label>
                                <label>{size}</label>
                                <InputText
                                    placeholder="1"
                                    value={
                                        '' ||
                                        (states[`availableQuantities${identifierOfPicture}`] && states[`availableQuantities${identifierOfPicture}`][`${color}-${size}`])
                                    }
                                    onChange={({ target: { value } }) => {
                                        if (/^[0-9]*$/gm.test(value)) {
                                            const result = old => {
                                                const newQuantities = { ...(states[`availableQuantities${identifierOfPicture}`] || {}) };
                                                newQuantities[`${color}-${size}`] = value;
                                                return { ...old, availableQuantities: newQuantities };
                                            };
                                            const payload = {
                                                userValue: result().availableQuantities,
                                                identifierOfPicture,
                                                inputType: 'availableQuantities',
                                            };
                                            dispatch(payload);
                                        }
                                    }}
                                    inputMode="numeric"
                                />
                            </div>
                        )),
                    )}
                </div>
            }
        />
    );
    const arrayInputs = [descriptionInput, priceInput, colorsInput, sizesInput, quantitiesInput];
    return arrayInputs;
};
