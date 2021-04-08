import React, { useContext, useEffect, useReducer, useState } from 'react'
import Button from '@bit/vitorbarbosa19.ziro.button'
import ImageUpload from '@bit/vitorbarbosa19.ziro.image-upload'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import { v4 as uuid } from 'uuid'
import AutoSizer from 'react-virtualized-auto-sizer'
import { Virtuoso } from 'react-virtuoso'
import fetch from './fetch'
import { cardContainerClass, fileContainerClass } from './styles'
import sendToBackend from './sendToBackend'
import { duplicateImage, inputStateControl, isValidBrand, onDragOver, removeImage, settingThePicturesAndFiles } from './functionsUploadImages'
import Card from '../CardForm'
import BrandChoose from './BrandChoose'
import inputs from './inputs'
import ToastNotification from '../ToastNotification'
import { userContext } from '../appContext'

const UploadImages = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [brands, setBrands] = useState([])
  const [brandsAndTrends, setBrandsAndTrends] = useState('')
  const [brand, setBrand] = useState('')
  const [pictures, setPictures] = useState([])
  const [filesList, setFiles] = useState([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [showButtonTop, setShowButtonTop] = useState(false)
  const [showButtonBot, setShowButtonBot] = useState(false)
  const [openToast, setOpenToast] = useState(false)
  const [typeOfToast, setTypeOfToast] = useState('alert')
  const [messageToast, setMessageToast] = useState('')
  const [thumbPhoto, setThumbPhoto] = useState('')
  const [oldPictures, setOldPictures] = useState([''])
  const [states, dispatch] = useReducer((state, payload) => inputStateControl(state, payload), {})
  const defaultQuantityValue = 2
  const { device } = useContext(userContext)
  useEffect(() => fetch(setIsLoading, setIsError, setBrands, setBrandsAndTrends), [])
  useEffect(() => {
    if (filesList.length === 0) setThumbPhoto('')
  }, [filesList])

  useEffect(() => {
    if (pictures[0]) setShowButtonBot(true)
    else setShowButtonBot(false)
    if (pictures[1]) setShowButtonTop(true)
    else setShowButtonTop(false)
    if (oldPictures !== pictures) setOldPictures(pictures)
  }, [pictures])

  useEffect(() => {
    if (isValidBrand(brands, brand)) {
      setShowUpload(true)
    } else setShowUpload(false)
  }, [brand])

  if (isLoading) return <Spinner size="5rem" />
  // if (isError) return <Error />;
  const state = {
    setIsSubmitting,
    setIsSubmitted,
    setBrand,
    states,
    brand,
    brandsAndTrends,
    filesList,
    setPictures,
    setFiles,
    dispatch,
    thumbPhoto,
    setThumbPhoto,
    setOpenToast,
    setMessageToast,
    setTypeOfToast,
  }
  let cont = 0
  console.log('render inside UploadImages', cont++)
  return (
    <>
      <BrandChoose isSubmitting={isSubmitting} brand={brand} setBrand={setBrand} brands={brands} />
      <div className="fileContainer" onDragOver={onDragOver}>
        <ToastNotification openToastRoot={openToast} setOpenToastRoot={setOpenToast} messageToastRoot={messageToast} type={typeOfToast} />
        {showUpload && (
          <>
            <ImageUpload
              sendToBackend={data =>
                settingThePicturesAndFiles(
                  data,
                  setIsError,
                  pictures,
                  filesList,
                  setPictures,
                  setFiles,
                  uuid,
                  states,
                  dispatch,
                  thumbPhoto,
                  setThumbPhoto,
                )
              }
              isDisabled={!isValidBrand(brands, brand) || isSubmitting}
            />
            <div style={cardContainerClass}>
              {showButtonTop && (
                <>
                  <Button click={() => sendToBackend(state)} submitting={isSubmitting} cta="Enviar todas fotos" type="button" />
                </>
              )}
              <div style={{ display: 'flex' }}>
                <div style={{ flex: '1 1 auto', height: '100vh' }}>
                  <AutoSizer defaultHeight={1200} defaultWidth={800}>
                    {({ width, height }) => {
                      return (
                        <Virtuoso
                          style={{ height, width }}
                          data={filesList}
                          useWindowScroll
                          components={{
                            Footer: () => {
                              return (
                                <div
                                  style={{
                                    marginTop: '50px',
                                    marginBottom: '50px',
                                  }}
                                >
                                  {showButtonBot && <Button click={() => sendToBackend(state)} submitting={!showButtonBot || isSubmitting} cta="Enviar todas fotos" type="button" />}
                                </div>
                              );
                            },
                          }}
                          itemContent={(index, data) => {
                            return (
                              <div key={index} style={{marginTop:'2rem'}}>
                                <Card
                                  key={index}
                                  identifierOfPicture={pictures[index].identifier}
                                  states={states}
                                  filesList={filesList}
                                  setFiles={setFiles}
                                  index={index}
                                  picture={pictures[index].urlImage}
                                  removeImage={removeImage}
                                  duplicateImage={duplicateImage}
                                  arrayOfInputs={inputs(states, pictures[index].identifier, dispatch, defaultQuantityValue, device, isSubmitting)}
                                  pictures={pictures}
                                  setPictures={setPictures}
                                  dispatch={dispatch}
                                  uuid={uuid}
                                  thumbPhoto={thumbPhoto}
                                  setThumbPhoto={setThumbPhoto}
                                />
                              </div>
                            )
                          }}
                        />
                      )
                    }}
                  </AutoSizer>
                </div>
              </div>

              {/* pictures === oldPictures &&
                pictures.map((picture, index) => {
                  console.log('index inside the MAP UploadImages', index)
                  return (
                    <div key={index}>
                      <Card
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
                      />
                    </div>
                  )
                }) */}
            </div>
          </>
        )}
      </div>
    </>
  )
}
export default UploadImages
