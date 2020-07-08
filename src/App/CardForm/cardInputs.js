import React, { useEffect, useMemo } from 'react';
import Form from '@bit/vitorbarbosa19.ziro.form';
import { card } from './styles';

export default ({ index, product, sizes, colors, products, setProducts, filesList, setFiles, update, image, arrayOfInputs, validations }) => {
    if (filesList) {
        useEffect(() => {
            const list = products;
            list[index] = product;
            setProducts(list);
            if (filesList[0] && products[0] && products[index] && filesList[index]) {
                const listForFiles = filesList;
                listForFiles[index].product = products[index];

                setFiles(listForFiles);
            }
        }, [product, sizes, colors, filesList]);
    }

    const _inputs = arrayOfInputs;

    const inputs = useMemo(() => _inputs.filter(input => !!input), _inputs);
    console.log(index, product);

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', boxShadow: card.boxShadow }}>
            {image && image}
            <div style={{ padding: '10px 10px 30px' }}>
                <Form validations={validations} sendToBackend={update || null} inputs={inputs}/>
            </div>
        </div>
    );
};
