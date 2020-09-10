/* eslint-disable no-nested-ternary */
import React, { memo, useCallback, useMemo, useState } from 'react'
import {
  fileContainerUploadPictureContainerClass,
  fileContainerUploadPictureContainerimgUploadPictureClass,
  fileContainerUploadPicturesWrapperClass,
  image,
} from './styles'

import CardControls from './CardControls'
import CardInputs from './cardInputs'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import InfoCard from './infoCard'
import RImg from 'react-image'
import SpinnerWithDiv from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import SummaryCard from './summaryCard'
import CardControls from './CardControls'

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

export default memo(
  ({
    product,
    filesList,
    setFiles,
    index,
    picture,
    removeImage,
    update,
    updateCarts,
    cardInfo = false,
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
    identifierOfPicture,
    uuid,
    thumbPhoto,
    setThumbPhoto,
    secondArrayOfInputs,
  }) => {
    console.log('index inside cardForm', index)
    console.log('product', product)

    const [removeImageModal, setRemoveImageModal] = useState(false)
    const [duplicateImageModal, setDuplicateImageModal] = useState(false)
    return (
      <div style={fileContainerUploadPicturesWrapperClass} className="uploadPicturesWrapper">
        <div key={index} style={fileContainerUploadPictureContainerClass} className="uploadPictureContainer">
          <CardControls
            duplicateImage={duplicateImage}
            filesList={filesList}
            pictures={pictures}
            picture={picture}
            setPictures={setPictures}
            setFiles={setFiles}
            setDuplicateImageModal={setDuplicateImageModal}
            identifierOfPicture={identifierOfPicture}
            uuid={uuid}
            index={index}
            dispatch={dispatch}
            duplicateImageModal={duplicateImageModal}
            removeImage={removeImage}
            setRemoveImageModal={setRemoveImageModal}
            thumbPhoto={thumbPhoto}
            setThumbPhoto={setThumbPhoto}
            removeImageModal={removeImageModal}
          />

          {cardInfo ? (
            <RImg
              src={product.url}
              style={image}
              container={children =>
                editing || !initialStatus || initialStatus === 'waitingInfo' ? (
                  <>
                    <CardInputs
                      image={children || null}
                      update={update || null}
                      updateCarts={updateCarts || null}
                      index={index}
                      arrayOfInputs={arrayOfInputs}
                      validations={validations}
                      secondArrayOfInputs={secondArrayOfInputs}
                      product={product}
                      setEditing={setEditing}
                    />
                  </>
                ) : initialStatus === 'unavailable' && cartProduct.status !== 'closed' ? (
                  <InfoCard product={{ requestedQuantities: {}, ...state, ...cartProduct }} image={children} setEditing={setEditing} />
                ) : (
                  <SummaryCard product={{ requestedQuantities: {}, ...state, ...cartProduct }} image={children} setEditing={setEditing} />
                )
              }
              loaderContainer={() => <SpinnerWithDiv />}
            />
          ) : (
            <RImg
              src={picture}
              style={fileContainerUploadPictureContainerimgUploadPictureClass}
              alt="preview"
              container={children => (
                <CardInputs disabled image={children || null} update={update || null} arrayOfInputs={arrayOfInputs} validations={[]} index={index} />
              )}
            />
          )}
        </div>
      </div>
    )
  },
)
