// Cobranca começou a ter comissão 09/2019
const calculoCobranca2020 = cobrancas_mes => {
    if(cobrancas_mes >= 40000){
        return cobrancas_mes * 0.007
    }
        return 0
    
}

export default calculoCobranca2020