import React, { useState, useEffect } from 'react'
import InputEdit from '@bit/vitorbarbosa19.ziro.input-edit'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner'
import Error from '@bit/vitorbarbosa19.ziro.error'
import Logo from '@bit/vitorbarbosa19.ziro.logo'
import SocialMedia from '@bit/vitorbarbosa19.ziro.social-media'
import { containerWithPadding } from '@ziro/theme'
import fetch from './fetch'
import { container, name, containerBody } from './styles'

const ShowInfo = ({ needContainer = false }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [partAddress, setPartAddress] = useState([])
    const [storeowner, setStoreowner] = useState({ 'cadastro': '', 'afiliado': '', 'afiliado_cpf': '', 'lojista': '', 'rg': '', 'cpf': '', 'nascimento': '', 'insta': '', 'cnpj': '', 'ie': '', 'razao': '', 'fantasia': '', 'endereco': '', 'bairro': '', 'cep': '', 'cidade': '', 'estado': '', 'fone': '', 'email': '', 'assessor': '', 'vendedor': '', 'whats': '', 'entrega': '', 'cepEntrega': '', 'cidadeEntrega': '', 'estadoEntrega': '' })

    useEffect(() => fetch(setIsLoading, setIsError, setPartAddress, setStoreowner, new URLSearchParams(window.location.search).get('doc')), [])

    if (isLoading) return <div style={{ display: 'grid' }}><Spinner size='5rem' /></div>
    if (isError) return <Error />

    return (
        <div style={needContainer? containerWithPadding : {}}>
            {needContainer && <div style={container}>
                <Logo />
                <label style={name}>Ziro Negócios Digitais Ltda</label>
                <label>28.026.371/0001-61</label>
                <label>R. Lubavitch, 71, Bom Retiro</label>
                <label>01123-110, São Paulo - SP</label>
                <SocialMedia />
            </div>}
            <div style={containerBody}>
                <InputEdit
                        name="Nome"
                        value={storeowner.lojista? storeowner.lojista.split(' ')[0] : ''}
                        onChange={() => {}}
                        validateInput={() => {}}
                        submit={() => { }}
                        setError={() => { }}
                        error={''}
                        editable={false}
                        isLoading={false}
                    />
                    <InputEdit
                        name="Sobrenome"
                        value={storeowner.lojista? storeowner.lojista.split(' ').slice(1).join(' ') : ''}
                        onChange={() => {}}
                        validateInput={() => {}}
                        submit={() => { }}
                        setError={() => { }}
                        error={''}
                        editable={false}
                        isLoading={false}
                    />
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
                    <InputEdit
                        name="Assessor(a)"
                        value={storeowner.assessor? storeowner.assessor: ''}
                        onChange={() => { }}
                        validateInput={() => { }}
                        submit={() => { }}
                        setError={() => { }}
                        error={''}
                        editable={false}
                        isLoading={false}
                    />
                    <InputEdit
                        name="Afiliado(a)"
                        value={storeowner.afiliado? storeowner.afiliado: ''}
                        onChange={() => { }}
                        validateInput={() => { }}
                        submit={() => { }}
                        setError={() => { }}
                        error={''}
                        editable={false}
                        isLoading={false}
                    />
                    <InputEdit
                        name="Vendedor(a)"
                        value={storeowner.vendedor? storeowner.vendedor: ''}
                        onChange={() => { }}
                        validateInput={() => { }}
                        submit={() => { }}
                        setError={() => { }}
                        error={''}
                        editable={false}
                        isLoading={false}
                    />
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
                    <InputEdit
                        name="Rua"
                        value={storeowner.endereco ? storeowner.endereco.split(', ')[0] : ''}
                        onChange={() => { }}
                        validateInput={() => { }}
                        submit={() => { }}
                        setError={() => { }}
                        error={''}
                        editable={false}
                        isLoading={false}
                    />
                    <InputEdit
                        name="Número"
                        value={storeowner.endereco ? storeowner.endereco.split(', ')[1] : ''}
                        onChange={() => { }}
                        validateInput={() => { }}
                        submit={() => { }}
                        setError={() => { }}
                        error={''}
                        editable={false}
                        isLoading={false}
                    />
                    <InputEdit
                        name="Complemento"
                        value={storeowner.endereco ? storeowner.endereco.split(', ')[2] : ''}
                        onChange={() => { }}
                        validateInput={() => { }}
                        submit={() => { }}
                        setError={() => { }}
                        error={''}
                        editable={false}
                        isLoading={false}
                    />
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
                    <InputEdit
                        name="Rua (entrega)"
                        value={partAddress[0]? partAddress[0] : ''}
                        onChange={() => {}}
                        validateInput={() => {}}
                        submit={() => { }}
                        setError={() => { }}
                        error={''}
                        editable={false}
                        isLoading={false}
                    />
                    <InputEdit
                        name="Número (entrega)"
                        value={partAddress[1]? partAddress[1] : ''}
                        onChange={() => {}}
                        validateInput={() => {}}
                        submit={() => { }}
                        setError={() => { }}
                        error={''}
                        editable={false}
                        isLoading={false}
                    />
                    <InputEdit
                        name="Cmpt (entrega)"
                        value={partAddress.length === 4 ? partAddress[2] : ''}
                        onChange={() => {}}
                        validateInput={() => true}
                        submit={() => { }}
                        setError={() => { }}
                        error={''}
                        editable={false}
                        isLoading={false}
                    />
                    <InputEdit
                        name="Bairro (entrega)"
                        value={partAddress.length === 4 ? partAddress[3] : partAddress[2]}
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
