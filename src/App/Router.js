import React, { Suspense, useContext } from 'react'
import { useLocation, useRoute } from 'wouter'

import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
// Ziro components
import { Router2 as routeMatcher } from '@ziro/router'
import MyAccount from '@bit/vitorbarbosa19.ziro.my-account'
import NotFound from '@bit/vitorbarbosa19.ziro.not-found'
// Internal components
import ConfirmEmail from '@bit/vitorbarbosa19.ziro.confirm-email'
import LoginTrouble from '@bit/vitorbarbosa19.ziro.login-trouble'
import SpinnerWithDiv from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import Submenu from '@bit/vitorbarbosa19.ziro.submenu'
import UserCart from './UserCart'
import { userContext } from './appContext'
import ChangeStoreownerEmail from './ChangeStoreownerEmail/index'
import CheckEmailVerified from './CheckEmailVerified/index'
import ConsultShipping from './ConsultShipping/index'
import CreatePayment from './CreatePayment/index'
import DeleteAccount from './DeleteAccount/index'
import DeleteUser from './DeleteUser/index'
import { HeaderBack } from './HeaderBack/index'
import ImageUpload from './ImageUpload/index'
import LinkRequest from './LinkRequest/index'
import Login from './Login/index'
import LoginSupportPage from './LoginSupportPage'
import MaterialRequest from './MaterialRequest/index'
import { Menu } from './Menu/index'
import Register from './Register/index'
import RegisterAffiliate from './RegisterAffiliate/index'
import RegisterBillet from './RegisterBillet/index'
import RegisterExpenses from './RegisterExpenses/index'
import RegisterInputOutput from './RegisterInputOutput/index'
import RegisterStoreowner from './RegisterStoreowner/index'
import ResendEmail from './ResendEmail/index'
import ResetPass from './ResetPass/index'
import ShowInfo from './ShowInfo/index'
import SplitPayment from './SplitPayment/index'
import Transactions from './Transactions/index'
import SellersPlans from './SellersPlans/index'
import UpdateAffiliate from './UpdateAffiliate/index'
import UpdateBrandsInfos from './UpdateBrandsInfos'
import UpdateEmail from './UpdateEmail/index'
import UpdatePass from './UpdatePass/index'
import UpdateStoreowner from './UpdateStoreowner/index'
import UpdateUserInfo from './UpdateUserInfo/index'
import UpdateZoopPlan from './UpdateZoopPlan/index'
import UpdateZoopPlanOld from './UpdateZoopPlanOld/index'
import CommissionModels from './CommissionModels'
import UploadBillet from './UploadBillet'
import UploadImages from './UploadImages/index'
import ValidateEmail from './ValidateEmail/index'
import UpdateTax from './UpdateZoopPlan/UpdateTax'
import UpdateDefaultTax from './ChangeDefaultFees/UpdateDefaultTax'
import CreateAndUpdate from './UpdateZoopPlan/CreateUpdateZoopPlan'
import NewZoopPlan from './UpdateZoopPlan/NewZoopPlan'
import TestingPercentagesSplitRules from './TestingPercentagesSplitRules'
import ChangeDefaultFees from './ChangeDefaultFees'
import Adjustment from './Adjustment/index'
import Pickup from './Pickup/index'
import CommissionManagement from './CommissionManagement/index'
import PostDuplicata from './PostDuplicata/index'
import ShowAttendance from './ShowAttendance/index'
import Pagamentos from './Pagamentos'
// import FirebaseMigration from './FirebaseMigration/index' -> Inacabado

const Router = ({ isLogged }) => {
  const [match, params] = useRoute('/pedidos/:cartId?')
  const [matchTransactions, paramsTransactions] = useRoute('/transacoes/:transactionId?/:receivableId?')
  const [matchTransactionsSplit, paramsTransactionsSplit] = useRoute('/transacoes/:transactionId?/split')
  const [matchSeller, paramsSeller] = useRoute('/atualizar-plano-venda/:sellerId?')
  const [matchSellerNewPlan, paramsSellerNewPlan] = useRoute('/atualizar-plano-venda/:sellerId?/newPlan')
  const [matchFee, paramsFee] = useRoute('/atualizar-plano-venda/:sellerId?/:fee?/:selectedPlan?')
  const [matchDefaultFee, paramsDefaultFee] = useRoute('/alterar-tarifas-padrao/:fee?/:selectedPlan?')
  const { nickname } = useContext(userContext)
  const allowedUsers = ['Vitor']

  const [location] = useLocation()
  const publicRoutes = {
    '/': <Login />,
    '/login': <Login />,
    '/cadastrar': <Register />,
    '/problemas-acesso': <LoginTrouble navigateTo="/login" />,
    '/pagina-suporte': <LoginSupportPage />,
    '/reenviar-email': <ResendEmail />,
    '/resetar-senha': <ResetPass />,
    '/confirmar-email': <ConfirmEmail />,
    '/show-info': <ShowInfo />,
    '/show-attendance': <ShowAttendance />,
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
    '/planos-fabricantes': (
      <HeaderBack title="Planos dos Fabricantes" navigateTo="/suporte">
        <SellersPlans {...paramsTransactions} />
      </HeaderBack>
    ),
    [matchTransactions ? location : null]: <Transactions {...paramsTransactions} />,
    [matchTransactionsSplit ? location : null]: <SplitPayment {...paramsTransactionsSplit} />,
    // [matchFee ? location : null]: <CreateAndUpdate {...paramsFee} />,
    [matchFee ? location : null]: <UpdateTax {...paramsFee} />,
    [matchDefaultFee ? location : null]: <UpdateDefaultTax {...paramsDefaultFee} />,
    [matchSeller ? location : null]: (
      <HeaderBack title="Alterar Plano de Venda" navigateTo={localStorage.getItem('voltar') || '/suporte'}>
        <UpdateZoopPlan {...paramsSeller} />
      </HeaderBack>
    ),
    [matchSellerNewPlan ? location : null]: <NewZoopPlan {...paramsSellerNewPlan} />,
    '/deletar-conta': <DeleteAccount />,
    '/administrativo': (
      <Menu title="Administrativo">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Submenu
            options={[
              ['Requisição de Material', 'requerir-material'],
              ['Entrada/Saída do Caixa', 'entrada-saida'],
              ['Solicitação de Link', 'solicitacao-link'],
              ['Consulta Parcela 2', 'commission-models'],
              ['Reajuste', 'adjustment'],
              ['Gestão Parcela 2', 'comission-gestao'],
              ['Lançamento de Duplicata', 'post-duplicata'],
              ['Cadastrar despesa', 'cadastrar-despesa'],
              ['Visualizar pagamentos', 'visualizar-pagamentos'],
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
              ['Consulta de frete', 'consultar-frete'],
              ['Retiradas', 'retiradas'],
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
              ['Atualizar Plano Zoop do usuário antigo', '/atualizar-plano-zoop-old'],
              ['Fabricantes: Alterar plano de venda', '/atualizar-plano-venda'],
              ['Fabricantes: Alterar tarifas padrão', '/alterar-tarifas-padrao'],
              ['Fabricantes: Visualizar planos ativos', '/planos-fabricantes'],
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
    '/retiradas': (
      <HeaderBack title="Cadastrar Retirada" navigateTo="/logistica">
        <Pickup />
      </HeaderBack>
    ),
    '/cadastrar-despesa': (
      <HeaderBack title="Cadastrar despesa" navigateTo="/administrativo">
        <RegisterExpenses />
      </HeaderBack>
    ),
    '/atualizar-plano-zoop-old': (
      <HeaderBack title="Atualizar Plano Zoop do usuário antigo" navigateTo="/suporte">
        <UpdateZoopPlanOld />
      </HeaderBack>
    ),
    '/testar-tarifas': (
      <HeaderBack title="Testar Tarifas do Plano" navigateTo="/atualizar-plano-venda">
        <TestingPercentagesSplitRules />
      </HeaderBack>
    ),
    '/alterar-tarifas-padrao': (
      <HeaderBack title="Alterar tarifas padrão" navigateTo="/suporte">
        <ChangeDefaultFees />
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
      <HeaderBack title="Consulta Parcela 2" navigateTo="/administrativo">
        <CommissionModels />
      </HeaderBack>
    ),
    '/adjustment': (
      <HeaderBack title="Reajuste" navigateTo="/administrativo">
        <Adjustment />
      </HeaderBack>
    ),
    '/comission-gestao': (
      <HeaderBack title="Gestão Parcela 2" navigateTo="/administrativo">
        <CommissionManagement />
      </HeaderBack>
    ),
    '/post-duplicata': (
      <HeaderBack title="Lançamento de Duplicata" navigateTo="/administrativo">
        <PostDuplicata />
      </HeaderBack>
    ),
    '/visualizar-pagamentos': (
      <HeaderBack title="Visualizar pagamentos" navigateTo="/administrativo">
        <Pagamentos />
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
    '/atualizar-plano-venda': (
      <HeaderBack title="Alterar Plano de Venda" navigateTo="/suporte">
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
