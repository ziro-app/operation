import React, {useState, useEffect} from 'react'
import { motion } from 'framer-motion';
// Components Ziro
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import InputText from '@bit/vitorbarbosa19.ziro.input-text'
import Calendar from '@bit/vitorbarbosa19.ziro.calendar'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner-with-div'
// Internal Components
import SingleImageUpload from '../SingleImageUpload/index'
import fetch from './fetch'
import sendToBackend from './sendToBackend'
import removeDuplicates from './utils/removeDuplicates'
import arrayAdresses from './utils/arrayAdresses'

const Pickup = () => {
    const [codPickup, setCodPickup] = useState('')
    const [inputDate, setInputDate] = useState('')
    const [focused, setFocused] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [provider, setProvider] = useState('')
    const [providers, setProviders] = useState('')
    const [adress, setAdress] = useState('')
    const [bags, setBags] = useState('')
    const [invoice, setInvoice] = useState('')
    const [romaneio, setRomaneio] = useState('')
    const [filename, setFilename] = useState('')
    const [observation, setObservation] = useState('')
    const [data, setData] = useState('')
    const [reseller, setReseller] = useState('')
    const [adresses, setAdresses] = useState(['Outro'])
    const state = {provider,setInputDate,setCodPickup,setProvider,setAdress,setBags,setInvoice,setRomaneio,setFilename,setObservation,setReseller,setAdresses,reseller, adresses, codPickup, inputDate, provider, adress,bags, invoice, romaneio, filename, observation, setIsLoading, setData, setProviders}
    useEffect(() => fetch(state),[])
    useEffect(() => {
        const codes = data ? data.filter(row => row[10] !== 'Entregue' && row[10] !== 'Cancelado' && row[11] === codPickup) : null
        if(codes && codes[0]){
            setReseller(codes[0][0])
        }else{
            setReseller('')
        }
    },[codPickup])
    useEffect(() => {
        const arrayProvider = data && providers.includes(provider) ? data.filter(row => row[12] === provider).flat() : []
        if(arrayProvider[0]){
            const arraySeparationAdresses = arrayProvider[0] ? arrayProvider.filter((item, index) => {
                return index >= 14
            }) : []
            setAdresses(arrayAdresses(arraySeparationAdresses)[0] ? [...removeDuplicates(arrayAdresses(arraySeparationAdresses)), ...adresses] : adresses)
        }else if(provider === 'Pertence do cliente'){
                setAdresses(['Ziro', 'Outro'])
            }else{
                setAdresses(['Outro'])
            }
    },[provider])
    const validations = [
        {
            name: 'codPickup',
            validation: value => value.match(/[R][L]\d{5}/gm) && reseller,
            value: codPickup,
            message: 'Código Inválido'
        },
        {
            name: 'inputDate',
            validation: value => value.match(/\d{2}[/]\d{2}[/]\d{4}/gm),
            value: inputDate,
            message: 'Data Inválida'
        },
        {
            name: 'provider',
            validation: value => providers.includes(value),
            value: provider,
            message: 'Fornecedor Inválido'
        },
        {
            name: 'adress',
            validation: value => adresses.includes(value),
            value: adress,
            message: 'Endereço Inválido'
        },
        {
            name: 'bags',
            validation: value => ['1','2','3','4'].includes(value),
            value: bags,
            message: 'Quantidade Inválida'
        },
        {
            name: 'invoice',
            validation: value => ['Sim', 'Não'].includes(value),
            value: invoice,
            message: 'Resposta inválida'
        },
        {
            name: 'observation',
            validation: value => true,
            value: observation,
            message: 'Resposta inválida'
        },
        {
            name: 'romaneio',
            validation: value => !value ? true : value !== undefined && value !== '' && /(\.jpg|\.jpeg|\.png)$/.test(value.name),
            value: romaneio,
            message: 'Formatos válidos: .png, .jpg e .jpeg'
        }
    ];
    if(isLoading) return <Spinner />
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'grid', gridTemplateRows: '1fr auto', gridRowGap: '10px' }}>
            <h2>Lojista: {reseller || 'Nenhum'}</h2>
            <Form
                validations={validations}
                sendToBackend={sendToBackend ? sendToBackend(state) : () => null}
                inputs={[
                    <FormInput name='codPickup' label='Código Retirada' input={
                        <InputText
                            value={codPickup}
                            onChange={({ target: { value } }) => setCodPickup(value)}
                            placeholder='Código Retirada'
                        />
                    } />,
                    <FormInput name='inputDate' label='Data Retirada' input={
                        <Calendar
                            inputDate={inputDate}
                            setInputDate={setInputDate}
                            focused={focused}
                            setFocused={setFocused}
                            placeholder="Data Retirada"
                            readOnly
                        />
                    } />,
                    <FormInput name='provider' label='Fornecedor' input={
                        <Dropdown
                            readOnly={false}
                            value={provider}
                            onChange={({ target: { value } }) => setProvider(value)}
                            list={providers}
                            placeholder="Escolha um fornecedor"
                            onChangeKeyboard={element =>
                            element ? setProvider(element.value) : null
                            }
                        />
                    } />,
                    <FormInput name='adress' label='Endereço' input={
                        <Dropdown
                            readOnly={false}
                            value={adress}
                            onChange={({ target: { value } }) => setAdress(value)}
                            list={adresses}
                            placeholder="Escolha um endereço"
                            onChangeKeyboard={element =>
                            element ? setAdress(element.value) : null
                            }
                        />
                    } />,
                    <FormInput name='bags' label='Sacolas' input={
                        <Dropdown
                            readOnly={false}
                            value={bags}
                            onChange={({ target: { value } }) => setBags(value)}
                            list={["1","2","3","4"]}
                            placeholder="Escolha a quantidade de sacolas"
                            onChangeKeyboard={element =>
                            element ? setBags(element.value) : null
                            }
                        />
                    } />,
                    <FormInput name='invoice' label='Nota fiscal' input={
                        <Dropdown
                            readOnly={false}
                            value={invoice}
                            onChange={({ target: { value } }) => setInvoice(value)}
                            list={["Sim","Não"]}
                            placeholder="Retirar nota fiscal?"
                            onChangeKeyboard={element =>
                            element ? setInvoice(element.value) : null
                            }
                        />
                    } />,
                    <FormInput name='romaneio' label='Foto do Romaneio' input={
                        <SingleImageUpload
                            setFile={setRomaneio}
                            filename={filename || ''}
                            setFilename={setFilename}
                            indexOfFile={0}
                        />
                    } />,
                    <FormInput name='observation' label='Obrservações' input={
                        <InputText
                            value={observation}
                            onChange={({ target: { value } }) => setObservation(value)}
                            placeholder='observações'
                        />
                    } />,
                ]}
            />
        </motion.div>
    )
}

export default Pickup