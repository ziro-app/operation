import React from 'react';
import { checkboxContainer, container } from './styles';
import DuplicateImageButton from './Buttons/DuplicateButton';
import RemoveImageButton from './Buttons/RemoveImageButton';
import CheckBoxThumbPhoto from './Buttons/CheckBoxThumbButton';
import ModalComponent from './Modal';

const CardControls = ({
                          duplicateImage,
                          filesList,
                          pictures,
                          picture,
                          setPictures,
                          setFiles,
                          setDuplicateImageModal,
                          identifierOfPicture,
                          uuid,
                          index,
                          dispatch,
                          duplicateImageModal,
                          removeImage,
                          setRemoveImageModal,
                          thumbPhoto,
                          setThumbPhoto,
                          removeImageModal,
                      }) => {
    return (
        <div style={container}>
            <div style={checkboxContainer}>
                {setThumbPhoto ? (
                    <>
                        <CheckBoxThumbPhoto thumbPhoto={thumbPhoto} setThumbPhoto={setThumbPhoto}
                                            identifierOfPicture={identifierOfPicture}/>
                        <div/>
                        {/* <div style={caption}>Foto de capa</div> */}
                    </>
                ) : (
                    <>
                        <div/>
                        <div/>
                    </>
                )}
                <DuplicateImageButton setDuplicateImageModal={setDuplicateImageModal}/>
                <ModalComponent
                    onClickFunction={duplicateImage}
                    openState={duplicateImageModal}
                    setOpenState={setDuplicateImageModal}
                    states={{
                        filesList,
                        pictures,
                        picture,
                        setPictures,
                        setFiles,
                        setDuplicateImageModal,
                        identifierOfPicture,
                        uuid,
                        index,
                        dispatch,
                    }}
                    labelText="Deseja realmente duplicar a imagem?"
                />
                {removeImage ? (
                    <>
                        <RemoveImageButton setRemoveImageModal={setRemoveImageModal}/>
                        <ModalComponent
                            onClickFunction={removeImage}
                            openState={removeImageModal}
                            setOpenState={setRemoveImageModal}
                            states={{
                                filesList,
                                pictures,
                                picture,
                                setPictures,
                                setFiles,
                                setRemoveImageModal,
                                identifierOfPicture,
                                thumbPhoto,
                                setThumbPhoto,
                            }}
                            labelText="Deseja realmente excluir a imagem ?"
                        />
                    </>
                ) : (
                    <div/>
                )}
            </div>
        </div>
    );
};

CardControls.propTypes = {};

export default CardControls
