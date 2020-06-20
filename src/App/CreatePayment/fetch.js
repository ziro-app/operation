import { db } from '../../Firebase/index';

const fetch = (setIsLoading, setErrorLoading, setSuppliers, setFantasyNames, setCatalogBrands) => {
    let query = db.collection('suppliers');

    const suppliers = [];
    const fantasy = [];
    const run = async () => {
        try {
            query.onSnapshot(snapshot => {
                if (!snapshot.empty) {
                    snapshot.forEach(doc => {
                        const { zoopId, fantasia } = doc.data();
                        if (fantasia && fantasia !== '********') {
                            fantasy.push(fantasia);
                            suppliers.push({ zoopId, fantasia });
                        }
                    });
                    setSuppliers(suppliers);
                    setFantasyNames(fantasy);
                }
            });
            let list = [];
            const snapRef = db.collection('catalog-brands');
            const snapCollection = await snapRef.get();
            snapCollection.forEach(document => {
                if (document.data().brand !== '') list.push(document.data().brand);
            });
            setCatalogBrands(list);
        } catch (error) {
            setErrorLoading(true);
        } finally {
            setIsLoading(false);
        }
  };
  run();
};

export default fetch;
