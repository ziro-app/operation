import { db } from '../../Firebase/index';

const fetch = (state) => {
    const run = async () => {
        const {setIsLoading, setError, setApelidos} = state
        const query = db.collection('team').where('dataFim', '==', '-')
        try {
            await query.onSnapshot(
                async snapshot => {
                    const arrayApelidos = []
                    snapshot.forEach(doc => {
                        arrayApelidos.push(doc.data().apelido)
                    })
                    setApelidos(arrayApelidos)
                })
                setIsLoading(false)
        } catch (error) {
            console.log(error);
            setError(true);
        }
        finally{
            setIsLoading(false)
        }
    }
    run();
}

export default fetch;
