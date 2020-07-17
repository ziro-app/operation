import React, { useEffect, useMemo, useReducer, useState } from 'react';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown';
import Button from '@bit/vitorbarbosa19.ziro.button';
import fetch from './fetch';
import { fileContainerClass, fileContainerUploadIconClass, inputImagesId, phases } from './styles';
import isValidBrand from '../ImageUpload/isValidBrand';
import { title } from '../ImageUpload/styles';
import sendToBackend from './sendToBackend';
import { hasExtension, onDragOver, onUploadClick, readFile } from './functions';
import Card from '../CardForm';
//import Card from '@bit/vitorbarbosa19.ziro.card-form';
import ImageUpload from '@bit/vitorbarbosa19.ziro.image-upload';
import FormInput from '@bit/vitorbarbosa19.ziro.form-input';
import InputText from '@bit/vitorbarbosa19.ziro.input-text';
import currencyFormat from '@ziro/currency-format';
import maskInput from '@ziro/mask-input';
import whyDidYouRender from '@welldone-software/why-did-you-render';

whyDidYouRender(React, {
    onlyLogs: true,
    titleColor: 'green',
    diffNameColor: 'darkturquoise',
});

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
    if (action.type === 'initialState') {
        const { payload } = action;
        console.log('state', state);
        console.log('payload', payload);
        return state.concat(payload);
    }
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
        const { price } = payload;
        console.log('payload:', payload);
        const objIndex = state.findIndex(obj => obj.name === payload.state.name);
        state[objIndex].price = payload.price;
        /*const newObject = state[objIndex];
                newObject.price = price;
                state[objIndex] = newObject;
                const newArray = state;
                console.log('updated state:', state[objIndex]);

                return [newArray];*/
        return [...state, state];
    }
    if (action.type === 'referenceId') {
        const { payload } = action;
        return { ...state, referenceId: payload };
    }
    if (action.type === 'description') {
        const { payload } = action;
        const { description } = payload;
        console.log('payload description:', payload);
        const objIndex = state.findIndex(obj => obj === payload.state);
        const statesCopy = [...state];
        statesCopy[objIndex].description = description;
        state[objIndex].description = description;
        console.log('updated state:', statesCopy[objIndex]);

        return [...state];
    }
    if (action.type === 'availableQuantities') {
        const { payload } = action;
        return { ...state, availableQuantities: payload };
    }
};

const UploadImages = () => {
    const [product, setProduct] = useState({ status: 'available' });
    //const [sizes, setSizes] = useState([]);
    //const [colors, setColors] = useState([]);
    const [products, setProducts] = useState([{}]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [brands, setBrands] = useState([]);
    const [brandsAndTrends, setBrandsAndTrends] = useState('');
    const [brand, setBrand] = useState('');
    const [pricetag, setPricetag] = useState('');
    const [photoPeriod, setPhotoPeriod] = useState('');
    const [pictures, setPictures] = React.useState([]);
    const [filesList, setFiles] = React.useState([]);
    const [errors, setErrors] = React.useState([]);
    const [arrayInputs, setArrayInputs] = useState([]);
    const initialValue = { status: 'available' };
    const maxFileSize = 5242880;

    const desiredStates = ['sizesTest', 'colorsTest', 'statusTest', 'priceTest', 'referenceIdTest', 'descriptionTest', 'availableQuantitiesTest'];
    const [itemsWithState, setItemsWithState] = useState('');
    useEffect(() => {
        setItemsWithState(filesList);
    }, [filesList]);
    const [states, dispatch] = useReducer(reducer, []);

    useEffect(() => fetch(setIsLoading, setIsError, setBrands, setBrandsAndTrends), []);

    useEffect(() => {
        console.log('teste', states);
    }, [states]);

    function updateInitialState(value) {
        dispatch({ type: 'initialState', payload: value });
    }

    function updateSizes(value) {
        dispatch({ type: 'sizes', payload: value });
    }

    function updateColors(value) {
        dispatch({ type: 'colors', payload: value });
    }

    function updatePrice(payload) {
        dispatch({ type: 'price', payload });
    }

    function updateReference(value) {
        dispatch({ type: 'referenceId', payload: value });
    }

    function updateDescription(payload) {
        dispatch({ type: 'description', payload });
    }

    function updateAvailableQuantities(value) {
        dispatch({ type: 'availableQuantities', payload: value });
    }

    function updateStatus(value) {
        dispatch({ type: 'status', payload: value });
    }

    /*const memoizedInputs = useMemo(() => {
          states.forEach(state => {
            const index = states.findIndex(e => e === state);
            const stateWithIndex = { state, index };
            console.log(stateWithIndex);
            //if (filesList) updateIndex(stateWithIndex);
            const availabilityInput = (
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
            );

            const priceInput = (state.status === undefined || state.status === 'available') && (
              <FormInput
                name="price"
                label="Preço"
                input={
                  <InputText
                    value={currencyFormat(state.price || '')}
                    onChange={({ target: { value } }) => {
                      const toInteger = parseInt(value.replace(/[R$\.,]/g, ''), 10);
                      const payload = { price: maskInput(toInteger, '#######', true), state };
                      updatePrice(payload);
                    }}
                    placeholder="R$ 100,00"
                    inputMode="numeric"
                  />
                }
              />
            );
            const referenceIdInput = state.status === 'available' && (
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
            );

            const descriptionInput = (state.status === undefined || state.status === 'available') && (
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
            );
            const updateArray = arrayInputs;
            updateArray[index] = [priceInput, descriptionInput, sizesInput, colorsInput, quantitiesInput];

            setArrayInputs(updateArray);
          });
        }, [filesList]);*/
    useEffect(() => {
        console.log('into useEffect');
        states.forEach(state => {
            const availabilityInput = (
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
            );

            const priceInput = (state.status === undefined || state.status === 'available') && (
                <FormInput
                    name="price"
                    label="Preço"
                    input={
                        <InputText
                            value={currencyFormat(state.price || '')}
                            onChange={({ target: { value } }) => {
                                const toInteger = parseInt(value.replace(/[R$\.,]/g, ''), 10);
                                const payload = { price: maskInput(toInteger, '#######', true), state };
                                updatePrice(payload);
                            }}
                            placeholder="R$ 100,00"
                            inputMode="numeric"
                        />
                    }
                />
            );
            const referenceIdInput = state.status === 'available' && (
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
            );

            const descriptionInput = (state.status === undefined || state.status === 'available') && (
                <FormInput
                    name="description"
                    label="Descrição"
                    input={
                        <InputText
                            value={state.description || ''}
                            onChange={({ target: { value } }) => {
                                const payload = { description: value, state };
                                updateDescription(payload);
                                //updateDescription(old => ({ ...old, description: value }));
                            }}
                            placeholder="Descrição"
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
            );
            const index = states.findIndex(e => e === state);
            const updateArray = arrayInputs;
            updateArray[index] = [priceInput, descriptionInput, sizesInput, colorsInput, quantitiesInput];

            setArrayInputs(updateArray);
        });
    }, [filesList]);

    function settingThePicturesAndFiles(files) {
        const allFilePromises = [];
        const fileErrors = [];

        // Iterate over all uploaded files
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            let fileError = {
                name: file.name,
            };
            // Check for file extension
            if (!hasExtension(file.name)) {
                fileError = Object.assign(fileError, {
                    type: 'Extensão não permitida',
                });
                fileErrors.push(fileError);
                continue;
            }
            // Check for file size
            if (file.size > maxFileSize) {
                fileError = Object.assign(fileError, {
                    type: 'Imagem grande demais',
                });
                fileErrors.push(fileError);
                continue;
            }
            file.sizes = [];
            file.colors = [];
            file.status = 'available';
            file.price = '';
            file.referenceId = '';
            file.description = '';
            file.availableQuantities = '';

            allFilePromises.push(readFile(file));
        }

        setErrors(fileErrors);

        Promise.all(allFilePromises).then(newFilesData => {
            const dataURLs = pictures.slice();
            const files = filesList.slice();

            newFilesData.forEach(newFileData => {
                dataURLs.push(newFileData.dataURL);
                files.push(newFileData.file);
                updateInitialState(newFileData.file);
            });
            setPictures(dataURLs);
            setFiles(files);
        });
    }

    function onClickChoosePhotos(e) {
        e.stopPropagation();
        e.preventDefault();
        console.log(e.dataTransfer);
        const { files } = e.target;
        settingThePicturesAndFiles(files);
    }

    function onDropFile(e) {
        e.stopPropagation();
        e.preventDefault();
        console.log(e.dataTransfer);
        const { files } = e.dataTransfer;
        settingThePicturesAndFiles(files);
    }

    let inputElement = '';

    function triggerFileUpload() {
        inputElement.click();
    }

    function removeImage(picture) {
        console.log(typeof picture);
        const removeIndex = pictures.findIndex(e => e === picture);
        const filteredPictures = pictures.filter((e, index) => index !== removeIndex);
        const filteredFiles = filesList.filter((e, index) => index !== removeIndex);
        //const listOfProducts = products.filter((e, index) => index !== removeIndex);
        console.log('lista de arquivos: ', filesList);
        // console.log('lista de produtos: ', listOfProducts);

        //setProducts(listOfProducts);
        setPictures(filteredPictures);
        setFiles(filteredFiles);
    }

    const validations = useMemo(
        () => [
            {
                name: 'availability',
                validation: value => value !== 'waitingInfo',
                value: product.status,
                message: 'Campo obrigatório',
            },
            ...(product.status !== 'available'
                ? []
                : [
                    {
                        name: 'price',
                        validation: ([price, totalQty]) => (totalQty > 0 ? !!price : true),
                        value: [product.price, Object.values(product.availableQuantities || {}).reduce((acc, prev) => acc + parseInt(prev), 0)],
                        message: 'Campo obrigatório',
                    },
                ]),
        ],
        [product],
    );
    return (
        <div>
            <div style={fileContainerClass} className="fileContainer" onDragOver={onDragOver}>
                <input
                    style={inputImagesId}
                    id="inputImages"
                    ref={input => (inputElement = input)}
                    type="file"
                    multiple
                    onChange={onClickChoosePhotos}
                    onClick={onUploadClick}
                    accept="image/*"
                />
                <div style={phases}>
                    <label style={title}>Etapa 1</label>
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
                <div style={phases}>
                    <label style={title}>Etapa 2</label>
                    <Dropdown
                        readOnly
                        submitting={isSubmitting}
                        value={pricetag}
                        onChange={({ target: { value } }) => setPricetag(value)}
                        list={['Sim', 'Não']}
                        placeholder="Tem o preço na imagem?"
                        onChangeKeyboard={element => (element ? setPricetag(element.value) : null)}
                    />
                </div>
                <div style={phases}>
                    <label style={title}>Etapa 3</label>
                    <Dropdown
                        readOnly
                        submitting={isSubmitting}
                        value={photoPeriod}
                        onChange={({ target: { value } }) => setPhotoPeriod(value)}
                        list={['Nova', 'Antiga']}
                        placeholder="A imagem é nova ou antiga?"
                        onChangeKeyboard={element => (element ? setPhotoPeriod(element.value) : null)}
                    />
                </div>

                <label style={title}>Etapa 4</label>
                <Icon style={fileContainerUploadIconClass} type="upload" size={50} strokeWidth={3}
                      className="uploadIcon" alt="Upload Icon"/>
                <ImageUpload
                    sendToBackend={data => settingThePicturesAndFiles(data)}
                    //isDisabled={!isValidBrand(brands, brand) || isSubmitting}
                />
                {pictures[1] && (
                    <>
                        <div style={{ marginTop: '10px' }}/>
                        <Button
                            click={() =>
                                sendToBackend(
                                    setIsSubmitting,
                                    setIsSubmitted,
                                    setBrand,
                                    brand,
                                    brandsAndTrends,
                                    pricetag,
                                    setPricetag,
                                    photoPeriod,
                                    setPhotoPeriod,
                                    filesList,
                                    products,
                                    setProducts,
                                    setPictures,
                                    setFiles,
                                )
                            }
                            submitting={!pricetag || !photoPeriod || !brand || !isValidBrand(brands, brand) || isSubmitting}
                            cta={'Enviar todas fotos'}
                            type="button"
                        />
                    </>
                )}
                {pictures.map((picture, index) => {
                    return (
                        <Card
                            key={index}
                            products={products}
                            setProducts={setProducts}
                            filesList={filesList}
                            setFiles={setFiles}
                            product={product}
                            initialValue={initialValue}
                            setProduct={setProduct}
                            index={index}
                            picture={picture}
                            removeImage={removeImage}
                            arrayInputs={arrayInputs[index]}
                            validations={validations}
                        />
                    );
                })}
                <div style={{ marginTop: '10px' }}/>
                <Button
                    click={() =>
                        sendToBackend(
                            setIsSubmitting,
                            setIsSubmitted,
                            setBrand,
                            brand,
                            brandsAndTrends,
                            pricetag,
                            setPricetag,
                            photoPeriod,
                            setPhotoPeriod,
                            filesList,
                            products,
                            setProducts,
                            setPictures,
                            setFiles,
                        )
                    }
                    submitting={!pricetag || !photoPeriod || !brand || !isValidBrand(brands, brand) || isSubmitting}
                    cta={'Enviar todas fotos'}
                    type="button"
                />
            </div>
        </div>
    );
};
UploadImages.whyDidYouRender = true;
export default UploadImages;
