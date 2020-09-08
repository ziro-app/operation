const calculoAtendimento2020 = transacionado_mes => {
    if(transacionado_mes < 1000000) return transacionado_mes*0.0015
    if(transacionado_mes < 2000000) return 1500 + (transacionado_mes-1000000)*0.0010
    if(transacionado_mes < 3000000) return 1500 + 1000 + (transacionado_mes-2000000)*0.0005
}
  
export default calculoAtendimento2020
  