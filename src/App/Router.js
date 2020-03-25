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
import ImageUpload from './ImageUpload/index'
import Submenu from '@bit/vitorbarbosa19.ziro.submenu'
import UpdateUserInfo from './UpdateUserInfo/index'
import MaterialRequest from './MaterialRequest/index'
import RegisterInputOutput from './RegisterInputOutput/index'
import NotFound from '@bit/vitorbarbosa19.ziro.not-found'
import UpdateBrandsInfos from './UpdateBrandsInfos'


const Router = ({ isLogged }) => {
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
            ['Upload de imagens', 'upload-imagem'],
            ['Atualizar Fabricantes', '/atualizar-fabricantes'],
            ['Lojista: Cadastrar', '/cadastrar-lojista'],
            ['Lojista: Ver/Editar', '/visualizar-lojista'],
            ['Afiliado: Cadastrar', '/cadastrar-afiliado'],
            ['Afiliado: Ver/Editar', '/visualizar-afiliado']]} /></Menu>,
        '/cadastrar-boleto': <Menu title='Cadastrar boleto'><RegisterBillet /></Menu>,
        '/requerir-material': <Menu title='Requerir material'><MaterialRequest /></Menu>,
        '/visualizar-lojista': <Menu title='Visualizar lojista'><UpdateStoreowner /></Menu>,
        '/cadastrar-lojista': <Menu title='Cadastrar lojista'><RegisterStoreowner /></Menu>,
        '/cadastrar-afiliado': <Menu title='Cadastrar afiliado'><RegisterAffiliate /></Menu>,
        '/visualizar-afiliado': <Menu title='Visualizar afiliado'><UpdateAffiliate /></Menu>,
        '/upload-imagem': <Menu title='Upload de imagens'><ImageUpload /></Menu>,
        '/update': <Menu title='Atualizar informações'><UpdateUserInfo /></Menu>,
        '/atualizar-fabricantes': <Menu title='Atualizar fabricantes' ><UpdateBrandsInfos /></Menu>,
        '/entrada-saida': <Menu title='Entrada/Saída do Caixa' ><RegisterInputOutput /></Menu>,
        '/show-info': <ShowInfo internal={true} />
    }
    return routeMatcher(isLogged, publicRoutes, privateRoutes, <Login />, <NotFound fallback='/' />)
}

Router.propTypes = {
    isLogged: PropTypes.bool.isRequired
}

export default Router
