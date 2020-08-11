import React, { useCallback, useContext, useEffect, useReducer, useState } from 'react';
import RImg from 'react-image';
import SpinnerWithDiv from '@bit/vitorbarbosa19.ziro.spinner-with-div';
import { v4 as uuid } from 'uuid';
import { image } from './styles';
import { db, fs } from '../../../Firebase';
import SummaryCard from './summaryCard';
import InfoCard from './infoCard';
import inputs from './inputs';
import Card from '../../CardForm';
import { inputStateControl } from './functionsUserCartItem';
import { userContext } from '../../appContext';

export default ({ productId, cartProduct, setURL, setPrice }) => {
    const [productRef] = useState(db.collection('catalog-images').doc(productId));
    const [fetchingProduct, setFetchingProduct] = useState(true);
    const [editing, setEditing] = useState(false);
    const [product, setProduct] = useState({ discount: '' });
    const [cartProductUpdate, setCartProductUpdate] = useState({ status: 'available', identifierOfPicture });
    const [initialStatus, setInitialStatus] = useState();
    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);
    const [typeSize, setTypeSize] = useState('');
    const [sizesUpdate, setSizesUpdate] = useState([]);
    const [colorsUpdate, setColorsUpdate] = useState([]);
    const { device } = useContext(userContext);
    const defaultQuantityValue = 2;
    const [states, dispatch] = useReducer((state, payload) => inputStateControl(state, payload), {});
    const updateCart = true;
    console.log(states);
    const [identifierOfPicture, setIdentifierOfPicture] = useState(uuid());

    useEffect(
        () =>
            productRef.onSnapshot(snap => {
                const data = snap.data();
                if (data.availableQuantities) {
                    Object.keys(data.availableQuantities).forEach(key => {
                        const [size, color] = key.split('-');
                        if (size) {
                            setSizes(old => (old.includes(size) ? old : [...old, size]));
                            setSizesUpdate(old => (old.includes(size) ? old : [...old, size]));
                        }
                        if (color) {
                            setColors(old => (old.includes(color) ? old : [...old, color]));
                            setColorsUpdate(old => (old.includes(color) ? old : [...old, color]));
                        }
                    });
                }

                setPrice(data.price);
                setURL(data.url);
                setProduct(data);
                setInitialStatus(data.status);
                setFetchingProduct(false);
                const payload = {
                    userValue: '',
                    identifierOfPicture,
                    inputType: 'initial',
                };
                dispatch(payload);
            }),
        [],
    );

    const update = useCallback(async () => {
        try {
            const cartsWithThisProduct = await db
                .collectionGroup('cart')
                .where('productIds', 'array-contains', productId)
                .where('status', '>', 'closed')
                .get();
            await db.runTransaction(async transaction => {
                if (product.status === 'available' && !Object.keys(product.availableQuantities || {}).length)
                    transaction.update(productRef, { ...product, status: 'waitingStock' });
                else if (
                    product.status === 'available' &&
                    Object.values(product.availableQuantities || {}).reduce((acc, cur) => acc + parseInt(cur), 0) === 0
                )
                    transaction.update(productRef, { ...product, status: 'soldOut' });
                else if (product.status === 'waitingInfo' || product.status === 'unavailable')
                    transaction.update(productRef, {
                        status: product.status,
                        price: fs.FieldValue.delete(),
                        referenceId: fs.FieldValue.delete(),
                        description: fs.FieldValue.delete(),
                        availableQuantities: fs.FieldValue.delete(),
                    });
                else transaction.update(productRef, product);

                cartsWithThisProduct.docs.forEach(doc =>
                    transaction.set(
                        doc.ref,
                        {
                            products: {
                                [productId]: {
                                    requestedQuantities: fs.FieldValue.delete(),
                                    status: fs.FieldValue.delete(),
                                },
                            },
                            status: 'open',
                            total: fs.FieldValue.delete(),
                            lastUpdate: fs.FieldValue.serverTimestamp(),
                            updatedBy: 'seller',
                        },
                        { merge: true },
                    ),
                );
            });
            setEditing(false);
        } catch (error) {
            console.log({ error });
            throw error;
        }
    }, [productRef, product]);

    if (fetchingProduct) return <SpinnerWithDiv/>;
    return (
        <RImg
            src={product.url}
            style={image}
            container={children =>
                !initialStatus || initialStatus === 'waitingInfo' || editing ? (
                    /* <Card
                                    key={index}
                                    identifierOfPicture={picture.identifier}
                                    states={states}
                                    filesList={filesList}
                                    setFiles={setFiles}
                                    index={index}
                                    picture={picture.urlImage}
                                    removeImage={removeImage}
                                    duplicateImage={duplicateImage}
                                    arrayOfInputs={inputs(states, picture.identifier, dispatch, defaultQuantityValue, device, isSubmitting)}
                                    pictures={pictures}
                                    setPictures={setPictures}
                                    dispatch={dispatch}
                                    uuid={uuid}
                                    thumbPhoto={thumbPhoto}
                                    setThumbPhoto={setThumbPhoto}
                                /> */
                    <Card
                        image={children}
                        product={product}
                        productRef={productRef}
                        setProduct={setProduct}
                        setColors={setColors}
                        setSizes={setSizes}
                        colors={colors}
                        sizes={sizes}
                        update={update}
                        typeSize={typeSize}
                        setTypeSize={setTypeSize}
                        arrayOfInputs={inputs(
                            product,
                            setProduct,
                            sizes,
                            setSizes,
                            colors,
                            setColors,
                            update,
                            defaultQuantityValue,
                            device,
                            states,
                            dispatch,
                            identifierOfPicture,
                        )}
                        states={states}
                        dispatch={dispatch}
                        secondArrayOfInputs={inputs(
                            cartProductUpdate,
                            setCartProductUpdate,
                            sizesUpdate,
                            setSizesUpdate,
                            colorsUpdate,
                            setColorsUpdate,
                            update,
                            defaultQuantityValue,
                            device,
                            states,
                            dispatch,
                            identifierOfPicture,
                            updateCart,
                        ).filter(
                            input =>
                                input !== 0 &&
                                input !== false &&
                                input.props.name !== 'referenceId' &&
                                input.props.name !== 'availability' &&
                                input.props.name !== 'price' &&
                                input.props.name !== 'description',
                        )}
                        cardInfo
                    />
                ) : initialStatus === 'unavailable' && cartProduct.status !== 'closed' ? (
                    <InfoCard product={{ requestedQuantities: {}, ...product, ...cartProduct }} image={children}
                              setEditing={setEditing}/>
                ) : (
                    <SummaryCard product={{ requestedQuantities: {}, ...product, ...cartProduct }} image={children}
                                 setEditing={setEditing}/>
                )
            }
            loaderContainer={() => <SpinnerWithDiv/>}
        />
    );
}
