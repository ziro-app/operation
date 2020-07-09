import consultCnpj from './utils/consultCnpj';
import checkResult from './utils/checkResult';
import updateReceita from './utils/updateReceita';

const lastReq = async (config, cnpj) => {
    let result = {};
    try {
        const [status, result] = await consultCnpj(config)
        const objResult = checkResult(status, result, false)
        updateReceita(cnpj, objResult)
        result['ok'] = true
        result['error'] = false
        return result
    } catch (error) {
        result['error'] = error;
        return result
    }
}
const searchCnpj = state => () =>
    new Promise(async (resolve, reject) => {
        const { cnpj, setFirstLabel, setIsOpen } = state;
        let config = {
            method: 'POST',
            url: process.env.CNPJ_URL,
            data: { cnpj, "ignore_db": true },
            headers: {
                'Authorization': process.env.CNPJ_TOKEN
            }
        }
        try {
            setIsOpen(true);
            if (cnpj.length !== 18) throw { msg: 'Deve ter 14 números', customError: true };
            const [status, result] = await consultCnpj(config)
            const objResult = checkResult(status, result, false);
            console.log('HERE')
            updateReceita(cnpj, objResult)
            setIsOpen(false);
            setFirstLabel(true);
            resolve('CNPJ válido');
        } catch (error) {
            if(error.tryAgain){
                setFirstLabel(false);
                await setTimeout(async () => {
                    config['data']['ignore_db'] = false;
                    let resultado = await lastReq(config, cnpj);
                    setIsOpen(false);
                    setFirstLabel(true);
                    if (resultado.error) {
                        reject({ msg: resultado.error.msg, customError: true });
                    }
                    else if (resultado.ok) {
                        resolve('CNPJ válido');
                    }
                    else {
                        reject({ msg: 'Ocorreu um erro, tente novamente', customError: true });
                    }
                }, 30000);
            } else {
                setIsOpen(false);
                setFirstLabel(true);
                reject(error);
            }
        }
    });

export default searchCnpj