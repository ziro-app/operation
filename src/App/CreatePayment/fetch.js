import { db } from '../../Firebase/index';

const fetch = (setIsLoading, setErrorLoading, setSuppliers, setFantasyNames, setCatalogBrands) => {
    let query = db.collection('suppliers');

    const suppliers = [];
    const fantasy = [];
    const run = async () => {
        try {
            query.get().then(snapshot => {
                if (!snapshot.empty) {
                    snapshot.forEach(doc => {
                        const { zoopId, fantasia, maxParcelas } = doc.data();
                        if (fantasia && fantasia !== '********') {
                            fantasy.push(fantasia);
                            suppliers.push({ zoopId, fantasia, maxParcelas });
                        }
                    });
                    setSuppliers(suppliers.filter((value, index, self) => self.findIndex(m => m.fantasia === value.fantasia) === index));
                    setFantasyNames(fantasy.filter((value, index, self) => self.findIndex(m => m === value) === index));
                }
            });
            let list = [];
            const snapRef = db.collection('catalog-brands');
            const snapCollection = await snapRef.get();
            snapCollection.forEach(document => {
                if (document.data().brand !== '') list.push(document.data().brand);
            });
            setCatalogBrands(list.filter((value, index, self) => self.findIndex(m => m === value) === index));
        } catch (error) {
            setErrorLoading(true);
        } finally {
            setIsLoading(false);
        }
    };
    run();
};

export default fetch;
