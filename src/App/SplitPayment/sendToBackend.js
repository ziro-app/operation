import axios from 'axios'
import { db } from '../../Firebase/index'

const addRuleToFirebase = () => {}

const sendToBackend = (
  transactionId,
  transactionZoopId,
  on_behalf_of,
  amount,
  validationMessage,
  setValidationMessage,
  chargeType,
  chargeValue,
  setAmount,
  setChargeTypeInput,
  list,
  setList,
  splitName,
  setSplitName,
) => () => {
  return new Promise(async (resolve, reject) => {
    try {
      const snapRef = db.collection('credit-card-payments').doc(transactionId)
      const snapCollection = await snapRef.get()

      if (snapCollection.data()) {
        try {
          if (validationMessage) {
            throw 'Erro nas informações enviadas, verifique se o valor de cobrança não é maior que o da transação'
          }
          let amountToSend = 0
          if (chargeType === 'Porcentagem') amountToSend = parseFloat(amount.replace('R$', '').replace(',', '').replace('.', '')) / 100
          else amountToSend = amount
          await axios
            .post(
              `${process.env.PAY}/split-rules-create?transaction_id=${transactionZoopId}`,
              {
                transaction_id: transactionZoopId,
                recipient: on_behalf_of,
                amount: amountToSend,
              },
              {
                headers: {
                  Authorization: `Basic ${process.env.PAY_TOKEN}`,
                },
              },
            )
            .then(result => {
              const { data } = result
              let listToAdd = list
              data.splitName = splitName
              listToAdd.push(data)
              setList(listToAdd)
              snapRef.update({ split_rules: list })
              const { status } = data
              if (status === 'succeeded') {
                /*transaction.status = 'Aprovado'
                                                document.location.reload(true);*/
              }
              setAmount('')
              setChargeTypeInput('')
              setSplitName('')
              resolve('Regra criada!')
            })
        } catch (e) {
          if (e.response.status === 500) throw { msg: 'Valor das regras ultrapassa o da transação!', customError: true }
          else throw { msg: 'Erro! Entre em contato com o suporte!', customError: true }
          //setValidationMessage('Um erro ocorreu, entre em contato com o TI!');
          throw { msg: 'Valor das regras ultrapassa o da transação!', customError: true }
        }
      } else {
        throw { msg: 'Pagamento não encontrado', customError: true }
      }
    } catch (error) {
      if (error.customError) reject(error)
      else {
        console.log(error)
        if (error.response) console.log(error.response)
        reject(error)
      }
    }
  })
}

export default sendToBackend
