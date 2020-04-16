import React, { useState, useEffect, useRef } from 'react'
import InputEdit from '@bit/vitorbarbosa19.ziro.input-edit'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner'
import Error from '@bit/vitorbarbosa19.ziro.error'
import Logo from '@bit/vitorbarbosa19.ziro.logo'
import SocialMedia from '@bit/vitorbarbosa19.ziro.social-media'
import Button from '@bit/vitorbarbosa19.ziro.button'
import { containerWithPadding } from '@ziro/theme'
import fetch from './fetch'
import { container, name, block, blockTitle, containerOneColumn, containerTwoColumn, containerTwoColumnButton, button, bar } from './styles'
import { alertColor, successColor } from '@ziro/theme'

const ShowInfo = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [copyResultText, setCopyResultText] = useState('')
    const [copyResultStatus, setCopyResultStatus] = useState(true)
    const textAreaRef = useRef(null)
    const [storeowner, setStoreowner] = useState({ 'cadastro': '', 'afiliado': '', 'afiliado_cpf': '', 'lojista': '', 'rg': '', 'cpf': '', 'nascimento': '', 'insta': '', 'cnpj': '', 'ie': '', 'razao': '', 'fantasia': '', 'endereco': '', 'bairro': '', 'cep': '', 'cidade': '', 'estado': '', 'fone': '', 'email': '', 'assessor': '', 'vendedor': '', 'whats': '', 'entrega': '', 'bairroEntrega': '', 'cepEntrega': '', 'cidadeEntrega': '', 'estadoEntrega': '' })

    const copyToClipboard = (e) => {
        e.preventDefault()
        if(document.queryCommandSupported('copy')) {
            try {
                textAreaRef.current.select()
                document.execCommand('copy')
                setCopyResultStatus(true)
                setCopyResultText('Copiado !')
                setTimeout(() => {
                    setCopyResultText('')
                }, 2500)
            } catch (error) {
                console.log(error)
                setCopyResultStatus(false)
                setCopyResultText('Erro ao copiar.')
                setTimeout(() => {
                    setCopyResultText('')
                }, 2500)
            }
        } else {
            setCopyResultStatus(false)
            setCopyResultText('Sem suporte para cópia.')
            setTimeout(() => {
                setCopyResultText('')
            }, 2500)
        }

    }

    useEffect(() => fetch(setIsLoading, setIsError, setStoreowner, new URLSearchParams(window.location.search).get('doc')), [])

    if (isLoading) return <div style={{ display: 'grid' }}><Spinner size='5rem' /></div>
    if (isError) return <Error />

    return (
        <div style={containerWithPadding}>
            <input type="text" style={{ position: 'absolute', left: '-9999px' }} value={storeowner.cnpj} ref={textAreaRef} readOnly />
            <div style={container}>
                <Logo />
                <label style={name}>Ziro Negócios Digitais Ltda</label>
                <label>28.026.371/0001-61</label>
                <label>R. Lubavitch, 71, Bom Retiro</label>
                <label>01123-110, São Paulo - SP</label>
                <SocialMedia />
            </div>
            <div style={block}>
                <hr style={bar} />
                <label style={blockTitle}>Informações do CNPJ</label>
                <div style={containerTwoColumnButton} >
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
                    <div >
                        <Button
                            type="button"
                            cta="copiar cnpj"
                            template="regular"
                            click={copyToClipboard}
                            style={button}
                        />
                        {copyResultText ?
                            <div style={{padding: '6px 0 0', fontSize: '1.3rem', color: copyResultStatus? successColor : alertColor, textAlign: 'center'}} >
                                <span>{copyResultText}</span>
                            </div>
                            : <div style={{height: '24px'}}>&nbsp;</div>
                        }
                    </div>
                </div>
                <div style={containerOneColumn} >
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
                        name="Email"
                        value={storeowner.email? storeowner.email.toLowerCase() : ''}
                        onChange={() => { }}
                        validateInput={() => { }}
                        submit={() => { }}
                        setError={() => { }}
                        error={''}
                        editable={false}
                        isLoading={false}
                    />
                    <InputEdit
                        name="Instagram da loja"
                        value={storeowner.insta? storeowner.insta : ''}
                        onChange={() => {}}
                        validateInput={() => {}}
                        submit={() => {}}
                        setError={() => { }}
                        error={''}
                        editable={false}
                        isLoading={false}
                    />
                </div>
                <hr style={bar} />
                <label style={blockTitle}>Endereço do CNPJ</label>
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
                <hr style={bar} />
                <label style={blockTitle}>Informações do comprador</label>
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
                <hr style={bar} />
                <label style={blockTitle}>Endereço de entrega</label>
                <div style={containerOneColumn} >
                    <InputEdit
                        name="Endereço"
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
                        name="Bairro"
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
                        name="Cep"
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
                        name="Cidade"
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
                        name="Estado"
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
        </div>
    )
}

export default ShowInfo
