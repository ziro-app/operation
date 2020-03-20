import React, { useState, useEffect } from 'react'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner'
import Error from '@bit/vitorbarbosa19.ziro.error'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import Calendar from '@bit/vitorbarbosa19.ziro.calendar'
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import InputText from '@bit/vitorbarbosa19.ziro.input-text'
import maskInput from '@ziro/mask-input'
import fetch from './fetch'
import sendToBackend from './sendToBackend'

const RegisterBillet = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [billet, setBillet] = useState('')
    const [billets, setBillets] = useState([])
    const [searchedName, setSearchedName] = useState('')
    const [saleDate, setSaleDate] = useState('')
    const [focusSale, setFocusSale] = useState(false)
    const [provider, setProvider] = useState({'nome': '', 'comissao': '', 'endereco': '' })
    const [providers, setProviders] = useState([])
    const [addresses, setAddresses] = useState([])
    const [storeowner, setStoreowner] = useState('')
    const [storeowners, setStoreowners] = useState([])
    const [billetValue, setBilletValue] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('')
    const paymentMethodList = ['Link', 'Boleto', 'Cheque', 'Crédito', 'Débito', 'Depósito', 'Dinheiro'].sort()
    const [romaneio, setRomaneio] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [focusDue, setFocusDue] = useState(false)
    const [revenue, setRevenue] = useState('')
    const [advisor, setAdvisor] = useState('')
    const [advisors, setAdvisors] = useState([])
    const [type, setType] = useState('')
    const typeList = ['Online', 'Offline'].sort()

    const setState = { setSearchedName, setBillet, setSaleDate, setProvider, setStoreowner, setBilletValue, setPaymentMethod, setRomaneio, setDueDate, setRevenue, setAdvisor, setType }
    const state = { billet, saleDate, provider, storeowner, billetValue, paymentMethod, romaneio, dueDate, revenue, advisor, type, ...setState }
    const validations = [
        {
            name: 'billet',
            validation: value => (/\d/g).test(value) && value.length === 5 && !billets.includes(value),
            value: billet,
            message: 'Boleto inválido ou duplicado'
        }, {
            name: 'saleDate',
            validation: value => /^(?:(?:31(\/)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/.test(value),
            value: saleDate,
            message: 'Data inválida'
        }, {
            name: 'provider',
            validation: value => providers.find(provider => provider.nome === value),
            value: provider.nome,
            message: 'Fornecedor(a) inválido(a)'
        }, {
            name: 'address',
            validation: value => provider.nome? Object.values(addresses.find(address => Object.keys(address)[0] === provider.nome))[0].includes(value) : false,
            value: provider.endereco,
            message: 'Endereço inválido'
        }, {
            name: 'storeowner',
            validation: value => storeowners.includes(value),
            value: storeowner,
            message: 'Lojista inválido(a)'
        }, {
            name: 'value',
            validation: value => (/[0-9]+/g).test(value),
            value: billetValue,
            message: 'Valor inválido'
        }, {
            name: 'paymentMethod',
            validation: value => paymentMethodList.includes(value),
            value: paymentMethod,
            message: 'Meio de pagamento inválido'
        }, {
            name: 'romaneio',
            validation: value => value === '' || (/\d/g).test(value),
            value: romaneio,
            message: 'Romaneio inválido'
        }, {
            name: 'dueDate',
            validation: value => !!value,
            value: dueDate,
            message: 'Data inválida'
        }, {
            name: 'advisor',
            validation: value => advisors.includes(value),
            value: advisor,
            message: 'Assessor(a) inválido(a)'
        }, {
            name: 'type',
            validation: value => typeList.includes(value),
            value: type,
            message: 'Tipo inválido'
        }
    ]
    const round = (num, places) => {
        if (!("" + num).includes("e")) {
            return +(Math.round(num + "e+" + places)  + "e-" + places);
        } else {
            let arr = ("" + num).split("e");
            let sig = ""
            if (+arr[1] + places > 0) {
                sig = "+";
            }
            return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + places)) + "e-" + places);
        }
    }

    const calculateRevenue = (value, comissao) => {
        if(value && comissao){
            let percent = parseFloat(comissao.replace('%', ''))/100
            let val = round((parseFloat(value) * percent), 2)
            setRevenue((val).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' }))
        }
    }

    useEffect(() => fetch(setIsLoading, setIsError, setProviders, setStoreowners, setAdvisors, setAddresses, setBillets), [])

    if (isLoading) return <div style={{ display: 'grid' }}><Spinner size='5rem' /></div>
    if (isError) return <Error />

    return (
        <>
            <Form
                validations={validations}
                sendToBackend={sendToBackend? sendToBackend(state) : () => null}
                inputs={[
                    <FormInput name='billet' label='Boleto' input={
                        <InputText
                            value={billet}
                            onChange={({ target: { value } }) => setBillet(maskInput(value, '#####', true))}
                            placeholder='Nº do boleto'
                        />
                    } />,
                    <FormInput name='saleDate' label='Data da Venda' input={
                        <Calendar
                            inputDate={saleDate}
                            setInputDate={setSaleDate}
                            focused={focusSale}
                            setFocused={setFocusSale}
                            placeholder={'01/01/2020'}
                            outsideRange={true}
                            before={false}
                            callback={() => setDueDate('')}
                        />
                    } />,
                    <FormInput name='provider' label='Fornecedor(a)' input={
                        <Dropdown
                            value={searchedName}
                            onChange={({ target: { value } }) => {
                                if (value !== '') {
                                    let person = providers.find(element => element.nome === value)
                                    if (person) setProvider(person)
                                    setSearchedName(value)
                                    calculateRevenue(billetValue, person? person.comissao : '' )
                                } else {
                                    setSearchedName('')
                                    setProvider({'nome': '', 'comissao': '', 'endereco': '' })
                                    setRevenue('')
                                }
                            }}
                            onChangeKeyboard={element =>{
                                if (element.value !== '') {
                                    let person = providers.find(provider => provider.nome === element.value)
                                    if (person) setProvider(person)
                                    setSearchedName(element.value)
                                    calculateRevenue(billetValue, person? person.comissao : '')
                                } else {
                                    setSearchedName('')
                                    setProvider({'nome': '', 'comissao': '', 'endereco': '' })
                                    setRevenue('')
                                }
                            }
                            }
                            list={providers.map(provider => provider.nome)}
                            placeholder="Nome do(a) fornecedor(a)"
                        />
                    } />,
                    <FormInput name='address' label='Endereço' input={
                        <Dropdown
                            value={provider.endereco}
                            onChange={({ target: { value } }) => {
                                if (value !== '')
                                    setProvider({...provider, endereco: value})
                                else
                                    setProvider({...provider, endereco: ''})
                            }}
                            onChangeKeyboard={element =>{
                                if (element.value !== '')
                                    setProvider({...provider, endereco: value})
                                else
                                    setProvider({...provider, endereco: ''})
                            }}
                            list={provider.nome? Object.values(addresses.find(address => Object.keys(address)[0] === provider.nome))[0] : []}
                            placeholder="Brás — Casemiro de Abreu, 800"
                        />
                    } />,
                    <FormInput name='storeowner' label='Lojista' input={
                        <Dropdown
                            value={storeowner}
                            onChange={({ target: { value } }) => setStoreowner(value)}
                            onChangeKeyboard={element =>
                                element ? setStoreowner(element.value) : null
                            }
                            list={storeowners}
                            placeholder="Nome do(a) lojista"
                        />
                    } />,
                    <FormInput name='value' label='Valor' input={
                        <InputText
                            value={billetValue}
                            onChange={({ target: { value } }) => {
                                setBilletValue(value)
                                calculateRevenue(value, provider.comissao)
                            }}
                            placeholder='Use . para os centavos'
                        />
                    } />,
                    <FormInput name='paymentMethod' label='Forma de Pagamento' input={
                        <Dropdown
                            value={paymentMethod}
                            onChange={({ target: { value } }) => setPaymentMethod(value)}
                            onChangeKeyboard={element =>
                                element ? setPaymentMethod(element.value) : null
                            }
                            list={paymentMethodList}
                            placeholder="Meio de pagamento"
                        />
                    } />,
                    <FormInput name='romaneio' label='Romaneio' input={
                        <InputText
                            value={romaneio}
                            onChange={({ target: { value } }) => setRomaneio(value)}
                            placeholder='Nº do romaneio'
                        />
                    } />,
                    <FormInput name='dueDate' label='Data de Vencimento' input={
                        <Calendar
                            inputDate={dueDate}
                            setInputDate={setDueDate}
                            focused={focusDue}
                            setFocused={setFocusDue}
                            placeholder={'01/01/2020'}
                            outsideRange={true}
                            before={true}
                            choosedDate={saleDate}
                        />
                    } />,
                    <FormInput name='percentage' label='Porcentagem' input={
                        <InputText
                            value={provider.comissao}
                            onChange={() => {}}
                            readOnly={true}
                            placeholder='0.00 %'
                        />
                    } />,
                    <FormInput name='revenue' label='Receita' input={
                        <InputText
                            value={revenue}
                            onChange={() => {}}
                            readOnly={true}
                            placeholder='R$ 0.00'
                        />
                    } />,
                    <FormInput name='advisor' label='Assessor(a)' input={
						<Dropdown
							value={advisor}
							onChange={({ target: { value } }) => setAdvisor(value)}
							onChangeKeyboard={element =>
								element ? setAdvisor(element.value) : null
							}
							list={advisors}
							placeholder="Nome do(a) assessor(a)"
						/>
                    } />,
                    <FormInput name='type' label='Tipo' input={
						<Dropdown
							value={type}
							onChange={({ target: { value } }) => setType(value)}
							onChangeKeyboard={element =>
								element ? setType(element.value) : null
							}
							list={typeList}
							placeholder="Tipo da compra"
							readOnly={true}
						/>
					} />
                ]}
            />
        </>
    )
}

export default RegisterBillet
