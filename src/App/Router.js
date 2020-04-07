import React from 'react'
import PropTypes from 'prop-types'
import { Router2 as routeMatcher} from '@ziro/router'
import Login from './Login/index'
import Register from './Register/index'
import LoginTrouble from '@bit/vitorbarbosa19.ziro.login-trouble'
import ResendEmail from './ResendEmail/index'
import ResetPass from './ResetPass/index'
import ConfirmEmail from '@bit/vitorbarbosa19.ziro.confirm-email'
import { Menu } from './Menu/index'
import { HeaderBack } from './HeaderBack/index'
import MyAccount from '@bit/vitorbarbosa19.ziro.my-account'
import UpdateEmail from './UpdateEmail/index'
import UpdatePass from './UpdatePass/index'
import DeleteAccount from './DeleteAccount/index'
import RegisterStoreowner from './RegisterStoreowner/index'
import UpdateStoreowner from './UpdateStoreowner/index'
import RegisterAffiliate from './RegisterAffiliate/index'
import UpdateAffiliate from './UpdateAffiliate/index'
import RegisterBillet from './RegisterBillet/index'
import ShowInfo from './ShowInfo/index'
import RegisterExpenses from './RegisterExpenses/index'
import ImageUpload from './ImageUpload/index'
import Submenu from '@bit/vitorbarbosa19.ziro.submenu'
import UpdateUserInfo from './UpdateUserInfo/index'
import MaterialRequest from './MaterialRequest/index'
import RegisterInputOutput from './RegisterInputOutput/index'
import NotFound from '@bit/vitorbarbosa19.ziro.not-found'
import UpdateBrandsInfos from './UpdateBrandsInfos'
import UserCart from './UserCart'
import UserCartItem from './UserCartItem'
import { useRoute, useLocation } from 'wouter'


const Router = ({ isLogged }) => {
    const [match,params] = useRoute('/pedidos/:userId/:requestId?')
    const [location] = useLocation()
    const publicRoutes = {
        '/': <Login />,
        '/login': <Login />,
        '/cadastrar': <Register />,
        '/problemas-acesso': <LoginTrouble />,
        '/reenviar-email': <ResendEmail />,
        '/resetar-senha': <ResetPass />,
        '/confirmar-email': <ConfirmEmail />,
        '/show-info': <ShowInfo />
    }
    const privateRoutes = { // Menu can't be put inside the components because then it'll unmount on transition
        '/': <Menu title='Minha Conta'><MyAccount /></Menu>,
        '/conta': <Menu title='Minha Conta'><MyAccount /></Menu>,
        '/trocar-email': <UpdateEmail />,
        '/trocar-senha': <UpdatePass />,
        '/deletar-conta': <DeleteAccount />,
        '/administrativo': <Menu title='Administrativo'><Submenu options={[
            ['Requisição de Material', 'requerir-material'],
            ['Entrada/Saída do Caixa', 'entrada-saida']]} /></Menu>,
        '/assessoria': <Menu title='Assessoria'><Submenu options={[
            ['Cadastrar boleto', 'cadastrar-boleto'],
            ['Cadastrar despesa', 'cadastrar-despesa'],
            ['Upload de imagens', 'upload-imagem'],
            ['Atualizar Fabricantes', '/atualizar-fabricantes'],
            ['Lojista: Cadastrar', '/cadastrar-lojista'],
            ['Lojista: Ver/Editar', '/visualizar-lojista'],
            ['Afiliado: Cadastrar', '/cadastrar-afiliado'],
            ['Afiliado: Ver/Editar', '/visualizar-afiliado']]} /></Menu>,
        '/cadastrar-despesa': <HeaderBack title='Cadastrar despesa' navigateTo='/assessoria'><RegisterExpenses /></HeaderBack>,
        '/cadastrar-boleto': <HeaderBack title='Cadastrar boleto' navigateTo='/assessoria'><RegisterBillet /></HeaderBack>,
        '/requerir-material': <HeaderBack title='Requerir material' navigateTo='/administrativo'><MaterialRequest /></HeaderBack>,
        '/visualizar-lojista': <HeaderBack title='Visualizar lojista' navigateTo='/assessoria'><UpdateStoreowner /></HeaderBack>,
        '/cadastrar-lojista': <HeaderBack title='Cadastrar lojista' navigateTo='/assessoria'><RegisterStoreowner /></HeaderBack>,
        '/cadastrar-afiliado': <HeaderBack title='Cadastrar afiliado' navigateTo='/assessoria'><RegisterAffiliate /></HeaderBack>,
        '/visualizar-afiliado': <HeaderBack title='Visualizar afiliado' navigateTo='/assessoria'><UpdateAffiliate /></HeaderBack>,
        '/upload-imagem': <HeaderBack title='Upload de imagens' navigateTo='/assessoria'><ImageUpload /></HeaderBack>,
        '/update': <HeaderBack title='Atualizar informações' navigateTo='/conta'><UpdateUserInfo /></HeaderBack>,
        '/atualizar-fabricantes': <HeaderBack title='Atualizar fabricantes' navigateTo='/assessoria'><UpdateBrandsInfos /></HeaderBack>,
        '/entrada-saida': <HeaderBack title='Entrada/Saída do Caixa' navigateTo='/administrativo'><RegisterInputOutput /></HeaderBack>,
        '/show-info': <ShowInfo internal={true} />,
        [match&&!params.requestId?location:null]: <HeaderBack title='Pedidos' navigateTo='/conta'><UserCart /></HeaderBack>,
        [match&&params.requestId?location:null]: <HeaderBack title='Pedido' navigateTo={`pedidos/${params && params.userId}`}><UserCartItem /></HeaderBack>
    }
    return routeMatcher(isLogged, publicRoutes, privateRoutes, <Login />, <NotFound fallback='/' />)
}

Router.propTypes = {
    isLogged: PropTypes.bool.isRequired
}

export default Router
