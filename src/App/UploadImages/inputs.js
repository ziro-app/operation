import React, { useMemo, useState } from 'react';
import FormInput from '@bit/vitorbarbosa19.ziro.form-input';
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown';
import InputText from '@bit/vitorbarbosa19.ziro.input-text';
import currencyFormat from '@ziro/currency-format';
import maskInput from '@ziro/mask-input';

const PTstatus = {
    available: 'Disponível',
    unavailable: 'Indisponível',
    closed: 'Disponível',
    waitingInfo: '',
    soldOut: 'Indisponível',
};

const INstatus = {
    Disponível: 'available',
    Indisponível: 'soldOut',
};
export default (product, setProduct) => {
    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);
    const availabilityInput = useMemo(
        () => (
            <FormInput
                name="availability"
                label="Disponibilidade"
                input={
                    <Dropdown
                        list={['Disponível', 'Indisponível']}
                        value={PTstatus[product.status] || ''}
                        onChange={({ target: { value } }) =>
                            setProduct(old => ({
                                ...old,
                                status: INstatus[value] || 'waitingInfo',
                            }))
                        }
                        onChangeKeyboard={element =>
                            element &&
                            setProduct(old => ({
                                ...old,
                                status: INstatus[element.value] || 'waitingInfo',
                            }))
                        }
                        placeholder="Está disponível em estoque?"
                    />
                }
            />
        ),
        [product.status],
    );

    const priceInput = useMemo(
        () =>
            (product.status === undefined || product.status === 'available') && (
                <FormInput
                    name="price"
                    label="Preço"
                    input={
                        <InputText
                            value={currencyFormat(product.price || '')}
                            onChange={({ target: { value } }) => {
                                const toInteger = parseInt(value.replace(/[R$\.,]/g, ''), 10);
                                setProduct(old => ({ ...old, price: maskInput(toInteger, '#######', true) }));
                            }}
                            placeholder="R$ 100,00"
                            inputMode="numeric"
                        />
                    }
                />
            ),
        [product.status, product.price],
    );
    const referenceIdInput = useMemo(
        () =>
            product.status === 'available' && (
                <FormInput
                    name="referenceId"
                    label="Referência"
                    input={
                        <InputText
                            value={product.referenceId || ''}
                            onChange={({ target: { value } }) => setProduct(old => ({ ...old, referenceId: value }))}
                            placeholder="Referência da loja"
                        />
                    }
                />
            ),
        [product.status, product.referenceId],
    );

    const descriptionInput = useMemo(
        () =>
            (product.status === undefined || product.status === 'available') && (
                <FormInput
                    name="description"
                    label="Descrição"
                    input={
                        <InputText
                            value={product.description || ''}
                            onChange={({ target: { value } }) => setProduct(old => ({ ...old, description: value }))}
                            placeholder="Descrição"
                        />
                    }
                />
            ),
        [product.status, product.description],
    );

    const sizesInput = useMemo(
        () =>
            (product.status === undefined || product.status === 'available') && (
                <FormInput
                    name="sizes"
                    label="Tamanhos"
                    input={
                        <InputText
                            placeholder="P,M,G"
                            value={(sizes && sizes.join(',')) || ''}
                            onChange={({ target: { value } }) => {
                                product.setSizes(value ? value.split(',') : '');
                            }}
                        />
                    }
                />
            ),
        [product.status, sizes],
    );

    const colorsInput = useMemo(
        () =>
            (product.status === undefined || product.status === 'available') && (
                <FormInput
                    name="colors"
                    label="Cores"
                    input={
                        <InputText
                            placeholder="Azul,Amarelo"
                            value={(colors && colors.join(',')) || ''}
                            onChange={({ target: { value } }) => {
                                const newColors = value.split(',');
                                setProduct(old => {
                                    const newQuantities = Object.entries(old.availableQuantities || {}).reduce((prev, [key, value]) => {
                                        if (newColors.some(color => key.endsWith(color))) return { ...prev, [key]: value };
                                        return prev;
                                    }, {});
                                    return { ...old, availableQuantities: newQuantities };
                                });
                                setColors(value ? newColors : '');
                            }}
                        />
                    }
                />
            ),
        [product.status, colors],
    );

    const quantitiesInput = useMemo(
        () =>
            (product.status === undefined || product.status === 'available') &&
            sizes.length && (
                <FormInput
                    name="quantities"
                    label="Quantidades"
                    input={
                        <div style={{ display: 'grid', gridGap: '10px', padding: '10px' }}>
                            {sizes.map(size =>
                                (colors.length ? colors : ['']).map(color => (
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
                                            value={(product.availableQuantities && product.availableQuantities[`${size}-${color}`]) || ''}
                                            onChange={({ target: { value } }) =>
                                                /^[0-9]*$/gm.test(value) &&
                                                setProduct(old => {
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
            ),
        [product.status, sizes, colors, product.availableQuantities],
    );

    const arrayInputs = [priceInput, descriptionInput, sizesInput, colorsInput, quantitiesInput];
    return arrayInputs;
};
