import React, { useState } from 'react'
import Modal from '@bit/vitorbarbosa19.ziro.modal'
import Illustration from '@bit/vitorbarbosa19.ziro.illustration'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner'
import Button from '@bit/vitorbarbosa19.ziro.button'
import searchCnpj from './searchCnpj'
import { modalBox, container, title, svg } from './styles'

const GetCnpj = ({ cnpj, setState }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [firstLabel, setFirstLabel] = useState(true)
    const {...rest} = setState
    const state = { cnpj, setFirstLabel, setIsOpen, ...rest }
    return (
        <>
            <Modal boxStyle={modalBox} isOpen={isOpen} setIsOpen={() => { }}>
                <div style={container}>
                    <div style={svg} ><Illustration type="waiting" size={200} /></div>
                    <label style={title}>{firstLabel ? 'Aguarde...' : 'Só mais um momento...'}</label>
                    <label>{firstLabel
                        ? 'Estamos validando seu CNPJ. Não saia da página'
                        : 'Estamos concluindo a validação. Não saia da página'}
                    </label>
                    <Spinner size='3rem' />
                </div>
            </Modal>
            <Button
                type="button"
                cta="Update Receita"
                template="regular"
                click={searchCnpj ? searchCnpj(state) : () => null}
            />
        </>
    )
}

export default GetCnpj
