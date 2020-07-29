import React, { useState } from 'react';
import RImg from 'react-image';
import SpinnerWithDiv from '@bit/vitorbarbosa19.ziro.spinner-with-div';
import Modal from '@bit/vitorbarbosa19.ziro.modal';
import Button from '@bit/vitorbarbosa19.ziro.button';
import CardInputs from './cardInputs';
import {
    fileContainerUploadPictureContainerClass,
    fileContainerUploadPictureContainerimgUploadPictureClass,
    fileContainerUploadPicturesWrapperClass,
} from './styles';
import InfoCard from './infoCard';
import SummaryCard from './summaryCard';
import RemoveImageButton from './RemoveImageButton';
import DuplicateImageButton from './DuplicateImageButton';
import CheckBoxThumbPhoto from './CheckBoxThumbPhoto';
import { modalContainer, modalLabel } from '../Transactions/TransactionDetails/styles';

const PTstatus = {
    available: 'Disponível',
    unavailable: 'Indisponível',
    closed: 'Disponível',
    waitingInfo: '',
    soldOut: 'Indisponível',
}

const INstatus = {
    Disponível: 'available',
    Indisponível: 'soldOut',
}

export default ({
                    products,
                    setProducts,
                    filesList,
                    setFiles,
                    index,
                    picture,
                    removeImage,
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
                    initialStatus,
                    dispatch,
                    duplicateImage,
                    // removeImageModal,
                    // setRemoveImageModal,
                    // duplicateImageModal,
                    // setDuplicateImageModal,
                    identifierOfPicture,
                    uuid,
                    thumbPhoto,
                    setThumbPhoto,
                }) => {
    const [removeImageModal, setRemoveImageModal] = useState(false);
    const [duplicateImageModal, setDuplicateImageModal] = useState(false);
    return (
        <div style={fileContainerUploadPicturesWrapperClass} className="uploadPicturesWrapper">
            <div key={index} style={fileContainerUploadPictureContainerClass} className="uploadPictureContainer">
                <DuplicateImageButton setDuplicateImageModal={setDuplicateImageModal}/>
                <Modal boxStyle={modalContainer} isOpen={duplicateImageModal}
                       setIsOpen={() => setDuplicateImageModal(false)}>
                    <div style={{ display: 'grid', gridTemplateRows: '1fr auto', gridRowGap: '20px' }}>
                        <label style={modalLabel}>Deseja realmente duplicar a imagem?</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap: '20px' }}>
                            <Button
                                type="button"
                                cta="Sim"
                                click={() =>
                                    duplicateImage(filesList, pictures, picture, setPictures, setFiles, setDuplicateImageModal, identifierOfPicture, uuid, index, dispatch)
                                }
                                template="regular"
                            />
                            <Button type="button" cta="Não" click={() => setDuplicateImageModal(false)}
                                    template="light"/>
                        </div>
                    </div>
                </Modal>
                {removeImage && (
                    <>
                        <RemoveImageButton setRemoveImageModal={setRemoveImageModal}/>
                        <Modal boxStyle={modalContainer} isOpen={removeImageModal}
                               setIsOpen={() => setRemoveImageModal(false)}>
                            <div style={{ display: 'grid', gridTemplateRows: '1fr auto', gridRowGap: '20px' }}>
                                <label style={modalLabel}>Deseja realmente excluir a imagem ?</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap: '20px' }}>
                                    <Button
                                        type="button"
                                        cta="Sim"
                                        click={() => removeImage(filesList, pictures, picture, setPictures, setFiles, setRemoveImageModal, identifierOfPicture)}
                                        template="regular"
                                    />
                                    <Button type="button" cta="Não" click={() => setRemoveImageModal(false)}
                                            template="light"/>
                                </div>
                            </div>
                        </Modal>
                    </>
                )}
                <CheckBoxThumbPhoto thumbPhoto={thumbPhoto} setThumbPhoto={setThumbPhoto}
                                    identifierOfPicture={identifierOfPicture}/>
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
                                disabled
                                image={children || null}
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
}
