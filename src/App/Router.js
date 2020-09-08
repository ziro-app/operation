import React, { Suspense, useContext } from 'react'
import { useLocation, useRoute } from 'wouter'

import ChangeStoreownerEmail from './ChangeStoreownerEmail/index'
import CheckEmailVerified from './CheckEmailVerified/index'
import ConfirmEmail from '@bit/vitorbarbosa19.ziro.confirm-email'
import ConsultShipping from './ConsultShipping/index'
import CreatePayment from './CreatePayment/index'
import DeleteAccount from './DeleteAccount/index'
import DeleteUser from './DeleteUser/index'
import { HeaderBack } from './HeaderBack/index'
import ImageUpload from './ImageUpload/index'
import LinkRequest from './LinkRequest/index'
import Login from './Login/index'
import LoginTrouble from '@bit/vitorbarbosa19.ziro.login-trouble'
import MaterialRequest from './MaterialRequest/index'
import { Menu } from './Menu/index'
import MyAccount from '@bit/vitorbarbosa19.ziro.my-account'
import NotFound from '@bit/vitorbarbosa19.ziro.not-found'
import PropTypes from 'prop-types'
import Register from './Register/index'
import RegisterAffiliate from './RegisterAffiliate/index'
import RegisterBillet from './RegisterBillet/index'
import RegisterExpenses from './RegisterExpenses/index'
import RegisterInputOutput from './RegisterInputOutput/index'
import RegisterStoreowner from './RegisterStoreowner/index'
import ResendEmail from './ResendEmail/index'
import ResetPass from './ResetPass/index'
import ShowInfo from './ShowInfo/index'
import SpinnerWithDiv from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import SplitPayment from './SplitPayment/index'
import Submenu from '@bit/vitorbarbosa19.ziro.submenu'
import Transactions from './Transactions/index'
import UpdateAffiliate from './UpdateAffiliate/index'
import UpdateBrandsInfos from './UpdateBrandsInfos'
import UpdateEmail from './UpdateEmail/index'
import UpdatePass from './UpdatePass/index'
import UpdateStoreowner from './UpdateStoreowner/index'
import UpdateUserInfo from './UpdateUserInfo/index'
import UpdateZoopPlan from './UpdateZoopPlan/index'
import CommissionModels from './CommissionModels'
import UploadBillet from './UploadBillet'
import UploadImages from './UploadImages/index'
import UserCart from './UserCart'
import ValidateEmail from './ValidateEmail/index'
import { motion } from 'framer-motion'
import { Router2 as routeMatcher } from '@ziro/router'
import { userContext } from './appContext'

// import FirebaseMigration from './FirebaseMigration/index' -> Inacabado















const Router = ({ isLogged }) => {
  const [match, params] = useRoute('/pedidos/:cartId?')
  const [matchTransactions, paramsTransactions] = useRoute('/transacoes/:transactionId?/:receivableId?')
  const [matchTransactionsSplit, paramsTransactionsSplit] = useRoute('/transacoes/:transactionId?/split')
  const { nickname } = useContext(userContext)
  const allowedUsers = ['Vitor']

  const [location] = useLocation()
  const publicRoutes = {
    '/': <Login />,
    '/login': <Login />,
    '/cadastrar': <Register />,
    '/problemas-acesso': <LoginTrouble navigateTo="/login" />,
    '/reenviar-email': <ResendEmail />,
    '/resetar-senha': <ResetPass />,
    '/confirmar-email': <ConfirmEmail />,
    '/show-info': <ShowInfo />,
  }
  const privateRoutes = {
    // Menu can't be put inside the components because then it'll unmount on transition
    '/': (
      <Menu title="Minha Conta">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <MyAccount />
        </motion.div>
      </Menu>
    ),
    '/login': (
      <Menu title="Minha Conta">
        <MyAccount />
      </Menu>
    ),
    '/trocar-email': <UpdateEmail />,
    '/trocar-senha': <UpdatePass />,
    '/transacoes': <Transactions {...paramsTransactions} />,
    [matchTransactions ? location : null]: <Transactions {...paramsTransactions} />,
    [matchTransactionsSplit ? location : null]: <SplitPayment {...paramsTransactionsSplit} />,
    '/deletar-conta': <DeleteAccount />,
    '/administrativo': (
      <Menu title="Administrativo">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Submenu
            options={[
              ['Requisição de Material', 'requerir-material'],
              ['Entrada/Saída do Caixa', 'entrada-saida'],
              ['Solicitação de Link', 'solicitacao-link'],
              ['Modelo Parcela 2', 'commission-models'],
            ]}
          />
        </motion.div>
      </Menu>
    ),
    '/assessoria': (
      <Menu title="Assessoria">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Submenu
            options={[
              ['Catalogo: Upload de imagens', 'upload-imagens'],
              ['Catalogo: Upload de imagens/antigo', 'upload-imagem'],
              ['Catalogo: Atualizar Fabricantes', '/atualizar-fabricantes'],
              ['Boletos: Cadastrar', 'cadastrar-boleto'],
              ['Boletos: Upload foto', 'upload-boleto'],
              ['Lojista: Cadastrar', '/cadastrar-lojista'],
              ['Lojista: Ver/Editar', '/visualizar-lojista'],
              ['Afiliado: Cadastrar', '/cadastrar-afiliado'],
              ['Afiliado: Ver/Editar', '/visualizar-afiliado'],
            ]}
          />
        </motion.div>
      </Menu>
    ),
    '/logistica': (
      <Menu title="Logística">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Submenu
            options={[
              ['Cadastrar despesa', 'cadastrar-despesa'],
              ['Consulta de frete', 'consultar-frete'],
            ]}
          />
        </motion.div>
      </Menu>
    ),
    '/suporte': (
      <Menu title="Suporte">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Submenu
            options={[
              ['Reenviar confirmação de email', '/checar-email'],
              ['Aprovar confirmação de email', '/validar-email'],
              ['Alterar email do usuário', '/alterar-email'],
              ['Atualizar Plano Zoop do usuário', '/atualizar-plano-zoop'],
            ]}
          />
        </motion.div>
      </Menu>
    ),
    '/upload-boleto': (
      <HeaderBack title="Upload de boleto" navigateTo="/assessoria">
        <UploadBillet />
      </HeaderBack>
    ),
    '/consultar-frete': (
      <HeaderBack title="Consulta de frete" navigateTo="/logistica">
        <ConsultShipping />
      </HeaderBack>
    ),
    '/cadastrar-despesa': (
      <HeaderBack title="Cadastrar despesa" navigateTo="/logistica">
        <RegisterExpenses />
      </HeaderBack>
    ),
    '/cadastrar-boleto': (
      <HeaderBack title="Cadastrar boleto" navigateTo="/assessoria">
        <RegisterBillet />
      </HeaderBack>
    ),
    '/requerir-material': (
      <HeaderBack title="Requisição de material" navigateTo="/administrativo">
        <MaterialRequest />
      </HeaderBack>
    ),
    '/visualizar-lojista': (
      <HeaderBack title="Visualizar lojista" navigateTo="/assessoria">
        <UpdateStoreowner />
      </HeaderBack>
    ),
    '/cadastrar-lojista': (
      <HeaderBack title="Cadastrar lojista" navigateTo="/assessoria">
        <RegisterStoreowner />
      </HeaderBack>
    ),
    '/cadastrar-afiliado': (
      <HeaderBack title="Cadastrar afiliado" navigateTo="/assessoria">
        <RegisterAffiliate />
      </HeaderBack>
    ),
    '/visualizar-afiliado': (
      <HeaderBack title="Visualizar afiliado" navigateTo="/assessoria">
        <UpdateAffiliate />
      </HeaderBack>
    ),
    '/upload-imagem': (
      <HeaderBack title="Upload de imagens" navigateTo="/assessoria">
        <ImageUpload />
      </HeaderBack>
    ),
    '/upload-imagens': (
      <HeaderBack title="Upload de imagens" navigateTo="/assessoria">
        <UploadImages withIcon imgExtension={['.jpg', '.gif', '.png', '.gif']} maxFileSize={5242880} />
      </HeaderBack>
    ),
    '/update': (
      <HeaderBack title="Atualizar informações" navigateTo="/login">
        <UpdateUserInfo />
      </HeaderBack>
    ),
    '/atualizar-fabricantes': (
      <HeaderBack title="Atualizar fabricantes" navigateTo="/assessoria">
        <UpdateBrandsInfos />
      </HeaderBack>
    ),
    '/criar-pagamento': <CreatePayment />,
    '/entrada-saida': (
      <HeaderBack title="Entrada/Saída do Caixa" navigateTo="/administrativo">
        <RegisterInputOutput />
      </HeaderBack>
    ),
    '/solicitacao-link': (
      <HeaderBack title="Solicitação de Link" navigateTo="/administrativo">
        <LinkRequest />
      </HeaderBack>
    ),
    '/commission-models': (
      <HeaderBack title="Modelo Parcela 2" navigateTo="/administrativo">
        <CommissionModels />
      </HeaderBack>
    ),
    '/checar-email': (
      <HeaderBack title="Reenviar Email" navigateTo="/suporte">
        <CheckEmailVerified />
      </HeaderBack>
    ),
    '/validar-email': (
      <HeaderBack title="Aprovar Email" navigateTo="/suporte">
        <ValidateEmail />
      </HeaderBack>
    ),
    '/alterar-email': (
      <HeaderBack title="Alterar Email" navigateTo="/suporte">
        <ChangeStoreownerEmail />
      </HeaderBack>
    ),
    '/atualizar-plano-zoop': (
      <HeaderBack title="Atualizar Plano Zoop" navigateTo="/suporte">
        <UpdateZoopPlan />
      </HeaderBack>
    ),
    [match ? location : null]: (
      <Suspense fallback={<SpinnerWithDiv />}>
        <UserCart {...params} />
      </Suspense>
    ),
    // [match && !params.userId ? location : null]: <HeaderBack title='Procurar pedidos' navigateTo='/assessoria'><SearchUserCart /></HeaderBack>,
    // [match && params.userId && !params.requestId ? location : null]: <UserCart />,
    // [match && params.userId && params.requestId ? location : null]: <UserCartItem />,
    '/show-info': <ShowInfo internal />,
  }

  if (process.env.HOMOLOG ? true : allowedUsers.includes(nickname))
    privateRoutes['/excluir-usuario'] = (
      <Menu title="Excluir Usuário">
        <DeleteUser />
      </Menu>
    )

  return routeMatcher(isLogged, publicRoutes, privateRoutes, <Login />, <NotFound fallback="/" />)
}

Router.propTypes = {
  isLogged: PropTypes.bool.isRequired,
}

export default Router
