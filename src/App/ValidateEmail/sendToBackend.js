import { post } from 'axios';
import { db } from '../../Firebase/index';

const sendToBackend = state => () => {
    const { email, setEmail, setUid, setIsOpen, setResendingEmail,
        setResendStatus, setFinished } = state;
    const url = `${process.env.FIREBASE_AUTH_URL}checkEmail`;
    const config = {
        headers: {
            'Content-type': 'application/json'
        }
    };

    return new Promise(async (resolve, reject) => {
        try {
            const doc = await db.collection('users').where('email', '==', email).get();
            if (!doc.empty) {
                const body = { email };
                const { data: { ok, uid } } = await post(url, body, config);
                if (ok) {
                    setEmail('');
                    setUid('');
                    setResendStatus('');
                    setResendingEmail(false);
                    setFinished(false);
                    setIsOpen(false);
                    resolve('Email validado');
                } else {
                    resolve();
                    setUid(uid);
                    setResendStatus('Email não validado. Deseja validar este email ?');
                    setResendingEmail(false);
                    setFinished(false);
                    setIsOpen(true);
                }
            } else throw { msg: 'Usuário não encontrado', customError: true };
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

export default sendToBackend;
