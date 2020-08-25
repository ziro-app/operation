import { db } from '../../Firebase/index';

const sendToBackend = state => () => {
    const { supplier, percentage } = state;
    const { docId } = supplier;
    const percent = percentage ? parseFloat(percentage) : -1;

    return new Promise(async (resolve, reject) => {
        try {
            if (percent !== -1) {
                await db.collection('suppliers').doc(docId).update({
                    zoopPlan: {
                        amount: 0,
                        percentage: percent
                    }
                });
                resolve('Plano atualizado');
            } else throw { msg: 'Porcentagem inválida, tente novamente', customError: true };
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
