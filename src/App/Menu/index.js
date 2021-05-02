import React, { useContext, useState } from 'react'

import Drawer from '@bit/vitorbarbosa19.ziro.drawer'
import DrawerPanel from '@bit/vitorbarbosa19.ziro.drawer-panel'
import Header from '@bit/vitorbarbosa19.ziro.header'
import Icon from '@bit/vitorbarbosa19.ziro.icon'
import PropTypes from 'prop-types'
import { auth } from '../../Firebase/index'
import { containerWithPadding } from '@ziro/theme'
import { HeaderBack } from '../HeaderBack'
import { userContext } from '../appContext'
import { ImageIcon } from './ImageIcon'

export const Menu = ({ title, children, back }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { nickname, cpf } = useContext(userContext)
  const allowedUsers = ['Vitor']

  const mountDrawerpanel = () => {
    if (process.env.HOMOLOG ? true : allowedUsers.includes(nickname)) {
      return (
        <DrawerPanel
          username={nickname || 'Usuário'}
          userdata={cpf ? `CPF: ${cpf}` : ''}
          options={[
            {
              path: '/pedidos',
              onClick: () => setIsOpen(false),
              icon: <Icon type="cart" size={15} strokeWidth={2} />,
              text: 'Pedidos',
            },
            {
              path: '/produtos',
              onClick: () => setIsOpen(false),
              icon: <ImageIcon />,
              text: 'Produtos',
            },
            {
              path: '/transacoes',
              onClick: () => setIsOpen(false),
              icon: <Icon type="card" size={15} strokeWidth={2} />,
              text: 'Transações',
            },
            {
              path: '/transacoes-fabricantes',
              onClick: () => setIsOpen(false),
              icon: <Icon type="card" size={15} strokeWidth={2} />,
              text: 'Vendas de créditos',
            },
            {
              path: 'criar-cobranca',
              onClick: () => setIsOpen(false),
              icon: <Icon type="money" size={15} strokeWidth={2} />,
              text: 'Criar Cobrança',
            },
            {
              path: 'suporte',
              onClick: () => setIsOpen(false),
              icon: <Icon type="headphone" size={15} strokeWidth={2} />,
              text: 'Suporte',
            },
            {
              path: '/administrativo',
              onClick: () => setIsOpen(false),
              icon: <Icon type="file" size={15} strokeWidth={2} />,
              text: 'Administrativo',
            },
            {
              path: '/assessoria',
              onClick: () => setIsOpen(false),
              icon: <Icon type="shopping" size={15} strokeWidth={2} />,
              text: 'Assessoria',
            },
            {
              path: '/logistica',
              onClick: () => setIsOpen(false),
              icon: <Icon type="truck" size={15} strokeWidth={2} />,
              text: 'Logística',
            },
            {
              path: '/excluir-usuario',
              onClick: () => setIsOpen(false),
              icon: <Icon type="trash" size={15} strokeWidth={2} />,
              text: 'Excluir Usuário',
            },
            {
              path: '/login',
              onClick: () => setIsOpen(false),
              icon: <Icon type="gear" size={15} strokeWidth={2} />,
              text: 'Minha conta',
            },
            {
              path: '/login',
              onClick: () => auth.signOut(),
              icon: <Icon type="logout" size={15} strokeWidth={3} />,
              text: 'Sair',
            },
          ]}
        />
      )
    } else
      return (
        <DrawerPanel
          username={nickname || 'Usuário'}
          userdata={cpf ? `CPF: ${cpf}` : ''}
          options={[
            {
              path: '/pedidos',
              onClick: () => setIsOpen(false),
              icon: <Icon type="cart" size={15} strokeWidth={2} />,
              text: 'Pedidos',
            },
            {
              path: '/produtos',
              onClick: () => setIsOpen(false),
              icon: <ImageIcon />,
              text: 'Produtos',
            },
            {
              path: '/transacoes',
              onClick: () => setIsOpen(false),
              icon: <Icon type="card" size={15} strokeWidth={2} />,
              text: 'Transações',
            },
            {
              path: '/transacoes-fabricantes',
              onClick: () => setIsOpen(false),
              icon: <Icon type="card" size={15} strokeWidth={2} />,
              text: 'Vendas de créditos',
            },
            {
              path: 'criar-cobranca',
              onClick: () => setIsOpen(false),
              icon: <Icon type="money" size={15} strokeWidth={2} />,
              text: 'Criar Cobrança',
            },
            {
              path: 'suporte',
              onClick: () => setIsOpen(false),
              icon: <Icon type="headphone" size={15} strokeWidth={2} />,
              text: 'Suporte',
            },
            {
              path: '/administrativo',
              onClick: () => setIsOpen(false),
              icon: <Icon type="file" size={15} strokeWidth={2} />,
              text: 'Administrativo',
            },
            {
              path: '/assessoria',
              onClick: () => setIsOpen(false),
              icon: <Icon type="shopping" size={15} strokeWidth={2} />,
              text: 'Assessoria',
            },
            {
              path: '/logistica',
              onClick: () => setIsOpen(false),
              icon: <Icon type="truck" size={15} strokeWidth={2} />,
              text: 'Logística',
            },
            {
              path: '/login',
              onClick: () => setIsOpen(false),
              icon: <Icon type="gear" size={15} strokeWidth={2} />,
              text: 'Minha conta',
            },
            {
              path: '/login',
              onClick: () => auth.signOut(),
              icon: <Icon type="logout" size={15} strokeWidth={3} />,
              text: 'Sair',
            },
          ]}
        />
      )
  }
  if (back) {
    return (
      <div style={{ ...containerWithPadding, padding: '20px 12px 60px' }}>
        <HeaderBack title={title} navigateTo={back} withoutContainer>
          <Drawer isOpen={isOpen} setIsOpen={() => setIsOpen(false)}>
            {mountDrawerpanel()}
          </Drawer>
          {children}
        </HeaderBack>
      </div>
    )
  }
  return (
    <div style={{ ...containerWithPadding, padding: '20px 12px 60px' }}>
      <Header type="icon" title={title} icon="menu" setIsOpen={() => setIsOpen(true)} />
      <Drawer isOpen={isOpen} setIsOpen={() => setIsOpen(false)}>
        {mountDrawerpanel()}
      </Drawer>
      {children}
    </div>
  )
}

Menu.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.element)]).isRequired,
}
