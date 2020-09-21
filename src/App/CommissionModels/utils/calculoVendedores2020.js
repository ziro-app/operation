const calculoVendedores2020 = (
    qtd_novos_cadastros_completos,
    qtd_primeira_transacao_quinhentos,
    qtd_primeiros_dezmil,
    qtd_primeiros_cemmil
) => {
    return qtd_novos_cadastros_completos*10 + qtd_primeira_transacao_quinhentos*20 + qtd_primeiros_dezmil*100 + qtd_primeiros_cemmil*100
}

export default calculoVendedores2020