import React, { useState, useContext } from 'react'
import { motion } from 'framer-motion'
import { userContext } from '../appContext'
import sendToBackend from './sendToBackend'
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import InputText from '@bit/vitorbarbosa19.ziro.input-text'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'

const MaterialRequest = () => {
    const { nickname } = useContext(userContext)
    const [category, setCategory] = useState('')
    const categoryList = ['Limpeza/Higiene', 'Escritório', 'Logistica', 'Informática', 'Copa']
    const [requiredItems, setRequiredItems] = useState('')
    const [itemIsOver, setItemIsOver] = useState('')
    const itemIsOverList = ['Sim', 'Não']
    const state = { nickname, category, requiredItems, itemIsOver, setCategory, setRequiredItems, setItemIsOver }
    const validations = [
        {
            name: 'category',
            validation: value => categoryList.includes(value),
            value: category,
            message: 'Categoria inválida'
        }, {
            name: 'requiredItems',
            validation: value => !!value,
            value: requiredItems,
            message: 'Campo obrigatório'
        }, {
            name: 'itemIsOver',
            validation: value => itemIsOverList.includes(value),
            value: itemIsOver,
            message: 'Campo obrigatório'
        }
    ]

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Form
                validations={validations}
                sendToBackend={sendToBackend ? sendToBackend(state) : () => null}
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
                    <FormInput name='requiredItems' label='Itens necessários' input={
                        <InputText
                            value={requiredItems}
                            onChange={({ target: { value } }) => setRequiredItems(value)}
                            placeholder='Itens que deseja, um a um'
                        />
                    } />,
                    <FormInput name='itemIsOver' label='O item já acabou ?' input={
                        <Dropdown
                            value={itemIsOver}
                            readOnly={true}
                            onChange={({ target: { value } }) => setItemIsOver(value)}
                            onChangeKeyboard={element =>
                                element ? setItemIsOver(element.value) : null
                            }
                            list={itemIsOverList}
                            placeholder="Situação do material"
                        />
                    } />
                ]}
            />
        </motion.div>
    )
}

export default MaterialRequest
