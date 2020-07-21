import { fontTitle, gradient } from '@ziro/theme';

export const brandName = {
        marginBottom: '-20px',
        padding: '10px 0',
        fontFamily: fontTitle,
        fontSize: '20px',
        textAlign: 'center',
    },
    image = {
        alignSelf: 'start',
        objectFit: 'cover',
        width: '100%',
        borderRadius: '3px',
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
    card = {
        borderRadius: '20px',
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
    phases = {
        flexFlow: 'column wrap',
        width: '80%',
        height: '100px',
        position: 'relative',
        margin: '0 auto',
        transition: 'all 0.3s ease-in',
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
    //#inputImages
    inputImagesId = {
        opacity: '0',
        position: 'absolute',
        zIndex: '-1',
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
        //margin: '5%',
        paddingTop: '10px',
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
        borderTopLeftRadius: '10px',
        borderTopRightRadius: '10px',
        width: '100%',
    },
    //.fileContainer .deleteImage
    fileContainerDeleteImageClass = {
        position: 'absolute',
        right: '5px',
        top: '30px',
        background: '#fff',
        borderRadius: '50%',
        textAlign: 'center',
        cursor: 'pointer',
        fontSize: '26px',
        fontWeight: 'bold',
        lineHeight: '30px',
        width: '20px',
        height: '20px',
    },
    //.flipMove
    flipMoveClass = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        width: '100%',
    };
