import React, { useState } from 'react';
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

export default ({
                    products,
                    setProducts,
                    filesList,
                    setFiles,
                    index,
                    picture,
                    removeImage = null,
                    update,
                    arrayOfInputs,
                    productForCard,
                    setURL,
                    cardInfo = false,
                    initialStatus,
                    setInitialStatus,
                    productRef,
                    editing,
                    cartProduct,
                    setEditing,
                    colors,
                    setColors,
                    sizes,
                    setSizes,
                    initialValues,
                    setStates,
                    validations,
                }) => {
    const [product, setProduct] = useState({ initialValues });
    // const [product, setProduct] = useState(productForCard);
    // const [colors, setColors] = useState(productForCard.colors);
    // const [sizes, setSizes] = useState(productForCard.sizes);
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
                        src={product.url}
                        style={image}
                        container={children =>
                            !initialStatus || initialStatus === 'waitingInfo' || editing ? (
                                <CardInputs
                                    image={children}
                                    product={product}
                                    productRef={productRef}
                                    setProduct={setProduct}
                                    setColors={setColors}
                                    colors={colors}
                                    sizes={sizes}
                                    update={update}
                                    validations={validations}
                                />
                            ) : initialStatus === 'unavailable' && cartProduct.status !== 'closed' ? (
                                <InfoCard product={{ requestedQuantities: {}, ...product, ...cartProduct }}
                                          image={children} setEditing={setEditing}/>
                            ) : (
                                <SummaryCard product={{ requestedQuantities: {}, ...product, ...cartProduct }}
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
                                index={index}
                                products={products}
                                setProducts={setProducts}
                                filesList={filesList}
                                setFiles={setFiles}
                                product={product}
                                setProduct={setProduct}
                                colors={colors}
                                sizes={sizes}
                                update={update || null}
                                arrayOfInputs={arrayOfInputs}
                                setURL={setURL}
                                validations={validations}
                            />
                        )}
                    />
                )}
            </div>
        </div>
    );
};
