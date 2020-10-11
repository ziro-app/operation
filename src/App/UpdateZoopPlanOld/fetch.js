import capitalize from '@ziro/capitalize';
import { db } from '../../Firebase/index';

const fetch = (setIsLoading, setErrorLoading, setSuppliers, setBlocks, mountBlock) => {
    const run = async () => {
        try {
            const fantasyList = [];
            const suppliers = [];
            const query = await db.collection('suppliers').get();
            if (!query.empty) {
                query.forEach(sup => {
                    const docId = sup.id;
                    const { fantasia, razao, sellerZoopPlan, nome, sobrenome } = sup.data();
                    const name = fantasia ? fantasyList.includes(fantasia) ? capitalize(`${fantasia} - ${nome}`) : capitalize(fantasia) : `${nome} ${sobrenome}`;
                    fantasyList.push(fantasia);
                    suppliers.push({
                        docId,
                        name,
                        reason: razao ? capitalize(razao) : '-',
                        markupPercentage: (sellerZoopPlan && sellerZoopPlan.markup && sellerZoopPlan.markup.percentage) ? `${sellerZoopPlan.markup.percentage} %` : '0 %',
                        antifraudPercentage: (sellerZoopPlan && sellerZoopPlan.antiFraud && sellerZoopPlan.antiFraud.percentage) ? `${sellerZoopPlan.antiFraud.percentage} %` : '0 %'
                    });
                });
            }
            setSuppliers(suppliers);
            setBlocks(mountBlock('', '', '', ''));
            setErrorLoading(false);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setErrorLoading(true);
            setIsLoading(false);
        }
    };
    run();
};

export default fetch;
