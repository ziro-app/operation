import { readAndCompressImage } from 'browser-image-resizer';
import { db, storage } from '../../Firebase/index';
import getMostRecentImage from './getMostRecentImage';

const sendToBackend = async (
    setIsSubmitting,
    setIsSubmitted,
    setBrand,
    brand,
    brandsAndTrends,
    pricetag,
    setPricetag,
    photoPeriod,
    setPhotoPeriod,
    files,
    products,
    setProducts,
    setPictures,
    setFiles,
) => {
    setIsSubmitting(true);
    const uploadImages = await Promise.all(
        files.map(async file => {
            try {
                if (file.size === 0) throw 'Empty sized image';
                const timestamp = Date.now();
                const compressed = await readAndCompressImage(file, { quality: 0.65 });
                if (brand === 'Bot') {
                    const [brandName, index] = file.name.split('-');
                    const image = storage.child(`${brandName}/${brandName}-${timestamp}-${index}`);
                    const uploadTask = await image.put(compressed);
                    const url = await uploadTask.ref.getDownloadURL();
                    await db.collection('catalog-images').add({
                        brandName,
                        url,
                        timestamp,
                        pricetag,
                        photoPeriod,
                        bucket: `${Math.floor(Math.random() * (20 - Number.MIN_VALUE))}`, //will be used to fetch random images on front-end
                    });
                    console.log(url);
                    return [url, timestamp, brandName];
                } else {
                    const image = storage.child(`${brand}/${brand}-${timestamp}-${file.name}`);
                    const uploadTask = await image.put(compressed);
                    const url = await uploadTask.ref.getDownloadURL();
                    await db.collection('catalog-images').add({
                        availableQuantities: file.product.availableQuantities,
                        status: file.product.status,
                        price: file.product.price,
                        description: file.product.description,
                        brandName: brand,
                        url,
                        timestamp,
                        pricetag,
                        photoPeriod,
                        bucket: `${Math.floor(Math.random() * (20 - Number.MIN_VALUE))}`, //will be used to fetch random images on front-end
                    });
                    return [url, timestamp];
                }
            } catch (error) {
                return error;
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
                    if (pricetag === 'Sim') {
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
            const [url, timestamp] = getMostRecentImage(uploadImages);
            const [, trends] = brandsAndTrends.filter(([brandName]) => brandName === brand).flat();
            if (pricetag === 'Sim') {
                await db.collection('catalog-brands').doc(brand).set(
                    {
                        brand,
                        updatedAt: timestamp,
                        updatedLoggedThumb: url,
                        trends,
                    },
                    { merge: true },
                );
            } else {
                await db.collection('catalog-brands').doc(brand).set(
                    {
                        brand,
                        updatedThumb: url,
                        updatedAt: timestamp,
                        updatedLoggedThumb: url,
                        trends,
                    },
                    { merge: true },
                );
            }
        }
    } catch (error) {
        console.log(error);
    }
    setIsSubmitting(false);
    setIsSubmitted(true);
    setBrand('');
    setPricetag('');
    setPhotoPeriod('');
    setProducts([{}]);
    setPictures([]);
    setFiles([]);
};

export default sendToBackend;
