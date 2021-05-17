import { post } from 'axios';
import { db } from '../../Firebase/index';

const collectionsApp = {
    'Catálogo': 'storeowners',
    'Fabricantes': 'suppliers'
};

const sendToBackend = state => () => {
    const { cnpj, email, type, app, setCnpj, setEmail, setType, setApp,
        setIsOpen, setResendingEmail, setResendStatus, setFinished,
        setUid, setAppName } = state;
    const url = `${process.env.FIREBASE_AUTH_URL}checkEmail`;
    const config = {
        headers: {
            'Content-type': 'application/json',
            'Authorization': process.env.FIREBASE_AUTH_TOKEN
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
                let snap;
                snap = await db.collection(collectionName).where('cnpj', '==', cnpj).get();
                if (!snap.empty) {
                    setUid(snap.docs[0].data().uid);
                    setEmail(snap.docs[0].data().email);
                    setAppName(app === 'Catálogo' ? 'catalog' : 'suppliers');
                    body = {
                        email: snap.docs[0].data().email,
                        type
                    };
                } else throw { msg: 'Usuário não encontrado no app', customError: true };
            }
            const { data: { ok } } = await post(url, body, config);
            if (!ok) {
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
                resolve('Email já está validado');
            };
        } catch (error) {
            console.log(error);
            if (error.customError) reject(error);
            else if (error.response && error.response.data && error.response.data.erro) {
                const { erro, message } = error.response.data;
                console.log(message);
                reject({ msg: erro, customError: true });
            }
            else reject(error);
        }
    });
}

export default sendToBackend;
