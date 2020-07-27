import { readAndCompressImage } from 'browser-image-resizer';
import { db, storage } from '../../Firebase/index';
import { getMostRecentImage } from './functionsUploadImages';

const sendToBackend = async ({
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
                                 priceTag = 'Não',
                             }) => {
    setIsSubmitting(true);
    console.log('filesList inside sendToBackend', filesList);
    const uploadImages = await Promise.all(
        filesList.map(async file => {
            console.log('file inside sendToBackend', file);
            try {
                if (file.size === 0) throw 'Empty sized image';
                const timestamp = Date.now();
                const compressed = await readAndCompressImage(file, { quality: 0.65 });
                console.log('compressed', compressed);
                if (brand === 'Bot') {
                    const [brandName, index] = file.name.split('-');
                    const image = storage.child(`${brandName}/${brandName}-${timestamp}-${index}`);
                    const uploadTask = await image.put(compressed);
                    const url = await uploadTask.ref.getDownloadURL();
                    await db.collection('catalog-images').add({
                        brandName,
                        url,
                        timestamp,
                        pricetag: 'Não',
                        photoPeriod: 'Nova',
                        bucket: `${Math.floor(Math.random() * (20 - Number.MIN_VALUE))}`, //will be used to fetch random images on front-end
                    });
                    console.log(url);
                    return [url, timestamp, brandName];
                } else {
                    const image = storage.child(`${brand}/${brand}-${timestamp}-${file.name}`);
                    const uploadTask = await image.put(compressed);
                    const url = await uploadTask.ref.getDownloadURL();
                    await db.collection('catalog-images').add({
                        availableQuantities: states[`availableQuantities${file.identifierOfPicture}`]
                            ? states[`availableQuantities${file.identifierOfPicture}`]
                            : '',
                        price: states[`price${file.identifierOfPicture}`] ? states[`price${file.identifierOfPicture}`] : '',
                        description: states[`description${file.identifierOfPicture}`] ? states[`description${file.identifierOfPicture}`] : '',
                        brandName: brand,
                        discount: states[`discount${file.identifierOfPicture}`] ? states[`discount${file.identifierOfPicture}`] : '',
                        status: 'available',
                        url,
                        timestamp,
                        pricetag: 'Não',
                        photoPeriod: 'Nova',
                        bucket: `${Math.floor(Math.random() * (20 - Number.MIN_VALUE))}`, //will be used to fetch random images on front-end
                    });
                    return [url, timestamp, file.identifierOfPicture];
                }
            } catch (error) {
                console.log(error);
                setIsSubmitting(false);
            }
        }),
    );
    try {
        if (brand === 'Bot') {
            let slicedByBrand = [];
            for (let i = 0; i < uploadImages.length; i++) {
                const [url, timestamp, brandName] = uploadImages[i];
                if (slicedByBrand.filter(object => object.brand === brandName).length === 0) {
                    slicedByBrand.push({
                        brand: brandName,
                        images: [[url, timestamp]],
                    });
                } else {
                    slicedByBrand
                        .filter(object => object.brand === brandName)
                        .pop()
                        .images.push([url, timestamp]);
                }
            }
            const uploadBrands = await Promise.all(
                slicedByBrand.map(async ({ brand, images }) => {
                    const [url, timestamp] = getMostRecentImage(images);
                    const [, trends] = brandsAndTrends.filter(([brandName]) => brandName === brand).flat();
                    if (priceTag === 'Sim') {
                        await db.collection('catalog-brands').doc(brand).set(
                            {
                                brand,
                                updatedLoggedThumb: url,
                                updatedAt: timestamp,
                                trends,
                            },
                            { merge: true },
                        );
                    } else {
                        await db.collection('catalog-brands').doc(brand).set(
                            {
                                brand,
                                updatedThumb: url,
                                updatedLoggedThumb: url,
                                updatedAt: timestamp,
                                trends,
                            },
                            { merge: true },
                        );
                    }
                    return 'ok';
                }),
            );
        } else {
            const [url, timestamp] = uploadImages.find(([, , uid]) => uid === thumbPhoto.identifierOfPicture);

            //const [, trends] = brandsAndTrends.filter(([brandName]) => brandName === brand).flat()
            if (priceTag === 'Sim' && url && timestamp) {
                await db.collection('catalog-brands').doc(brand).set(
                    {
                        brand,
                        updatedAt: timestamp,
                        updatedLoggedThumb: url,
                        trends: [],
                    },
                    { merge: true },
                );
            } else if (url && timestamp) {
                await db.collection('catalog-brands').doc(brand).set(
                    {
                        brand,
                        updatedThumb: url,
                        updatedAt: timestamp,
                        updatedLoggedThumb: url,
                        trends: [],
                    },
                    { merge: true },
                );
            }
        }
    } catch (error) {
        console.log(error);
        setIsSubmitting(false);
    }
    setIsSubmitting(false);
    setIsSubmitted(true);
    setBrand('');
    setPictures([]);
    setFiles([]);
    setThumbPhoto('');
    const payload = { userValue: '', identifierOfPicture: '', inputType: 'clear' };
    dispatch(payload);
}

export default sendToBackend;
