// Prospecção
// Função atual recebe 1000 se tiver mais de 100000 de transação começou 01/2020
const calculoVendas2020 = (
    transacao_mes_afiliado,
    receita_mes_novo_afiliado,
    receita_mes_antigo_afiliado
) => {
    if (transacao_mes_afiliado >= 100000)
        return (
            receita_mes_novo_afiliado * 0.2 + receita_mes_antigo_afiliado * 0.1 + 1000
        )
    return receita_mes_novo_afiliado * 0.2 + receita_mes_antigo_afiliado * 0.1
}
  
export default calculoVendas2020