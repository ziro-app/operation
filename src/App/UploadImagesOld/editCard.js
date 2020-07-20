import React, { useEffect, useMemo } from 'react';
import Form from '@bit/vitorbarbosa19.ziro.form';
import { card } from './styles';

export default ({
                    index,
                    product,
                    setProduct,
                    sizes,
                    setSizes,
                    colors,
                    setColors,
                    products,
                    setProducts,
                    filesList,
                    setFiles,
                    update,
                    image,
                    arrayOfInputs,
                }) => {
    if (filesList) {
        useEffect(() => {
            const list = products;
            list[index] = product;
            setProducts(list);
            if (filesList[0] && products[0] && products[index] && filesList[index]) {
                const listForFiles = filesList;
                listForFiles[index].product = products[index];

                console.log(products[index]);
                setFiles(listForFiles);
                console.log(filesList);
            }
        }, [product, sizes, colors, filesList]);
    }

    const _inputs = arrayOfInputs;
    /* const selectedInputs = [];
      //console.log(arrayOfInputs);
      useEffect(() => {
        arrayOfInputs.map(input => {
          //console.log('product', product);
          if (input === 'availability') setProduct({ status: 'available' });
          //console.log('product', product);
          //console.log(_inputs);
          index = _inputs.findIndex(x => x !== 0 && x.props.name === input);
          // console.log(index);
          // console.log(_inputs);
          if (index !== -1) {
            // console.log('teste');
            selectedInputs.push(_inputs[index]);
            //console.log(selectedInputs);
          }
          // console.log(_inputs);
        });
        //_inputs = selectedInputs;
        setSelectedInput(selectedInputs);
        console.log(_inputs);
      }, []);*/

    // index = a.findIndex(x => x.prop2 ==="yutu");  arrayOfInputs

    const inputs = useMemo(() => _inputs.filter(input => !!input), _inputs);

    const validations = useMemo(
        () => [
            {
                name: 'availability',
                validation: value => value !== 'waitingInfo',
                value: product.status,
                message: 'Campo obrigatório',
            },
            ...(product.status !== 'available'
                ? []
                : [
                    {
                        name: 'price',
                        validation: ([price, totalQty]) => (totalQty > 0 ? !!price : true),
                        value: [product.price, Object.values(product.availableQuantities || {}).reduce((acc, prev) => acc + parseInt(prev), 0)],
                        message: 'Campo obrigatório',
                    },
                ]),
        ],
        [product],
    );
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', boxShadow: card.boxShadow }}>
            {image && image}
            <div style={{ padding: '10px 10px 30px' }}>
                <Form validations={validations} sendToBackend={update || null} inputs={inputs}/>
            </div>
        </div>
    );
};
