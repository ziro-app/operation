const checkResult = (status, result, ignoreDb) => {
    if (status) {
        const objResult = {};
        // validations
        const isActive = result.situacao === 'ATIVA';
        if (!isActive) {
            if (ignoreDb) throw { msg: 'CNPJ não está ativo', finally: true };
            else throw { msg: 'CNPJ não está ativo', tryAgain: true };
        }
        objResult.reason = result.nome;
        objResult.fantasia = result.fantasia;
        objResult.street = result.logradouro;
        objResult.number = result.numero;
        objResult.complement = result.complemento;
        objResult.neighborhood = result.bairro;
        objResult.cep = result.cep.replace('.', '');
        objResult.city = result.municipio;
        objResult.cityState = result.uf;
        objResult.fone = result.telefone;
        return objResult;
    } throw { msg: 'CNPJ inválido na Receita', customError: true };
};

export default checkResult;