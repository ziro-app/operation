import axios from 'axios'
import { db } from '../../Firebase/index';

const options = {
        'method' : 'GET',
        'url':`${process.env.URL_PROVIDERS.split('/listPayments')[0]}/listTeam`,
        'headers' : {
            'Authorization':process.env.TOKEN_PROVIDERS
        }
    }

const fetch = (state) => {
    const run = async () => {
        const {setIsLoading, setError, setApelidos, setDataReajuste} = state
        const query = db.collection('team').where('dataFim', '==', '-')
        try {
            const result = await axios(options)
            setDataReajuste(result.data)
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
