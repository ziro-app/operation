import React, { useMemo, useReducer } from 'react';
import CardInputs from './cardInputs';
import {
    fileContainerDeleteImageClass,
    fileContainerUploadPictureContainerClass,
    fileContainerUploadPictureContainerimgUploadPictureClass,
    fileContainerUploadPicturesWrapperClass,
} from './styles';
import RImg from 'react-image';
import SpinnerWithDiv from '@bit/vitorbarbosa19.ziro.spinner-with-div';
import InfoCard from './infoCard';
import SummaryCard from './summaryCard';
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

const reducer = (state, action) => {
    if (action.type === 'sizes') {
        const { payload } = action;
        return { ...state, sizes: payload };
    }
    if (action.type === 'colors') {
        const { payload } = action;
        return { ...state, colors: payload };
    }
    if (action.type === 'status') {
        const { payload } = action;
        return { ...state, status: payload };
    }
    if (action.type === 'price') {
        const { payload } = action;
        return { ...state, price: payload };
    }
    if (action.type === 'referenceId') {
        const { payload } = action;
        return { ...state, referenceId: payload };
    }
    if (action.type === 'description') {
        const { payload } = action;
        console.log(payload);
        return { ...state, description: payload };
    }
    if (action.type === 'availableQuantities') {
        const { payload } = action;
        return { ...state, availableQuantities: payload };
    }
};

export default ({
                    products,
                    setProducts,
                    filesList,
                    setFiles,
                    index,
                    picture,
                    removeImage = null,
                    update,
                    cardInfo = false,
                    productRef,
                    editing,
                    cartProduct,
                    setEditing,
                    validations,
                }) => {
    const [state, dispatch] = useReducer(reducer, {
        sizes: '',
        colors: '',
        status: 'available',
        price: '',
        referenceId: '',
        description: '',
        availableQuantities: '',
    });

    function updateSizes(value) {
        dispatch({ type: 'sizes', payload: value });
    }

    function updateColors(value) {
        dispatch({ type: 'colors', payload: value });
    }

    function updatePrice(value) {
        dispatch({ type: 'price', payload: value });
    }

    function updateReference(value) {
        dispatch({ type: 'referenceId', payload: value });
    }

    function updateDescription(value) {
        dispatch({ type: 'description', payload: value });
    }

    function updateAvailableQuantities(value) {
        dispatch({ type: 'availableQuantities', payload: value });
    }

    function updateStatus(value) {
        dispatch({ type: 'status', payload: value });
    }

    const availabilityInput = useMemo(
        () => (
            <FormInput
                name="availability"
                label="Disponibilidade"
                input={
                    <Dropdown
                        list={['Disponível', 'Indisponível']}
                        value={PTstatus[state.status] || ''}
                        onChange={({ target: { value } }) => {
                            updateStatus(old => ({
                                ...old,
                                status: INstatus[value] || 'waitingInfo',
                            }));
                        }}
                        onChangeKeyboard={element =>
                            element &&
                            updateStatus(old => ({
                                ...old,
                                status: INstatus[element.value] || 'waitingInfo',
                            }))
                        }
                        placeholder="Está disponível em estoque?"
                    />
                }
            />
        ),
        [state.status],
    );

    const priceInput = useMemo(
        () =>
            (state.status === undefined || state.status === 'available') && (
                <FormInput
                    name="price"
                    label="Preço"
                    input={
                        <InputText
                            value={currencyFormat(state.price || '')}
                            onChange={({ target: { value } }) => {
                                const toInteger = parseInt(value.replace(/[R$\.,]/g, ''), 10);

                                updatePrice(maskInput(toInteger, '#######', true));
                            }}
                            placeholder="R$ 100,00"
                            inputMode="numeric"
                        />
                    }
                />
            ),
        [state.status, state.price],
    );
    const referenceIdInput = useMemo(
        () =>
            state.status === 'available' && (
                <FormInput
                    name="referenceId"
                    label="Referência"
                    input={
                        <InputText
                            value={state.referenceId || ''}
                            onChange={({ target: { value } }) => {
                                updateReference(old => ({ ...old, referenceId: value }));
                            }}
                            placeholder="Referência da loja"
                        />
                    }
                />
            ),
        [state.status, state.referenceId],
    );

    const descriptionInput = useMemo(
        () =>
            (state.status === undefined || state.status === 'available') && (
                <FormInput
                    name="description"
                    label="Descrição"
                    input={
                        <InputText
                            value={state.description || ''}
                            onChange={({ target: { value } }) => {
                                updateDescription(value);
                                //updateDescription(old => ({ ...old, description: value }));
                            }}
                            placeholder="Descrição"
                        />
                    }
                />
            ),
        [state.status, state.description],
    );

    const sizesInput = useMemo(
        () =>
            (state.status === undefined || state.status === 'available') && (
                <FormInput
                    name="sizes"
                    label="Tamanhos"
                    input={
                        <InputText
                            placeholder="P,M,G"
                            value={(state.sizes && state.sizes.join(',')) || ''}
                            onChange={({ target: { value } }) => {
                                //setSizes(value ? value.split(',') : '');
                                updateSizes(value ? value.split(',') : '');
                            }}
                        />
                    }
                />
            ),
        [state.status, state.sizes],
    );

    const colorsInput = useMemo(
        () =>
            (state.status === undefined || state.status === 'available') && (
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
                                        if (newColors.some(color => key.endsWith(color))) return { ...prev, [key]: value };
                                        return prev;
                                    }, {});
                                    return { ...old, availableQuantities: newQuantities };
                                });
                                updateColors(value ? newColors : '');
                            }}
                        />
                    }
                />
            ),
        [state.status, state.colors],
    );

    const quantitiesInput = useMemo(
        () =>
            (state.status === undefined || state.status === 'available') &&
            state.sizes && (
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
            ),
        [state.status, state.sizes, state.colors, state.availableQuantities],
    );

    const arrayInputs = [priceInput, descriptionInput, sizesInput, colorsInput, quantitiesInput];
    return (
        <div style={fileContainerUploadPicturesWrapperClass} className="uploadPicturesWrapper">
            <div key={index} style={fileContainerUploadPictureContainerClass} className="uploadPictureContainer">
                {removeImage && (
                    <div style={fileContainerDeleteImageClass} className="deleteImage"
                         onClick={() => removeImage(picture)}>
                        X
                    </div>
                )}
                {cardInfo ? (
                    <RImg
                        src={state.url}
                        style={image}
                        container={children =>
                            !initialStatus || initialStatus === 'waitingInfo' || editing ? (
                                <CardInputs image={children || null} update={update || null} arrayOfInputs={arrayInputs}
                                            validations={validations}/>
                            ) : initialStatus === 'unavailable' && cartProduct.status !== 'closed' ? (
                                <InfoCard product={{ requestedQuantities: {}, ...state, ...cartProduct }}
                                          image={children} setEditing={setEditing}/>
                            ) : (
                                <SummaryCard product={{ requestedQuantities: {}, ...state, ...cartProduct }}
                                             image={children} setEditing={setEditing}/>
                            )
                        }
                        loaderContainer={() => <SpinnerWithDiv/>}
                    />
                ) : (
                    <RImg
                        src={picture}
                        style={fileContainerUploadPictureContainerimgUploadPictureClass}
                        className="uploadPicture"
                        alt="preview"
                        container={children => (
                            <CardInputs
                                image={children || null}
                                setFiles={setFiles}
                                update={update || null}
                                arrayOfInputs={arrayInputs}
                                validations={validations}
                            />
                        )}
                    />
                )}
            </div>
        </div>
    );
};
