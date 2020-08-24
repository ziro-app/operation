import { db } from '../../Firebase/index';

const sendToBackend = state => () => {
    const { cnpj, email, type, percentage, setType, clear } = state;
    let field = type ? (type === 'CNPJ' ? 'cnpj' : 'email') : '';
    let value = type ? (type === 'CNPJ' ? cnpj : email) : '';
    let percent = percentage ? parseFloat(percentage) : -1;

    return new Promise(async (resolve, reject) => {
        try {
            if (field && value && percent !== -1) {
                const doc = await db.collection('suppliers').where(field, '==', value).get();
                if (!doc.empty) {
                    const docId = doc.docs[0].id;
                    await db.collection('suppliers').doc(docId).update({
                        zoopPlan: {
                            amount: 0,
                            percentage: percent
                        }
                    });
                    // clear();
                    // setType('');
                    resolve('Plano atualizado');
                } else throw { msg: `Nenhum usuário encontrado para ${field} informado`, customError: true };
            } else throw { msg: 'Campos inválidos, preencha e tente novamente', customError: true };
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
