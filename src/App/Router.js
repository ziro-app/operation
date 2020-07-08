import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Router2 as routeMatcher } from '@ziro/router';
import Login from './Login/index';
import Register from './Register/index';
import LoginTrouble from '@bit/vitorbarbosa19.ziro.login-trouble';
import ResendEmail from './ResendEmail/index';
import ResetPass from './ResetPass/index';
import ConfirmEmail from '@bit/vitorbarbosa19.ziro.confirm-email';
import { Menu } from './Menu/index';
import { HeaderBack } from './HeaderBack/index';
import MyAccount from '@bit/vitorbarbosa19.ziro.my-account';
import UpdateEmail from './UpdateEmail/index';
import UpdatePass from './UpdatePass/index';
import DeleteAccount from './DeleteAccount/index';
import RegisterStoreowner from './RegisterStoreowner/index';
import UpdateStoreowner from './UpdateStoreowner/index';
import RegisterAffiliate from './RegisterAffiliate/index';
import UpdateAffiliate from './UpdateAffiliate/index';
import RegisterBillet from './RegisterBillet/index';
import ShowInfo from './ShowInfo/index';
import RegisterExpenses from './RegisterExpenses/index';
import ConsultShipping from './ConsultShipping/index';
import CheckEmailVerified from './CheckEmailVerified/index';
import ValidateEmail from './ValidateEmail/index';
import ChangeStoreownerEmail from './ChangeStoreownerEmail/index';
// import FirebaseMigration from './FirebaseMigration/index' -> Inacabado
import ImageUpload from './ImageUpload/index';
import UploadImages from './UploadImages/index';
import CreatePayment from './CreatePayment/index';
import Submenu from '@bit/vitorbarbosa19.ziro.submenu';
import UpdateUserInfo from './UpdateUserInfo/index';
import MaterialRequest from './MaterialRequest/index';
import RegisterInputOutput from './RegisterInputOutput/index';
import NotFound from '@bit/vitorbarbosa19.ziro.not-found';
import UpdateBrandsInfos from './UpdateBrandsInfos';
import UserCart from './UserCart';
import UploadBillet from './UploadBillet';
import Transactions from './Transactions/index';
import SplitPayment from './SplitPayment/index';
import LinkRequest from './LinkRequest/index';
import { useLocation, useRoute } from 'wouter';

const Router = ({ isLogged }) => {
    const [match, params] = useRoute('/pedidos/:cartId?');
    const [matchTransactions, paramsTransactions] = useRoute('/transacoes/:transactionId?/:receivableId?');
    const [matchTransactionsSplit, paramsTransactionsSplit] = useRoute('/transacoes/:transactionId?/split');

    const [location] = useLocation();
    const publicRoutes = {
        '/': <Login />,
        '/login': <Login />,
        '/cadastrar': <Register />,
        '/problemas-acesso': <LoginTrouble navigateTo="/login" />,
        '/reenviar-email': <ResendEmail />,
        '/resetar-senha': <ResetPass />,
        '/confirmar-email': <ConfirmEmail />,
        '/show-info': <ShowInfo />,
    };
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
                            ['Catalogo: Upload de imagens', 'upload-imagem'],
                            //['Catalogo: Upload de imagens/Novo', 'upload-imagens'],
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
            <HeaderBack title="Upload de imagens/Novo" navigateTo="/assessoria">
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
        [match ? location : null]: <UserCart {...params} />,
        // [match && !params.userId ? location : null]: <HeaderBack title='Procurar pedidos' navigateTo='/assessoria'><SearchUserCart /></HeaderBack>,
        // [match && params.userId && !params.requestId ? location : null]: <UserCart />,
        // [match && params.userId && params.requestId ? location : null]: <UserCartItem />,
        '/show-info': <ShowInfo internal={true} />
    };
    return routeMatcher(isLogged, publicRoutes, privateRoutes, <Login />, <NotFound fallback="/" />);
};

Router.propTypes = {
    isLogged: PropTypes.bool.isRequired,
};

export default Router;
