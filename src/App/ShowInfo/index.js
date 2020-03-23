import React, { useState, useEffect } from 'react'
import InputEdit from '@bit/vitorbarbosa19.ziro.input-edit'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner'
import Error from '@bit/vitorbarbosa19.ziro.error'
import Logo from '@bit/vitorbarbosa19.ziro.logo'
import SocialMedia from '@bit/vitorbarbosa19.ziro.social-media'
import { containerWithPadding } from '@ziro/theme'
import fetch from './fetch'
import { container, name, containerOneColumn, containerTwoColumn } from './styles'

const ShowInfo = ({ internal = false }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [storeowner, setStoreowner] = useState({ 'cadastro': '', 'afiliado': '', 'afiliado_cpf': '', 'lojista': '', 'rg': '', 'cpf': '', 'nascimento': '', 'insta': '', 'cnpj': '', 'ie': '', 'razao': '', 'fantasia': '', 'endereco': '', 'bairro': '', 'cep': '', 'cidade': '', 'estado': '', 'fone': '', 'email': '', 'assessor': '', 'vendedor': '', 'whats': '', 'entrega': '', 'bairroEntrega': '', 'cepEntrega': '', 'cidadeEntrega': '', 'estadoEntrega': '' })

    useEffect(() => fetch(setIsLoading, setIsError, setStoreowner, new URLSearchParams(window.location.search).get('doc')), [])

    if (isLoading) return <div style={{ display: 'grid' }}><Spinner size='5rem' /></div>
    if (isError) return <Error />

    return (
        <div style={containerWithPadding}>
            <div style={container}>
                <Logo />
                <label style={name}>Ziro Negócios Digitais Ltda</label>
                <label>28.026.371/0001-61</label>
                <label>R. Lubavitch, 71, Bom Retiro</label>
                <label>01123-110, São Paulo - SP</label>
                <SocialMedia />
            </div>
            <div style={containerOneColumn} >
                <InputEdit
                        name="Nome"
                        value={storeowner.lojista? storeowner.lojista : ''}
                        onChange={() => {}}
                        validateInput={() => {}}
                        submit={() => { }}
                        setError={() => { }}
                        error={''}
                        editable={false}
                        isLoading={false}
                />
            </div>
            <div style={containerTwoColumn} >
                <InputEdit
                    name="RG"
                    value={storeowner.rg? storeowner.rg : ''}
                    onChange={() => {}}
                    validateInput={() => {}}
                    submit={() => { }}
                    setError={() => { }}
                    error={''}
                    editable={false}
                    isLoading={false}
                />
                <InputEdit
                    name="CPF"
                    value={storeowner.cpf ? storeowner.cpf : ''}
                    onChange={() => {}}
                    validateInput={() => {}}
                    submit={() => { }}
                    setError={() => { }}
                    error={''}
                    editable={false}
                    isLoading={false}
                />
                <InputEdit
                    name="Nascimento"
                    value={storeowner.nascimento? storeowner.nascimento : ''}
                    onChange={() => {}}
                    validateInput={() => {}}
                    submit={() => { }}
                    setError={() => { }}
                    error={''}
                    editable={false}
                    isLoading={false}
                />
                <InputEdit
                    name="Whatsapp"
                    value={storeowner.whats? storeowner.whats : ''}
                    onChange={() => {}}
                    validateInput={() => {}}
                    submit={() => { }}
                    setError={() => { }}
                    error={''}
                    editable={false}
                    isLoading={false}
                />
            </div>
            <div style={containerOneColumn} >
                <InputEdit
                    name="Razão Social"
                    value={storeowner.razao? storeowner.razao : ''}
                    onChange={() => { }}
                    validateInput={() => { }}
                    submit={() => { }}
                    setError={() => { }}
                    error={''}
                    editable={false}
                    isLoading={false}
                />
                <InputEdit
                    name="Email"
                    value={storeowner.email? storeowner.email : ''}
                    onChange={() => { }}
                    validateInput={() => { }}
                    submit={() => { }}
                    setError={() => { }}
                    error={''}
                    editable={false}
                    isLoading={false}
                />
            </div>
            <div style={containerTwoColumn} >
                <InputEdit
                    name="CNPJ"
                    value={storeowner.cnpj? storeowner.cnpj : ''}
                    onChange={() => { }}
                    validateInput={() => { }}
                    submit={() => { }}
                    setError={() => { }}
                    error={''}
                    editable={false}
                    isLoading={false}
                />
                <InputEdit
                    name="Nome Fantasia"
                    value={storeowner.fantasia? storeowner.fantasia : ''}
                    onChange={() => { }}
                    validateInput={() => { }}
                    submit={() => { }}
                    setError={() => { }}
                    error={''}
                    editable={false}
                    isLoading={false}
                />
                <InputEdit
                    name="Instagram"
                    value={storeowner.insta? storeowner.insta : ''}
                    onChange={() => {}}
                    validateInput={() => {}}
                    submit={() => { }}
                    setError={() => { }}
                    error={''}
                    editable={false}
                    isLoading={false}
                />
                <InputEdit
                    name="Telefone"
                    value={storeowner.fone? storeowner.fone : ''}
                    onChange={() => {}}
                    validateInput={() => {}}
                    submit={() => { }}
                    setError={() => { }}
                    error={''}
                    editable={false}
                    isLoading={false}
                />
                <InputEdit
                    name="IE"
                    value={storeowner.ie? storeowner.ie : ''}
                    onChange={() => {}}
                    validateInput={() => {}}
                    submit={() => { }}
                    setError={() => { }}
                    error={''}
                    editable={false}
                    isLoading={false}
                />
                {internal && <InputEdit
                    name="Assessor(a)"
                    value={storeowner.assessor? storeowner.assessor: ''}
                    onChange={() => { }}
                    validateInput={() => { }}
                    submit={() => { }}
                    setError={() => { }}
                    error={''}
                    editable={false}
                    isLoading={false}
                />}
                {internal && <InputEdit
                    name="Afiliado(a)"
                    value={storeowner.afiliado? storeowner.afiliado: ''}
                    onChange={() => { }}
                    validateInput={() => { }}
                    submit={() => { }}
                    setError={() => { }}
                    error={''}
                    editable={false}
                    isLoading={false}
                />}
                {internal && <InputEdit
                    name="Vendedor(a)"
                    value={storeowner.vendedor? storeowner.vendedor: ''}
                    onChange={() => { }}
                    validateInput={() => { }}
                    submit={() => { }}
                    setError={() => { }}
                    error={''}
                    editable={false}
                    isLoading={false}
                />}
            </div>
            <div style={containerOneColumn} >
                <InputEdit
                    name="Endereço"
                    value={storeowner.endereco}
                    onChange={() => { }}
                    validateInput={() => { }}
                    submit={() => { }}
                    setError={() => { }}
                    error={''}
                    editable={false}
                    isLoading={false}
                />
            </div>
            <div style={containerTwoColumn}>
                <InputEdit
                    name="Bairro"
                    value={storeowner.bairro? storeowner.bairro : ''}
                    onChange={() => { }}
                    validateInput={() => { }}
                    submit={() => { }}
                    setError={() => { }}
                    error={''}
                    editable={false}
                    isLoading={false}
                />
                <InputEdit
                    name="Cep"
                    value={storeowner.cep? storeowner.cep : ''}
                    onChange={() => { }}
                    validateInput={() => { }}
                    submit={() => { }}
                    setError={() => { }}
                    error={''}
                    editable={false}
                    isLoading={false}
                />
                <InputEdit
                    name="Cidade"
                    value={storeowner.cidade? storeowner.cidade : ''}
                    onChange={() => { }}
                    validateInput={() => { }}
                    submit={() => { }}
                    setError={() => { }}
                    error={''}
                    editable={false}
                    isLoading={false}
                />
                <InputEdit
                    name="Estado"
                    value={storeowner.estado? storeowner.estado : ''}
                    onChange={() => { }}
                    validateInput={() => { }}
                    submit={() => { }}
                    setError={() => { }}
                    error={''}
                    editable={false}
                    isLoading={false}
                />
            </div>
            <div style={containerOneColumn} >
                <InputEdit
                    name="Endereço (entrega)"
                    value={storeowner.entrega? storeowner.entrega : ''}
                    onChange={() => {}}
                    validateInput={() => {}}
                    submit={() => { }}
                    setError={() => { }}
                    error={''}
                    editable={false}
                    isLoading={false}
                />
            </div>
            <div style={containerTwoColumn}>
                <InputEdit
                    name="Bairro (entrega)"
                    value={storeowner.bairroEntrega? storeowner.bairroEntrega : ''}
                    onChange={() => {}}
                    validateInput={() => {}}
                    submit={() => { }}
                    setError={() => { }}
                    error={''}
                    editable={false}
                    isLoading={false}
                />
                <InputEdit
                    name="Cep (entrega)"
                    value={storeowner.cepEntrega? storeowner.cepEntrega : ''}
                    onChange={() => {}}
                    validateInput={() => {}}
                    submit={() => { }}
                    setError={() => { }}
                    error={''}
                    editable={false}
                    isLoading={false}
                />
                <InputEdit
                    name="Cidade (entrega)"
                    value={storeowner.cidadeEntrega? storeowner.cidadeEntrega : ''}
                    onChange={() => {}}
                    validateInput={() => {}}
                    submit={() => { }}
                    setError={() => { }}
                    error={''}
                    editable={false}
                    isLoading={false}
                />
                <InputEdit
                    name="Estado (entrega)"
                    value={storeowner.estadoEntrega? storeowner.estadoEntrega : ''}
                    onChange={() => {}}
                    validateInput={() => {}}
                    submit={() => { }}
                    setError={() => { }}
                    error={''}
                    editable={false}
                    isLoading={false}
                />
            </div>
        </div>
    )
}

export default ShowInfo
