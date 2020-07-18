import React from 'react';
import FormInput from '@bit/vitorbarbosa19.ziro.form-input';
import InputText from '@bit/vitorbarbosa19.ziro.input-text';
import currencyFormat from '@ziro/currency-format';
import maskInput from '@ziro/mask-input';

export default (states, index, dispatch) => {
    const descriptionInput = ( //(states[index].status === undefined || states[index].status === 'available') &&
        <FormInput
            name="description"
            label="Descrição"
            input={
                <InputText
                    value={'' || states[`description${index}`]}
                    onChange={({ target: { value } }) => {
                        const payload = { userValue: value, index, inputType: 'description' };
                        dispatch(payload);
                    }}
                    placeholder="Descrição"
                />
            }
        />
    );
    const priceInput = ( //(state.status === undefined || state.status === 'available') &&
        <FormInput
            name="price"
            label="Preço"
            input={
                <InputText
                    value={'' || currencyFormat(states[`price${index}`])}
                    onChange={({ target: { value } }) => {
                        const toInteger = parseInt(value.replace(/[R$\.,]/g, ''), 10);
                        const payload = { userValue: maskInput(toInteger, '#######', true), index, inputType: 'price' };
                        dispatch(payload);
                    }}
                    placeholder="R$ 100,00"
                    inputMode="numeric"
                />
            }
        />
    );

    const sizesInput = ( //(state.status === undefined || state.status === 'available') &&
        <FormInput
            name="sizes"
            label="Tamanhos"
            input={
                <InputText
                    placeholder="P,M,G"
                    value={'' || (states[`sizes${index}`] && states[`sizes${index}`].join(','))}
                    onChange={({ target: { value } }) => {
                        const payload = { userValue: value ? value.split(',') : '', index, inputType: 'sizes' };
                        dispatch(payload);
                    }}
                />
            }
        />
    );

    const colorsInput = ( //(state.status === undefined || state.status === 'available') &&
        <FormInput
            name="colors"
            label="Cores"
            input={
                <InputText
                    placeholder="Azul,Amarelo"
                    value={'' || (states[`colors${index}`] && states[`colors${index}`].join(','))}
                    onChange={({ target: { value } }) => {
                        const newColors = value.split(',');
                        const payload = {
                            userValue: newColors,
                            index,
                            inputType: 'colors',
                        };
                        dispatch(payload);
                        //updateColors(value ? newColors : '');
                    }}
                />
            }
        />
    );

    const quantitiesInput = states[ //(state.status === undefined || state.status === 'available') && state.sizes &&
        `sizes${index}`] && (
        <FormInput
            name="quantities"
            label="Quantidades"
            input={
                <div style={{ display: 'grid', gridGap: '10px', padding: '10px' }}>
                    {states[`sizes${index}`] &&
                    states[`sizes${index}`].map(size =>
                        (states[`colors${index}`].length ? states[`colors${index}`] : ['']).map(color => (
                            <div
                                key={`${size}-${color}`}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 2fr 2fr',
                                    alignItems: 'center',
                                }}
                            >
                                <label>{size}</label>
                                <label>{color}</label>
                                <InputText
                                    placeholder="1"
                                    value={'' || (states[`availableQuantities${index}`] && states[`availableQuantities${index}`][`${size}-${color}`])}
                                    onChange={({ target: { value } }) => {
                                        if (/^[0-9]*$/gm.test(value)) {
                                            const payload = {
                                                userValue: old => {
                                                    const newQuantities = { ...(old.availableQuantities || {}) };
                                                    newQuantities[`${size}-${color}`] = value;
                                                    return { ...old, availableQuantities: newQuantities };
                                                },
                                                index,
                                                inputType: 'availableQuantities',
                                            };
                                            dispatch(payload);
                                        }
                                    }}
                                />
                            </div>
                        )),
                    )}
                </div>
            }
        />
    );
    // const index = states.findIndex(e => e === state);
    const arrayInputs = [descriptionInput, priceInput, sizesInput, colorsInput, quantitiesInput];
    return arrayInputs;
};
