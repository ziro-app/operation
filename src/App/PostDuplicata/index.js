import React, {useState, useEffect} from 'react'
import { motion } from 'framer-motion'
import Form from '@bit/vitorbarbosa19.ziro.form'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import currencyFormat from '@ziro/currency-format'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import Error from '@bit/vitorbarbosa19.ziro.error'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import Calendar from '@bit/vitorbarbosa19.ziro.calendar'
import maskInput from '@ziro/mask-input'
import InputText from '@bit/vitorbarbosa19.ziro.input-text'
import SingleImageUpload from '../SingleImageUpload'
import sendToBackend from './sendToBackend'
import fetch from './fetch'

const PostDuplicata = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [duplicate, setDuplicate] = useState('')
    const [codigoBarra, setCodigoBarra] = useState('')
    const [inputDate, setInputDate] = useState('')
    const [focused, setFocused] = useState('')
    const [duplicateValue, setDuplicateValue] = useState('')
    const [provider, setProvider] = useState('')
    const [apelidos, setApelidos] = useState([])
    const [type, setType] = useState('')
    const [isError, setIsError] = useState(false)
    const [fileDuplicate, setFileDuplicate] = useState('')
    const state = {codigoBarra, setCodigoBarra,type, setType, setInputDate, inputDate, duplicateValue, setDuplicateValue, provider, setProvider, setApelidos, apelidos, fileDuplicate, setFileDuplicate, isError, setIsError, duplicate, setDuplicate, isLoading, setIsLoading}
    useEffect(() => fetch(state),[])
    const validations = [
        {
            name: 'provider',
            validation: value => apelidos.includes(value),
            value: provider,
            message: 'Pessoa Inválido'
        },
        {
            name: 'type',
            validation: value => ['parcela1', 'parcela2'].includes(value),
            value: type,
            message: 'Tipo Inválido'
        },
        {
            name: 'duplicateValue',
            validation: value => Number(value),
            value: duplicateValue,
            message: 'Digite apenas números'
        },
        {
            name: 'inputDate',
            validation: value => value.match(/\d{2}[/]\d{2}[/]\d{4}/gm),
            value: inputDate,
            message: 'Data inválida'
        },
        {
            name: 'codigoBarra',
            validation: value => value,
            value: codigoBarra,
            message: 'Código deve ser preenchido'
        },
        {
            name: 'duplicate',
            validation: value => !value ? true : value !== undefined && value !== '' && /(\.pdf|\.jpg|\.jpeg|\.png)$/.test(value.name),
            value: duplicate,
            message: 'Formatos válidos: .png, .jpg e .jpeg'
        }
    ];
    if(isError) return <Error />
    if(isLoading) return <Spinner />
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Form
                validations={validations}
                sendToBackend={sendToBackend ? sendToBackend(state) : () => null}
                inputs={[
                    <FormInput name='provider' label='Pessoa' input={
                        <Dropdown
                            readOnly={false}
                            value={provider}
                            onChange={({ target: { value } }) => setProvider(value)}
                            list={apelidos}
                            placeholder="escolha uma Pessoa"
                            onChangeKeyboard={element =>
                            element ? setProvider(element.value) : null
                            }
                        />
                    } />,
                    <FormInput name='type' label='Tipo' input={
                        <Dropdown
                            readOnly={false}
                            value={type}
                            onChange={({ target: { value } }) => setType(value)}
                            list={['parcela1', 'parcela2']}
                            placeholder="escolha um tipo"
                            onChangeKeyboard={element =>
                            element ? setType(element.value) : null
                            }
                        />
                    } />,
                    <FormInput name='duplicateValue' label='Valor da Duplicata' input={
                        <InputText
                            value={currencyFormat(duplicateValue)}
                            onChange={({ target: { value } }) => {
                                const toInteger = parseInt(value.replace(/[R$\.,]/g, ''), 10)
                                return setDuplicateValue(maskInput(toInteger, '#######', true))
                            }}
                            placeholder='valor da duplicata'
                            inputMode="numeric"
                        />
                    } />,
                    <FormInput name='inputDate' label='Data Vencimento' input={
                        <Calendar
                            inputDate={inputDate}
                            setInputDate={setInputDate}
                            focused={focused}
                            setFocused={setFocused}
                            placeholder="data de vencimento do boleto"
                            readOnly
                        />
                    } />,
                    <FormInput name='codigoBarra' label='Código de Barra' input={
                        <InputText
                            value={codigoBarra}
                            onChange={({ target: { value } }) => setCodigoBarra(value)}
                            placeholder='código de barra'
                        />
                    } />,
                    <FormInput name='duplicate' label='Duplicata' input={
                        <SingleImageUpload
                            setFile={setDuplicate}
                            filename={fileDuplicate || ''}
                            setFilename={setFileDuplicate}
                            indexOfFile={0}
                        />
                    } />,
                ]} 
            />
        </motion.div>
    )
}

export default PostDuplicata