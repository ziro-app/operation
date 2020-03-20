import React, { useState, useContext } from 'react'
import { userContext } from '../appContext'
import sendToBackend from './sendToBackend'
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import InputText from '@bit/vitorbarbosa19.ziro.input-text'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'

const InputOutput = () => {
    const { nickname } = useContext(userContext)
    const [category, setCategory] = useState('')
    const categoryList = ['Entrada', 'Saída']
    const [value, setValue] = useState('')
    const [description, setDescription] = useState('')
    const state = { nickname, category, value, description, setCategory, setValue, setDescription }
    const validations = [
        {
            name: 'category',
            validation: value => categoryList.includes(value),
            value: category,
            message: 'Categoria inválida'
        }, {
            name: 'description',
            validation: value => !!value,
            value: description,
            message: 'Campo obrigatório'
        }, {
            name: 'value',
            validation: value => (/[0-9]+/g).test(value),
            value: value,
            message: 'Valor obrigatório'
        }
    ]

    return (
        <>
            <Form
                validations={validations}
                sendToBackend={sendToBackend? sendToBackend(state) : () => null}
                inputs={[
                    <FormInput name='category' label='Categoria' input={
                        <Dropdown
                            value={category}
                            readOnly={true}
                            onChange={({ target: { value } }) => setCategory(value)}
                            onChangeKeyboard={element =>
                                element ? setCategory(element.value) : null
                            }
                            list={categoryList.sort()}
                            placeholder="Categoria do material"
                        />
                    } />,
                    <FormInput name='value' label='Valor' input={
                        <InputText
                            value={value}
                            onChange={({ target: { value } }) => setValue(value)}
                            placeholder='Use . para os centavos'
                        />
                    } />,
                    <FormInput name='description' label='Descrição' input={
                        <InputText
                            value={description}
                            onChange={({ target: { value } }) => setDescription(value)}
                            placeholder='Descrição da movimentação'
                        />
                    } />
                ]}
            />
        </>
    )
}

export default InputOutput
