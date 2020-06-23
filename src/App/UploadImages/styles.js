import { fontTitle, gradient, grayColor2 } from '@ziro/theme';

export const brandCart = {
        display: 'grid',
        gridGap: '20px',
    },
    brandName = {
        marginBottom: '-20px',
        padding: '10px 0',
        fontFamily: fontTitle,
        fontSize: '20px',
        textAlign: 'center',
    },
    cardBlock = {
        display: 'grid',
        gridTemplateColumns: '80px 1fr',
        alignItems: 'end',
        padding: '20px 10px',
        borderRadius: '3px',
        boxShadow: 'rgba(34, 34, 34, 0.3) 0px 5px 10px -1px',
    },
    image = {
        alignSelf: 'start',
        objectFit: 'cover',
        width: '100%',
        borderRadius: '3px',
    },
    cardText = {
        display: 'grid',
        alignItems: 'center',
        gridRowGap: '15px',
        padding: '0 0 0 15px',
    },
    icon = {
        alignSelf: 'center',
        justifySelf: 'end',
        display: 'grid',
        justifyItems: 'center',
        alignItems: 'center',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'white',
        boxShadow: 'rgba(34, 34, 34, 0.3) 0px 5px 10px -1px',
    },
    orderStatus = status => ({
        fontFamily: fontTitle,
        textAlign: status ? 'center' : 'left',
        alignSelf: status ? 'end' : 'initial',
    }),
    order = {
        display: 'grid',
        gridRowGap: '2px',
    },
    orderTitle = {
        color: grayColor2,
        fontSize: '1.4rem',
        fontWeight: '500',
    },
    orderGrid = {
        display: 'grid',
        gridTemplateColumns: '1fr auto',
    },
    orderQty = {
        fontSize: '1.4rem',
    },
    button = {
        margin: '10px auto 0',
        display: 'block', // necessary for link version
        WebkitAppearance: 'none',
        WebkitTapHighlightColor: 'rgba(0,0,0,0)',
        MozAppearance: 'none',
        outline: 'none',
        cursor: 'pointer',
        height: '30px',
        width: '100%',
        maxWidth: '200px',
        padding: '8px 0px',
        border: 'none',
        borderRadius: '20px',
        fontFamily: fontTitle,
        fontSize: '1.3rem',
        color: '#FFF',
        textAlign: 'center',
        background: gradient,
        boxShadow: `0px 3px 12px -3px rgba(34,34,34,0.65)`,
    },
    buttonDownload = {
        ...button,
        maxWidth: 'none',
        height: 'none',
        margin: '0',
        padding: '10px 0px',
        fontSize: '1.5rem',
        boxShadow: `0px 3px 12px -2px rgba(34,34,34,0.65)`,
    },
    card = {
        display: 'grid',
        padding: '10px',
        background: 'white',
        gridGap: '10px',
        boxShadow: 'rgba(34, 34, 34, 0.3) 0px 5px 15px -4px',
    },
    content = {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridGap: '10px',
        alignItems: 'center',
        borderTop: '1px solid #F0F0F0',
    },
    qtyLabel = {
        padding: '10px 10px',
        borderTop: '1px solid #F0F0F0',
        borderBottom: '1px solid #F0F0F0',
    },
    qtyContainer = {
        display: 'grid',
        gridTemplateColumns: '1fr 2fr 1fr',
        alignItems: 'center',
    },
    phases = {
        flexFlow: 'column wrap',
        width: '80%',
        height: '100px',
        position: 'relative',
        margin: '0 auto',
        transition: 'all 0.3s ease-in',
    },
    //.fileUploader
    fileUploaderClass = {
        width: '100%',
    },
    //.fileContainer
    fileContainerClass = {
        background: '#fff',
        boxShadow: '2px 2px 3px 0 rgba(0, 0, 0, 0.05)',
        position: 'relative',
        borderRadius: '10px',
        padding: '20px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        margin: '10px auto',
        transition: 'all 0.3s ease-in',
    },
    //#uploadPictureInput
    uploadPictureInputId = {
        opacity: '1 !important',
        position: 'absolute',
        zIndex: '1 !important',
        width: '90% !important',
        height: '20px !important',
    },
    //.fileContainer input
    fileContainerinputClass = {
        position: 'absolute',
    },
    //#inputImages
    inputImagesId = {
        opacity: '0',
        position: 'absolute',
        zIndex: '-1',
    },
    //.fileContainer p
    fileContainerpClass = {
        fontSize: '12px',
        margin: '8px 0 4px',
    },
    //.fileContainer .errorsContainer
    fileContainerErrorsContainerClass = {
        maxWidth: '300px',
        fontSize: '12px',
        color: 'red',
        textAlign: 'left',
    },
    //.fileContainer .chooseFileButton
    fileContainerChooseFileButtonClass = {
        padding: '6px 23px',
        background: '#3f4257',
        borderRadius: '30px',
        color: 'white',
        fontWeight: '300',
        fontSize: '14px',
        margin: '10px 0',
        transition: 'all 0.2s ease-in',
        cursor: 'pointer',
        outline: 'none',
        border: 'none',
    },
    //.fileContainer .chooseFileButton:hover
    fileContainerChooseFileButtonHoverClass = {
        background: '#545972',
    },
    //.fileContainer .uploadFilesButton
    fileContainerUploadFilesButtonClass = {
        padding: '5px 43px',
        background: 'transparent',
        borderRadius: '30px',
        color: '#3f4257',
        fontWeight: '300',
        fontSize: '14px',
        margin: '10px 0',
        transition: 'all 0.2s ease-in',
        cursor: 'pointer',
        outline: 'none',
        border: '1px solid #3f4257',
    },
    //.fileContainer .uploadFilesButton:hover
    fileContainerUploadFilesButtonHoverClass = {
        background: '#3f4257',
        color: '#fff',
    },
    //.fileContainer .uploadIcon
    fileContainerUploadIconClass = {
        width: '50px',
        height: '50px',
    },
    //.fileContainer .uploadPicturesWrapper
    fileContainerUploadPicturesWrapperClass = {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '100%',
    },
    //.fileContainer .uploadPictureContainer
    fileContainerUploadPictureContainerClass = {
        width: '100%',
        margin: '5%',
        padding: '10px',
        //background: '#edf2f6',
        Display: 'flex',
        AlignItems: 'center',
        justifyContent: 'center',
        height: 'inherit',
        //boxShadow: '0 0 8px 2px rgba(0, 0, 0, 0.1)',
        //border: '1px solid #d0dbe4',
        position: 'relative',
    },
    //.fileContainer .uploadPictureContainer img.uploadPicture
    fileContainerUploadPictureContainerimgUploadPictureClass = {
        width: '100%',
    },
    //.fileContainer .deleteImage
    fileContainerDeleteImageClass = {
        position: 'absolute',
        right: '9px',
        color: '#fff',
        background: '#ff4081',
        borderRadius: '50%',
        textAlign: 'center',
        cursor: 'pointer',
        fontSize: '26px',
        fontWeight: 'bold',
        lineHeight: '30px',
        width: '30px',
        height: '30px',
    },
    //.flipMove
    flipMoveClass = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        width: '100%',
    };
