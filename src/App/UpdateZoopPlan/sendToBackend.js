import { db } from '../../Firebase/index';

const sendToBackend = state => () => {
    const { supplier, markupPercentage, antifraudPercentage } = state;
    const { docId } = supplier;
    const percentMarkup = markupPercentage ? parseFloat(markupPercentage) : -1;
    const percentAntifraud = antifraudPercentage ? parseFloat(antifraudPercentage) : -1;

    return new Promise(async (resolve, reject) => {
        try {
            if (percentMarkup !== -1 && percentAntifraud) {
                await db.collection('suppliers').doc(docId).update({
                    splitPaymentPlan: {
                        antiFraud: {
                            amount: 0,
                            percentage: percentAntifraud
                        },
                        markup: {
                            amount: 0,
                            percentage: percentMarkup
                        }
                    }
                });
                resolve('Plano atualizado');
            } else throw { msg: 'Valores inválidos, tente novamente', customError: true };
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
