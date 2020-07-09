import consultCnpj from './consultCnpj';
import checkResult from './checkResult';
import updateReceita from './updateReceita';

const handleError = async ({ cnpj, setReason, setFantasia, validCnaes, setFirstLabel, setIsOpen, ...rest }, error) => {
    if (error.customError) return error;
    if (error.tryAgain) {
        const config = {
            method: 'POST',
            url: process.env.CNPJ_URL,
            data: {
                cnpj,
                ignore_db: false
            },
            headers: {
                'Content-Type':'application/json',
                'Authorization': process.env.CNPJ_TOKEN
            }
        };
        try {
            setReason('');
            setFantasia('');
            setIsOpen(true);
            setFirstLabel(true);
            const [status, result] = await consultCnpj(config);
            const objResult = checkResult(status, result, validCnaes, true);
            updateReceita(objResult);
            return { msg: 'CNPJ válido', success: true };
        } catch (error) {
            if (error.customError || error.tryAgain) return error;
            if (error.finally) return { msg: error.msg, customError: true };
            return { msg: 'Erro ao validar CNPJ, tente novamente.', customError: true };
        }
    }
    else return { msg: 'Erro na validação, tente novamente.', customError: true };
};

export default handleError