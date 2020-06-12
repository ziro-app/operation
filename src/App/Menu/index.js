import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { userContext } from '../appContext';
import { auth } from '../../Firebase/index';
import Header from '@bit/vitorbarbosa19.ziro.header';
import Drawer from '@bit/vitorbarbosa19.ziro.drawer';
import DrawerPanel from '@bit/vitorbarbosa19.ziro.drawer-panel';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import { containerWithPadding } from '@ziro/theme';

export const Menu = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { name, nickname, cpf } = useContext(userContext);
  return (
    <div style={containerWithPadding}>
      <Header type="icon" title={title} icon="menu" setIsOpen={() => setIsOpen(true)} />
      <Drawer isOpen={isOpen} setIsOpen={() => setIsOpen(false)}>
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
              path: '/transacoes',
              onClick: () => setIsOpen(false),
              icon: <Icon type="card" size={15} strokeWidth={2} />,
              text: 'Transações',
            },
            {
              path: 'criar-pagamento',
              onClick: () => setIsOpen(false),
              icon: <Icon type="money" size={15} strokeWidth={2} />,
              text: 'Criar Cobrança',
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
      </Drawer>
      {children}
    </div>
  );
};

Menu.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.element)]).isRequired,
};
