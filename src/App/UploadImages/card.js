import React from 'react';
import EditCard from './editCard';
import {
    fileContainerDeleteImageClass,
    fileContainerUploadPictureContainerClass,
    fileContainerUploadPictureContainerimgUploadPictureClass,
    fileContainerUploadPicturesWrapperClass,
} from './styles';
import RImg from 'react-image';

export default ({
                    products,
                    setProducts,
                    filesList,
                    setFiles,
                    index,
                    picture,
                    removeImage,
                    productRef,
                    update,
                    arrayOfInputs,
                    product,
                    setProduct,
                    setColors,
                    setSizes,
                    colors,
                    sizes,
                }) => {
    return (
        <div style={fileContainerUploadPicturesWrapperClass} className="uploadPicturesWrapper">
            <div key={index} style={fileContainerUploadPictureContainerClass} className="uploadPictureContainer">
                <div style={fileContainerDeleteImageClass} className="deleteImage" onClick={() => removeImage(picture)}>
                    X
                </div>
                <RImg
                    src={picture}
                    style={fileContainerUploadPictureContainerimgUploadPictureClass}
                    className="uploadPicture"
                    alt="preview"
                    container={children => (
                        <EditCard
                            image={children || null}
                            productRef={productRef || null}
                            index={index}
                            products={products}
                            setProducts={setProducts}
                            filesList={filesList}
                            setFiles={setFiles}
                            product={product}
                            setProduct={setProduct}
                            setColors={setColors}
                            setSizes={setSizes}
                            colors={colors}
                            sizes={sizes}
                            update={update || null}
                            arrayOfInputs={arrayOfInputs}
                        />
                    )}
                />
            </div>
        </div>
    );
};
