import React, { useState } from 'react'
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import InputText from '@bit/vitorbarbosa19.ziro.input-text'
import InputEdit from '@bit/vitorbarbosa19.ziro.input-edit'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import Modal from '@bit/vitorbarbosa19.ziro.modal'
import Button from '@bit/vitorbarbosa19.ziro.button'
import maskInput from '@ziro/mask-input'
import sendToBackend from './sendToBackend'
import { block, blockTitle, containerTwoColumn, styleModal } from './styles'

const ConsultShipping = () => {
    const [cep, setCep] = useState('')
    const [value, setValue] = useState('')
    const [quantity, setQuantity] = useState('')
    const [type, setType] = useState('')
    const typeList = ['Rolo', 'Caixa', 'Envelope'].sort()
    const [length, setLength] = useState('')
    const [height, setHeight] = useState('')
    const [width, setWidth] = useState('')
    const [weight, setWeight] = useState('')
    const [success, setSuccess] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const setState = { setCep, setValue, setQuantity, setType, setLength, setHeight, setWeight, setSuccess }
    const state = { cep, value, quantity, type, length, height, weight, ...setState }
    const validations = [
        {
            name: 'cep',
            validation: value => /(^\d{5}\-\d{3}$)/.test(value),
            value: cep,
            message: 'CEP inválido'
        }, {
            name: 'value',
            validation: value => !!value,
            value: value,
            message: 'Campo obrigatório'
        }, {
            name: 'quantity',
            validation: value => !!value,
            value: quantity,
            message: 'Campo obrigatório'
        }, {
            name: 'type',
            validation: value => typeList.includes(value),
            value: type,
            message: 'Tipo inválido'
        }, {
            name: 'length',
            validation: value => !!value,
            value: length,
            message: 'Campo obrigatório'
        }, {
            name: 'height',
            validation: value => !!value,
            value: height,
            message: 'Campo obrigatório'
        }, {
            name: 'width',
            validation: value => !!value,
            value: width,
            message: 'Campo obrigatório'
        }, {
            name: 'weight',
            validation: value => !!value,
            value: weight,
            message: 'Campo obrigatório'
        }
    ]
    const mockObject = [
        { empresa: 'FEDEX', valor: '81.98', prazo: '15' },
        { empresa: 'BRASPRESS', valor: '142.08', prazo: '20' },
        { empresa: 'CORREIOS', valor: '151.04', prazo: '10' },
        { empresa: 'FEDEX', valor: '81.98', prazo: '15' },
        { empresa: 'BRASPRESS', valor: '142.08', prazo: '20' },
        { empresa: 'CORREIOS', valor: '151.04', prazo: '10' },
        { empresa: 'FEDEX', valor: '81.98', prazo: '15' },
        { empresa: 'BRASPRESS', valor: '142.08', prazo: '20' },
        { empresa: 'CORREIOS', valor: '151.04', prazo: '10' }
    ]

    return (
        <>
            <Form
                validations={validations}
                sendToBackend={sendToBackend ? sendToBackend(state) : () => null}
                inputs={[
                    <FormInput name='cep' label='CEP' input={
                        <InputText
                            value={cep}
                            onChange={({ target: { value } }) => setCep(maskInput(value, '#####-###', true))}
                            placeholder='CEP Destino'
                        />
                    } />,
                    <FormInput name='value' label='Valor da Nota Fiscal' input={
                        <InputText
                            value={(value)}
                            onChange={({ target: { value } }) => {
                                const toInteger = parseInt(value.replace(/[R$\.,]/g, ''), 10)
                                setValue(maskInput(toInteger, '#######', true))
                            }}
                            placeholder='R$00,00'
                        />
                    } />,
                    <FormInput name='quantity' label='Quantidade' input={
                        <InputText
                            value={quantity}
                            onChange={({ target: { value } }) => setQuantity(maskInput(value, '###', true))}
                            placeholder='Quantidade de pacotes'
                        />
                    } />,
                    <FormInput name='type' label='Tipo' input={
                        <Dropdown
                            value={type}
                            onChange={({ target: { value } }) => setType(value)}
                            onChangeKeyboard={element => {
                                if (element) setType(element.value)
                                else null
                            }
                            }
                            readOnly={true}
                            list={typeList}
                            placeholder="Tipo do pacote"
                        />}
                    />,
                    <FormInput name='length' label='Comprimento' input={
                        <InputText
                            value={length}
                            onChange={({ target: { value } }) => setLength(value)}
                            placeholder='Comprimento em centímetros'
                        />
                    } />,
                    <FormInput name='height' label='Altura' input={
                        <InputText
                            value={height}
                            onChange={({ target: { value } }) => setHeight(value)}
                            placeholder='Altura em centímetros'
                        />
                    } />,
                    <FormInput name='width' label='Largura' input={
                        <InputText
                            value={width}
                            onChange={({ target: { value } }) => setWidth(value)}
                            placeholder='Largura em centímetros'
                        />
                    } />,
                    <FormInput name='weight' label='Peso' input={
                        <InputText
                            value={weight}
                            onChange={({ target: { value } }) => setWeight(value)}
                            placeholder='Peso em quilos'
                        />
                    } />
                ]}
            />
            {success && <div style={{ marginTop: '10px' }} onClick={() => setIsOpen(true)}>
                <Button type="submit" cta="Visualizar Resultado" />
            </div>}
            <Modal isOpen={isOpen} setIsOpen={() => setIsOpen(false)} boxStyle={styleModal}>
                <div style={block}>
                    <label style={blockTitle}>Resultados da Consulta</label>
                    <div style={containerTwoColumn}>
                        {mockObject.map((obj, id) => (
                            <>
                                <InputEdit
                                    name={`Empresa ${id + 1}`}
                                    value={obj.empresa}
                                    onChange={() => { }}
                                    validateInput={() => { }}
                                    submit={() => { }}
                                    setError={() => { }}
                                    error={''}
                                    editable={false}
                                    isLoading={false}
                                />
                                <InputEdit
                                    name="Valor"
                                    value={obj.valor}
                                    onChange={() => { }}
                                    validateInput={() => { }}
                                    submit={() => { }}
                                    setError={() => { }}
                                    error={''}
                                    editable={false}
                                    isLoading={false}
                                />
                                <InputEdit
                                    name="PR"
                                    value={obj.prazo}
                                    onChange={() => { }}
                                    validateInput={() => { }}
                                    submit={() => { }}
                                    setError={() => { }}
                                    error={''}
                                    editable={false}
                                    isLoading={false}
                                />
                            </>
                        ))}
                    </div>
                </div>
            </Modal>
        </>
    )

}

export default ConsultShipping
