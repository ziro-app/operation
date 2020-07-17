import React from 'react';
import FlipMove from 'react-flip-move';
import EditCard from './editCard';
import {
    fileContainerDeleteImageClass,
    fileContainerUploadPictureContainerClass,
    fileContainerUploadPictureContainerimgUploadPictureClass,
    fileContainerUploadPicturesWrapperClass,
    flipMoveClass,
} from './styles';
import RImg from 'react-image';

export default ({ pictures, setPictures, products, setProducts, filesList, setFiles }) => {
    function removeImage(picture) {
        const removeIndex = pictures.findIndex(e => e === picture);
        const filteredPictures = pictures.filter((e, index) => index !== removeIndex);
        const filteredFiles = filesList.filter((e, index) => index !== removeIndex);
        const listOfProducts = products.filter((e, index) => index !== removeIndex);

        setProducts(listOfProducts);
        setPictures(filteredPictures);
        setFiles(filteredFiles);
    }

    return (
        <div style={fileContainerUploadPicturesWrapperClass} className="uploadPicturesWrapper">
            <FlipMove enterAnimation="fade" leaveAnimation="fade" style={flipMoveClass}>
                {pictures.map((picture, index) => {
                    return (
                        <div key={index} style={fileContainerUploadPictureContainerClass}
                             className="uploadPictureContainer">
                            <div style={fileContainerDeleteImageClass} className="deleteImage"
                                 onClick={() => removeImage(picture)}>
                                X
                            </div>
                            <RImg src={picture} style={fileContainerUploadPictureContainerimgUploadPictureClass}
                                  className="uploadPicture" alt="preview"/>
                            <EditCard index={index} products={products} setProducts={setProducts} filesList={filesList}
                                      setFiles={setFiles}/>
                        </div>
                    );
                })}
            </FlipMove>
        </div>
    );
};
