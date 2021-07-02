import consultCnpj from './utils/consultCnpj';
import checkResult from './utils/checkResult';
import updateReceita from './utils/updateReceita';

const lastReq = async (config, cnpj, setErrorMsg, validCnaes, setStoreowner) => {
    let result = {};
    try {
        const [status, result] = await consultCnpj(config)
        const objResult = checkResult(status, result, false, validCnaes)
        updateReceita(cnpj, objResult, setErrorMsg, setStoreowner)
        result['ok'] = true
        result['error'] = false
        return result
    } catch (error) {
        result['error'] = error;
        return result
    }
}
const searchCnpj = (state, setStoreowner) => () =>
    new Promise(async (resolve, reject) => {
        const { cnpj, setFirstLabel, setIsOpen, setErrorMsg, validCnaes } = state;
        let config = {
            method: 'POST',
            url: 'https://query-cnpj.netlify.app/.netlify/functions/cnpj',
            data: { cnpj, "ignore_db": true },
            headers: {
                'Authorization': process.env.CNPJ_TOKEN
            }
        }
        try {
            setIsOpen(true);
            if (cnpj.length !== 18) {
                setErrorMsg('CNPJ Deve ter 14 números')
                throw { msg: 'Deve ter 14 números', customError: true }
            }
            const [status, result] = await consultCnpj(config)
            const objResult = checkResult(status, result, false, validCnaes);
            console.log('HERE')
            updateReceita(cnpj, objResult, setErrorMsg, setStoreowner)
            setIsOpen(false);
            setFirstLabel(true);
            resolve('CNPJ válido');
        } catch (error) {
            if (error.tryAgain) {
                setFirstLabel(false);
                await setTimeout(async () => {
                    config['data']['ignore_db'] = false;
                    let resultado = await lastReq(config, cnpj, setErrorMsg, validCnaes, setStoreowner);
                    setIsOpen(false);
                    setFirstLabel(true);
                    if (resultado.error) {
                        setErrorMsg(resultado.error.msg)
                        reject({ msg: resultado.error.msg, customError: true });
                    }
                    else if (resultado.ok) {
                        resolve('CNPJ válido');
                    }
                    else {
                        setErrorMsg('Ocorreu um erro, tente novamente')
                        reject({ msg: 'Ocorreu um erro, tente novamente', customError: true });
                    }
                }, 30000);
            } else {
                setIsOpen(false);
                setFirstLabel(true);
                setErrorMsg(error.msg || 'Ocorreu um error, favor tentar novamente ou entrar em contato com o responsável.')
                reject(error);
            }
        }
    });

export default searchCnpj
