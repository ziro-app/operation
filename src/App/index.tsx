import { hot } from 'react-hot-loader/root'
import React, { useEffect, useState, Suspense } from 'react'
import axios from 'axios'
import InitialLoader from '@bit/vitorbarbosa19.ziro.initial-loader'
import Error from '@bit/vitorbarbosa19.ziro.error'
import ErrorBoundary from '@bit/vitorbarbosa19.ziro.error-boundary'
import MessageModal from '@bit/vitorbarbosa19.ziro.message-modal'
import { userContext } from './appContext'
import { auth, db } from '../Firebase/index'
import Router from './Router'


const App = () => {
  const [loading, setLoading] = useState(true)
  const [errorLoading, setErrorLoading] = useState(false)
  const [uid, setUid] = useState(null)
  const [name, setName] = useState(null)
  const [nickname, setNickname] = useState(null)
  const [cpf, setCpf] = useState(null)
  const [height, setHeight] = useState(null)
  const [cep, setCep] = useState(null)
  const [city, setCity] = useState(null)
  const [emergencyContact, setEmergencyContact] = useState(null)
  const [initialDate, setInitialDate] = useState(null)
  const [address, setAddress] = useState(null)
  const [cityState, setCityState] = useState(null)
  const [scope, setScope] = useState(null)
  const [maritalStatus, setMaritalStatus] = useState(null)
  const [github, setGithub] = useState(null)
  const [paymentModel, setPaymentModel] = useState(null)
  const [birthDate, setBirthDate] = useState(null)
  const [emergencyName, setEmergencyName] = useState(null)
  const [issuingBody, setIssuingBody] = useState(null)
  const [kinship, setKinship] = useState(null)
  const [weight, setWeight] = useState(null)
  const [rg, setRg] = useState(null)
  const [shippingDate, setShippingDate] = useState(null)
  const [personalPhone, setPersonalPhone] = useState(null)
  const [amountCharged, setAmountCharged] = useState(null)
  const [userPos, setUserPos] = useState(null)
  const [bankNumber, setBankNumber] = useState(null)
  const [accountNumber, setAccountNumber] = useState(null)
  const [agency, setAgency] = useState(null)
  const [listStatusForFilter, setListStatusForFilter] = useState([])
  const [listSellersForFilter, setListSellersForFilter] = useState([])
  const [device, setDevice] = useState('phone')

  const url = process.env.SHEET_URL
  const config = {
    headers: {
      'Content-type': 'application/json',
      Authorization: process.env.SHEET_TOKEN,
    },
  }
  const body = {
    apiResource: 'values',
    apiMethod: 'get',
    range: 'Base',
    spreadsheetId: process.env.SHEET_ID,
  }
  useEffect(() => {
    const smallMobile = window.matchMedia('(max-width: 399px)')
    const mobile = window.matchMedia('(min-width: 400px) and (max-width: 1199px)')
    const desktop = window.matchMedia('(min-width: 1200px)')
    // define user device
    if (smallMobile.matches) setDevice('smallMobile')
    if (mobile.matches) setDevice('mobile')
    if (desktop.matches) setDevice('desktop')
    // define listeners
    const listenerSmallMobile = ({ matches }) => {
      if (matches) setDevice('smallMobile')
    }
    const listenerMobile = ({ matches }) => {
      if (matches) setDevice('mobile')
    }
    const listenerDesktop = ({ matches }) => {
      if (matches) setDevice('desktop')
    }
    // add listeners
    smallMobile.addListener(listenerSmallMobile)
    mobile.addListener(listenerMobile)
    desktop.addListener(listenerDesktop)
    // cleanup
    return () => smallMobile.removeListener(listenerSmallMobile)
    return () => mobile.removeListener(listenerMobile)
    return () => desktop.removeListener(listenerDesktop)
  }, [])
  useEffect(() => {
    let unsubscribe = () => null
    return auth.onAuthStateChanged(async user => {
      if (user && user.emailVerified) {
        setUid(user.uid)
        // Adding event listener
        unsubscribe = db
          .collection('team')
          .where('uid', '==', user.uid)
          .onSnapshot(snapshot => {
            if (!snapshot.empty) {
              const {
                nome,
                apelido,
                cpf,
                altura,
                cep,
                cidade,
                contatoEmergencia,
                dataInicio,
                endereco,
                estado,
                escopo,
                estadoCivil,
                github,
                modeloPagamento,
                nascimento,
                nomeEmergencia,
                orgExp,
                parentesco,
                peso,
                rg,
                shippingDate,
                telefone,
                valorCobrado,
                banco,
                conta,
                agencia,
              } = snapshot.docs[0].data()
              setName(nome || '')
              setNickname(apelido || '')
              setCpf(cpf || '')
              setHeight(altura || '')
              setCep(cep || '')
              setCity(cidade || '')
              setEmergencyContact(contatoEmergencia || '')
              setInitialDate(dataInicio || '')
              setAddress(endereco || '')
              setCityState(estado || '')
              setScope(escopo || '')
              setMaritalStatus(estadoCivil || '')
              setGithub(github || '')
              setPaymentModel(modeloPagamento || '')
              setBirthDate(nascimento || '')
              setEmergencyName(nomeEmergencia || '')
              setIssuingBody(orgExp || '')
              setKinship(parentesco || '')
              setWeight(peso || '')
              setRg(rg || '')
              setShippingDate(shippingDate || '')
              setPersonalPhone(telefone || '')
              setAmountCharged(valorCobrado || '')
              setBankNumber(banco || '')
              setAccountNumber(conta || '')
              setAgency(agencia || '')
            }
          })
      } else {
        unsubscribe()
        setUid('')
        setName('')
        setNickname('')
        setCpf('')
        setHeight('')
        setCep('')
        setCity('')
        setEmergencyContact('')
        setInitialDate('')
        setAddress('')
        setCityState('')
        setScope('')
        setMaritalStatus('')
        setGithub('')
        setPaymentModel('')
        setEmergencyName('')
        setIssuingBody('')
        setKinship('')
        setWeight('')
        setRg('')
        setShippingDate('')
        setPersonalPhone('')
        setAmountCharged('')
        setBankNumber('')
        setAccountNumber('')
        setAgency('')
      }
    })
  }, [])
  useEffect(() => {
    const getUserData = async () => {
      if (uid) {
        try {
          const docRef = await db.collection('team').where('uid', '==', uid).get()
          if (!docRef.empty) {
            docRef.forEach(async doc => {
              const data = doc.data()
              setName(data.nome)
              setNickname(data.apelido)
              setCpf(data.cpf)
              setHeight(data.altura)
              setCep(data.cep)
              setCity(data.cidade)
              setEmergencyContact(data.contatoEmergencia)
              setInitialDate(data.dataInicio)
              setAddress(data.endereco)
              setCityState(data.estado)
              setScope(data.escopo)
              setMaritalStatus(data.estadoCivil)
              setGithub(data.github)
              setPaymentModel(data.modeloPagamento)
              setBirthDate(data.nascimento)
              setEmergencyName(data.nomeEmergencia)
              setIssuingBody(data.orgExp)
              setKinship(data.parentesco)
              setWeight(data.peso)
              setRg(data.rg)
              setShippingDate(data.shippingDate)
              setPersonalPhone(data.telefone)
              setAmountCharged(data.valorCobrado)
              setBankNumber(data.banco)
              setAccountNumber(data.conta)
              setAgency(data.agencia)
              if (userPos === null || userPos === '') {
                const {
                  data: { values },
                } = await axios.post(url, body, config)
                values.map((user, index) => {
                  if (user[11] === data.email) {
                    setUserPos(index + 1)
                  }
                })
              }
            })
          }
          const docRefCreditCardPayments = await db.collection('credit-card-payments').get()
          const StatusDocuments = []
          const SellersDocuments = []
          if (!docRefCreditCardPayments.empty) {
            docRefCreditCardPayments.forEach(async doc => {
              const data = doc.data()
              StatusDocuments.push(data.status)
              SellersDocuments.push(data.seller)
            })
          }

          setListStatusForFilter([...new Set(StatusDocuments)])
          setListSellersForFilter([...new Set(SellersDocuments)])
        } catch (error) {
          if (error.response) console.log(error.response)
          else console.log(error)
          setErrorLoading(true)
        }
      }
      if (uid !== null) setLoading(false) // wait uid to be set to either a value or ''
    }
    getUserData()
  }, [uid])
  const userData = {
    uid,
    userPos,
    name,
    nickname,
    cpf,
    height,
    cep,
    city,
    emergencyContact,
    initialDate,
    address,
    cityState,
    scope,
    maritalStatus,
    github,
    paymentModel,
    birthDate,
    emergencyName,
    issuingBody,
    kinship,
    weight,
    rg,
    shippingDate,
    personalPhone,
    amountCharged,
    bankNumber,
    accountNumber,
    agency,
    listStatusForFilter,
    listSellersForFilter,
    device,
  }
  if (loading) return <InitialLoader />
  if (errorLoading) return <Error />
  return (
    <ErrorBoundary>
      <Suspense fallback={<InitialLoader />}>
        <MessageModal reactfire>
          <userContext.Provider value={userData}>
            <Router isLogged={!!uid} />
          </userContext.Provider>
        </MessageModal>
      </Suspense>
    </ErrorBoundary>
  )
}

export default hot(App)
