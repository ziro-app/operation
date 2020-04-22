import React, { useMemo } from 'react'
import currencyFormat from '@ziro/currency-format'
import maskInput from '@ziro/mask-input'
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import InputText from '@bit/vitorbarbosa19.ziro.input-text'
import DropDown from '@bit/vitorbarbosa19.ziro.dropdown'
import { card } from './styles'
import parsePrice from './parsePrice'

const PTstatus = {
    'available': 'Disponível',
    'unavailable': 'Indisponível',
    'closed': 'Disponível',
    'waitingInfo': ''
}

const INstatus = {
    'Disponível': 'available',
    'Indisponível': 'unavailable'
}

export default ({ image, setValue, setQuantity, update, product }) => {

    const inputs = useMemo(() => 
        ([
            <FormInput
                name='availability'
                label='Disponibilidade'
                input={
                    <DropDown
                        list={['Disponível','Indisponível']}
                        value={PTstatus[product.status]||''}
                        onChange={({ target: { value } }) => setValue('status',INstatus[value]||'waitingInfo',product.productId)}
                        onChangeKeyboard={element => element ? setValue('status',INstatus[element.value]||'waitingInfo',product.productId) : null}
                        placeholder='Está disponível em estoque?'
                    />
                }
            />,
            ...(product.status !== 'available' && product.status !== 'closed' ? []:[
                <FormInput
                    name='price'
                    label='Preço'
                    input={
                        <InputText
                            // onChange={({ target: { value }}) => parsePrice(value,setValue,product.productId)}
                            value={currencyFormat(product.price || '')}
                            onChange={({ target: { value } }) => {
                                const toInteger = parseInt(value.replace(/[R$\.,]/g, ''), 10)
                                setValue('price',maskInput(toInteger, '#######', true),product.productId)
                            }}
                            placeholder='R$ 100,00'
                            inputMode='numeric'
                        />
                    }
                />,
                <FormInput
                    name='sizes'
                    label='Tamanhos'
                    input={
                        <InputText
                            placeholder='P,M,G'
                            value={product.sizes && product.sizes.join(',')||''}
                            onChange={({ target: { value }}) => setValue('sizes', value ? value.split(',') : '', product.productId)}
                        />
                    }
                />,
                <FormInput
                    name='colors'
                    label='Cores'
                    input={
                        <InputText
                            placeholder='Azul,Amarelo'
                            value={product.colors && product.colors.join(',')||''}
                            onChange={({ target: { value }}) => setValue('colors', value ? value.split(',') : '', product.productId)}
                        />
                    }
                />,
                <FormInput
                    name='quantities'
                    label='Quantidades'
                    input={
                        product.sizes ?
                            <div style={{ display: 'grid', gridGap: '10px', padding: '10px' }}>
                                {
                                    product.sizes.map((size) =>
                                    (product.colors||['']).map((color) => 
                                        <div key={`${size}-${color}`} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 2fr', alignItems: 'center' }}>
                                            <label>{size}</label>
                                            <label>{color}</label>
                                            <InputText
                                                placeholder='1'
                                                value={(product.availableQuantities&&product.availableQuantities[`${size}-${color}`])||''}
                                                onChange={({ target: { value }}) => /^[0-9]*$/gm.test(value)&&setQuantity(size,color,value,product.productId)}
                                            />
                                        </div>
                                    ))
                                }
                            </div>
                            :
                            <InputText
                                placeholder='1'
                                value={product.availableQuantities||''}
                                onChange={({ target: { value } }) => /^[0-9]*$/gm.test(value)&&setQuantity(undefined,undefined,value,product.productId)}
                            />
                    }
                />
            ])
        ]),[product])

        const validations = useMemo(() => [
            {
                name: 'availability',
                validation: value => value !== 'waitingInfo',
                value: product.status,
                message: 'Campo obrigatório'
            },
            ...(product.status !== 'available' ? []:[
                {
                    name: 'price',
                    validation: value => !!value,
                    value: product.price,
                    message: 'Campo obrigatório'
                },
                {
                    name: 'quantities',
                    validation: value => !!value,
                    value: product.availableQuantities,
                    message: 'Campo obrigatório'
                }
            ])
        ],[product])

        return (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', boxShadow: card.boxShadow }}>
                {image}
                <div style={{ padding: '10px 10px 30px' }}>
                    <Form
                        buttonName='Atualizar'
                        validations={validations}
                        sendToBackend={() => update(product.productId)}
                        inputs={inputs}
                    />
                </div>
            </div>
        )

}