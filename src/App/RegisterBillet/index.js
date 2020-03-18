import React, { useState, useEffect } from 'react'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner'
import Error from '@bit/vitorbarbosa19.ziro.error'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import Calendar from '@bit/vitorbarbosa19.ziro.calendar'
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import InputText from '@bit/vitorbarbosa19.ziro.input-text'
import maskInput from '@ziro/mask-input'

// Olhar os fetch agr para continuar
// 1º id -> 1mfco3sSUcV__ziYqnc0wXCRODelBouxEiPv_hAD0zIw
// End -> Polo - Endereço
// 2º lojistas Base
// 3º Pegar os assessores da planilha Pessoas
const RegisterBillet = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)

    const [billet, setBillet] = useState('')
    const [saleDate, setSaleDate] = useState('')
    const [focusSale, setFocusSale] = useState(false)
    const [provider, setProvider] = useState('')
    const [providers, setProviders] = useState([])
    const [address, setAddress] = useState('')
    const [addresses, setAddresses] = useState([])
    const [storeowner, setStoreowner] = useState({ 'cadastro': '', 'afiliado': '', 'afiliado_cpf': '', 'lojista': '', 'rg': '', 'cpf': '', 'nascimento': '', 'insta': '', 'cnpj': '', 'ie': '', 'razao': '', 'fantasia': '', 'endereco': '', 'bairro': '', 'cep': '', 'cidade': '', 'estado': '', 'fone': '', 'email': '', 'assessor': '', 'vendedor': '' })
    const [storeowners, setStoreowners] = useState([])
    const [value, setValue] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('')
    const paymentMethodList = ['Link', 'Boleto', 'Cheque', 'Crédito', 'Débito', 'Depósito', 'Dinheiro']
    const [romaneio, setRomaneio] = useState('') // Só números, sem quantidade min/max e pode ser vazio
    const [dueDate, setDueDate] = useState('')
    const [focusDue, setFocusDue] = useState(false)
    /* Campos apenas visuais */
    const [percentage, setPercentage] = useState('')
    const [revenue, setRevenue] = useState('')

    const [advisor, setAdvisor] = useState('')
    const [advisors, setAdvisors] = useState([])
    const [type, setType] = useState('')
    const typeList = ['Online', 'Offline']

    const setState = { setBillet, setSaleDate, setProvider, setAddress, setAddresses, setStoreowner, setStoreowners, setValue, setPaymentMethod, setRomaneio, setDueDate, setPercentage, setRevenue, setAdvisor, setType }
    const state = { billet, saleDate, provider, address, storeowner, value, paymentMethod, romaneio, dueDate, percentage, revenue, advisor, type, ...setState }
    const validations = [
        {
            name: 'billet',
            validation: value => (/\d/g).test(value) && value.lenght === 5,
            value: billet,
            message: 'Boleto inválido'
        }, {
            name: 'saleDate',
            validation: value => /^(?:(?:31(\/)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/.test(value),
            value: saleDate,
            message: 'Data inválida'
        }, {
            name: 'provider',
            validation: value => providers.includes(value),
            value: provider,
            message: 'Fornecedor inválido'
        }, {
            name: 'address',
            validation: value => !!value,
            value: address,
            message: 'Preencha esse campo'
        }, {
            name: 'storeowner',
            validation: value => storeowners.includes(value),
            value: storeowner,
            message: 'Lojista inválido(a)'
        }, {
            name: 'value',
            validation: value => !!value,
            value: value,
            message: 'Preencha esse campo'
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
            name: 'quantity',
            validation: value => value !== '' || (/\d/g).test(value),
            value: quantity,
            message: 'Quantidade inválida'
        }, {
            name: 'advisor',
            validation: value => advisors.includes(value),
            value: advisor,
            message: 'Assessor(a) inválido(a)'
        }
    ]

    //useEffect(() => fetch(setIsLoading, setIsError, setStoreowners, setAdvisors, setAffiliates, setSellers), [])

    if (isLoading) return <div style={{ display: 'grid' }}><Spinner size='5rem' /></div>
    if (isError) return <Error />

    return (
        <>
            <Form
                validations={validations}
                sendToBackend={() => null}
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
                            value={provider}
                            onChange={({ target: { value } }) => setProvider(value)}
                            onChangeKeyboard={element =>
                                element ? setProvider(element.value) : null
                            }
                            list={providers}
                            placeholder="Nome do(a) fornecedor(a)"
                        />
                    } />,
                    <FormInput name='address' label='Endereço' input={
                        <InputText
                            value={address}
                            onChange={({ target: { value } }) => setBirthDate(maskInput(value, '##/##/####', true))}
                            placeholder='Rua, Nº, Bairro'
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
                            value={value}
                            onChange={({ target: { value } }) => setValue(value)}
                            placeholder='Valor do boleto'
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
                            value={percentage}
                            onChange={() => {}}
                            readOnly={true}
                            placeholder='% 0.00'
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
							readOnly={true}
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
