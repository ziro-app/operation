import React from 'react';
import FormInput from '@bit/vitorbarbosa19.ziro.form-input';
import InputText from '@bit/vitorbarbosa19.ziro.input-text';

export default (states, index, dispatch) => {
    console.log(states);
    const descriptionInput = ( //(states[index].status === undefined || states[index].status === 'available') &&
        <FormInput
            name="description"
            label="Descrição"
            input={
                <InputText
                    value={states.description0 || ''}
                    onChange={({ target: { value } }) => {
                        const payload = { userValue: value, index };
                        dispatch(payload);
                    }}
                    placeholder="Descrição"
                />
            }
        />
    );
    /*const priceInput = (state.status === undefined || state.status === 'available') && (
      <FormInput
        name="price"
        label="Preço"
        input={
          <InputText
            value={currencyFormat(state.price || '')}
            onChange={({ target: { value } }) => {
              const toInteger = parseInt(value.replace(/[R$\.,]/g, ''), 10);
              dispatch.bind(null, maskInput(toInteger, '#######', true));
            }}
            placeholder="R$ 100,00"
            inputMode="numeric"
          />
        }
      />
    );

    const sizesInput = (state.status === undefined || state.status === 'available') && (
      <FormInput
        name="sizes"
        label="Tamanhos"
        input={
          <InputText
            placeholder="P,M,G"
            value={(state.sizes && state.sizes.join(',')) || ''}
            onChange={({ target: { value } }) => {
              updateSizes(value ? value.split(',') : '');
            }}
          />
        }
      />
    );

    const colorsInput = (state.status === undefined || state.status === 'available') && (
      <FormInput
        name="colors"
        label="Cores"
        input={
          <InputText
            placeholder="Azul,Amarelo"
            value={(state.colors && state.colors.join(',')) || ''}
            onChange={({ target: { value } }) => {
              const newColors = value.split(',');
              updateAvailableQuantities(old => {
                const newQuantities = Object.entries(old.availableQuantities || {}).reduce((prev, [key, value]) => {
                  if (newColors.some(color => key.endsWith(color)))
                    return {
                      ...prev,
                      [key]: value,
                    };
                  return prev;
                }, {});
                return { ...old, availableQuantities: newQuantities };
              });
              updateColors(value ? newColors : '');
            }}
          />
        }
      />
    );

    const quantitiesInput = (state.status === undefined || state.status === 'available') && state.sizes && (
      <FormInput
        name="quantities"
        label="Quantidades"
        input={
          <div style={{ display: 'grid', gridGap: '10px', padding: '10px' }}>
            {state.sizes.map(size =>
              (state.colors.length ? state.colors : ['']).map(color => (
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
                    value={(state.availableQuantities && state.availableQuantities[`${size}-${color}`]) || ''}
                    onChange={({ target: { value } }) =>
                      /^[0-9]*$/gm.test(value) &&
                      updateAvailableQuantities(old => {
                        const newQuantities = { ...(old.availableQuantities || {}) };
                        newQuantities[`${size}-${color}`] = value;
                        return { ...old, availableQuantities: newQuantities };
                      })
                    }
                  />
                </div>
              )),
            )}
          </div>
        }
      />
    );*/
    // const index = states.findIndex(e => e === state);
    const arrayInputs = [descriptionInput];
    //console.log(arrayInputs);
    return arrayInputs;
};
