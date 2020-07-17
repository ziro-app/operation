import React from 'react';
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
                    state,
                    arrayOfInputs,
                    pictures,
                    setPictures,
                }) => {
    //console.log('cardForm', arrayOfInputs);
    return (
        <div style={fileContainerUploadPicturesWrapperClass} className="uploadPicturesWrapper">
            <div key={index} style={fileContainerUploadPictureContainerClass} className="uploadPictureContainer">
                {removeImage && (
                    <div
                        style={fileContainerDeleteImageClass}
                        className="deleteImage"
                        onClick={() => removeImage(filesList, pictures, picture, setPictures, setFiles)}
                    >
                        X
                    </div>
                )}
                {cardInfo ? (
                    <RImg
                        src={state.url}
                        style={image}
                        container={children =>
                            !initialStatus || initialStatus === 'waitingInfo' || editing ? (
                                <CardInputs image={children || null} update={update || null} index={index}
                                            arrayOfInputs={arrayOfInputs} validations={validations}/>
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
                                arrayOfInputs={arrayOfInputs}
                                validations={[]}
                                index={index}
                            />
                        )}
                    />
                )}
            </div>
        </div>
    );
};
