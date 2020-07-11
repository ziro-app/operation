import React, { useMemo } from 'react';
import Form from '@bit/vitorbarbosa19.ziro.form';
import { card } from './styles';

export default ({ update, image, arrayOfInputs, validations }) => {
    const _inputs = arrayOfInputs;

    const inputs = useMemo(() => _inputs.filter(input => !!input), _inputs);

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', boxShadow: card.boxShadow }}>
            {image && image}
            <div style={{ padding: '10px 10px 30px' }}>
                <Form validations={validations} sendToBackend={update || null} inputs={inputs}/>
            </div>
        </div>
    );
};
