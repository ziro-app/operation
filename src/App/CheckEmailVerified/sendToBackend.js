import { post } from 'axios';
import { db } from '../../Firebase/index';

const collectionsApp = {
    'Catálogo': 'storeowners',
    'Fabricantes': 'suppliers'
};

const sendToBackend = state => () => {
    const { cnpj, email, type, app, setCnpj, setEmail, setType, setApp,
        setIsOpen, setResendingEmail, setResendStatus, setLink, setFinished } = state;
    const url = `${process.env.FIREBASE_AUTH_URL}resendConfirmEmail`;
    const config = {
        headers: {
            'Content-type': 'application/json'
        }
    };

    return new Promise(async (resolve, reject) => {
        try {
            let body;
            if (type === 'Email') {
                body = {
                    email,
                    type
                };
            } else {
                const collectionName = collectionsApp[app];
                let uid = '';
                let snap;
                if (type === 'CNPJ') {
                    snap = await db.collection(collectionName).where('cnpj', '==', cnpj).get();
                    if (!snap.empty) {
                        uid = snap.docs[0].data().uid;
                        setEmail(snap.docs[0].data().email);
                    }
                    else throw { msg: 'Usuário não encontrado no app', customError: true };
                } else {
                    snap = await db.collection(collectionName).where('email', '==', cnpj).get();
                    if (!snap.empty) uid = snap.docs[0].data().uid;
                    else throw { msg: 'Usuário não encontrado no app', customError: true };
                }
                body = {
                    type,
                    uid,
                    app: app === 'Catálogo' ? 'catalog' : 'suppliers'
                };
            }
            const { data: { ok, link } } = await post(url, body, config);
            if (!ok) {
                setLink(link);
                setType('');
                setIsOpen(true);
                setResendingEmail(false);
                setFinished(false);
                setResendStatus('Usuário não confirmou seu email. Deseja reenviar o email de confirmação?');
                resolve('');
            } else {
                setType('');
                setEmail('');
                setCnpj('');
                setApp('');
                resolve('Usuário possui email validado');
            };
        } catch (error) {
            console.log(error);
            if (error.customError) reject(error);
            if (error.response) reject({ msg: 'Não cadastrado no app', customError: true });
            reject(error);
        }
    });
}

export default sendToBackend;
