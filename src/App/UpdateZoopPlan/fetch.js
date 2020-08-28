import { db } from '../../Firebase/index';
import capitalize from '@ziro/capitalize';

const fetch = (setIsLoading, setErrorLoading, setSuppliers, setBlocks, mountBlock) => {
    const run = async () => {
        try {
            const fantasyList = [];
            const suppliers = [];
            const query = await db.collection('suppliers').get();
            if (!query.empty) {
                query.forEach(sup => {
                    const docId = sup.id;
                    const { fantasia, razao, splitPaymentPlan, nome, sobrenome } = sup.data();
                    const name = fantasia ? fantasyList.includes(fantasia) ? capitalize(`${fantasia} - ${nome}`) : capitalize(fantasia) : `${nome} ${sobrenome}`;
                    fantasyList.push(fantasia);
                    suppliers.push({
                        docId,
                        name,
                        reason: razao ? capitalize(razao) : '-',
                        markupPercentage: (splitPaymentPlan && splitPaymentPlan.markup && splitPaymentPlan.markup.percentage) ? `${splitPaymentPlan.markup.percentage} %` : '0 %',
                        antifraudPercentage: (splitPaymentPlan && splitPaymentPlan.antiFraud && splitPaymentPlan.antiFraud.percentage) ? `${splitPaymentPlan.antiFraud.percentage} %` : '0 %'
                    });
                });
            }
            setSuppliers(suppliers);
            setBlocks(mountBlock('', '', '', ''));
            setErrorLoading(false);
            setIsLoading(false);
        } catch (error) {
            setErrorLoading(true);
        } finally {
            setIsLoading(false);
        }
    };
    run();
};

export default fetch;
