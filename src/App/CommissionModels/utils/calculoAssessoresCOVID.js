// Segunda comissão dos assessores:
// Comissão é de 10% sobre a receita da venda baixada e bonus conforme a quantidade vendida conforme a tabela abaixo:
// Venda 400000      700
// Venda 300000      600
// Venda 200000      450
// Venda 100000      250
// Venda 50000       125
// Calculo com da comissão

const calculoAssessor2020 = (transacionado_mes, receita_mes) => {
    const base = receita_mes * 0.1
    if (transacionado_mes >= 400000) return base + 700
    if (transacionado_mes >= 300000) return base + 600
    if (transacionado_mes >= 200000) return base + 450
    if (transacionado_mes >= 100000) return base + 250
    if (transacionado_mes >= 50000) return base + 125
    return base
}

export default calculoAssessor2020