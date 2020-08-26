import capitalize from '@ziro/capitalize';
import { db } from '../../Firebase/index';

const searchSupplier = state => () => {
    const { cnpj, email, type, setSupplier } = state;
    let field = type ? (type === 'CNPJ' ? 'cnpj' : 'email') : '';
    let value = type ? (type === 'CNPJ' ? cnpj : email) : '';


    return new Promise(async (resolve, reject) => {
        try {
            if (field && value) {
                await db.collection('suppliers').where(field, '==', value).onSnapshot(doc => {
                    if (!doc.empty) {
                        const docId = doc.docs[0].id;
                        const { razao, splitPaymentPlan } = doc.docs[0].data();
                        setSupplier({
                            docId,
                            name: razao ? capitalize(razao) : 'Sem razão social',
                            markupPercentage: (splitPaymentPlan && splitPaymentPlan.markup && splitPaymentPlan.markup.percentage) ? `${splitPaymentPlan.markup.percentage} %` : '0 %',
                            antifraudPercentage: (splitPaymentPlan && splitPaymentPlan.antiFraud && splitPaymentPlan.antiFraud.percentage) ? `${splitPaymentPlan.antiFraud.percentage} %` : '0 %'
                        });
                        resolve();
                    } else throw { msg: `Fabricante não encontrado`, customError: true };
                });
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

};

export default searchSupplier;
