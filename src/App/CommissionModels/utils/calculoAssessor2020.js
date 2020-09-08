// Segunda comissão dos assessores:
// Comissão é de 10% sobre a receita da venda e bonus conforme a quantidade vendida conforme a tabela abaixo:
// 100000	500
// 200000	900
// 300000	1200
// 400000	1400
// Calculo com da comissão
const calculoAssessor2020 = (transacionado_mes, receita_mes) => {
    const base = receita_mes * 0.1
    if (transacionado_mes >= 400000) return base + 1400
    if (transacionado_mes >= 300000) return base + 1200
    if (transacionado_mes >= 200000) return base + 900
    if (transacionado_mes >= 100000) return base + 500
    return base
}

export default calculoAssessor2020