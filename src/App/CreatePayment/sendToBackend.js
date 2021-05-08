import { db, fs } from '../../Firebase/index'

const sendToBackend = state => () => {
  const {
    nickname,
    seller,
    onBehalfOfBrand,
    setBrand,
    sellerId,
    charge,
    installmentsMax,
    setFantasy,
    setCharge,
    setInstallmentsMax,
    observations,
    setObservations,
    hasSellerZoopPlan,
    setInsurenceDropdownValue,
    insurance,
    setInsurance,
    checkoutWithoutRegister,
    setCheckoutWithoutRegister,
  } = state
  const nome = nickname ? nickname.trim() : ''
  const baseUrl = process.env.HOMOLOG ? 'http://localhost:8080/pagamento/' : 'https://ziro.app/pagamento/'
  const nowDate = fs.FieldValue.serverTimestamp()
  const allowedUsers = [
    'Uiller',
    'Vitor',
    'Bruno',
    'João',
    'Cesar',
    'Ale',
    'Vivian',
    'Elisa',
    'Paulo',
    'Antonio',
    'Russi',
    'David',
    'Claudia',
    'Fernanda',
  ]
  return new Promise(async (resolve, reject) => {
    try {
      if (process.env.HOMOLOG ? true : allowedUsers.includes(nome)) {
        if (seller && sellerId) {
          let sellerZoopPlan = null
          if (hasSellerZoopPlan) {
            const fetchedStandardPlan = await db.collection('suppliers').where('fantasia', '==', seller.toUpperCase()).get()
            fetchedStandardPlan.forEach(supplier => (sellerZoopPlan = supplier.data().sellerZoopPlan))
          }
          const docRef = await db.collection('credit-card-payments').add({
            dateLinkCreated: nowDate,
            dateLastUpdate: nowDate,
            seller,
            onBehalfOfBrand,
            sellerZoopId: sellerId,
            charge,
            installmentsMax: `${parseInt(installmentsMax)}`,
            status: 'Aguardando Pagamento',
            observations,
            insurance: insurance !== null ? insurance : true,
            sellerZoopPlan: sellerZoopPlan || null,
            checkoutWithoutRegister: checkoutWithoutRegister || false,
          })
          try {
            const doc = await docRef.get()
            if (doc) {
              await navigator.clipboard.writeText(`${baseUrl}${doc.id}`)
            }
          } catch (error) {
            throw { msg: 'Erro ao realizar a cópia', copyError: true }
          }
          resolve('Link copiado')
          setFantasy('')
          setBrand('')
          setCharge('')
          setInstallmentsMax('')
          setObservations('')
          setInsurance(null)
          setInsurenceDropdownValue('')
          setCheckoutWithoutRegister(false)
        } else {
          throw { msg: 'Vendedor não encontrado', customError: true }
        }
      } else throw { msg: 'Permissão insuficiente', customError: true }
    } catch (error) {
      if (error.copyError) {
        resolve('Link criado. Acesse na aba de vendas')
        setFantasy('')
        setBrand('')
        setCharge('')
        setInstallmentsMax('')
        setObservations('')
        setInsurance(null)
        setInsurenceDropdownValue('')
        setCheckoutWithoutRegister(false)
      }
      if (error.customError) reject(error)
      else {
        console.log(error)
        if (error.response) console.log(error.response)
        reject('Erro ao criar cobrança')
      }
    }
  })
}

export default sendToBackend
