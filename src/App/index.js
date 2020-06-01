import { hot } from "react-hot-loader/root";
import React, { useState, useEffect } from "react";
import { post } from "axios";
import { auth, db } from "../Firebase/index";
import { userContext } from "./appContext";
import InitialLoader from "@bit/vitorbarbosa19.ziro.initial-loader";
import Error from "@bit/vitorbarbosa19.ziro.error";
import ErrorBoundary from "@bit/vitorbarbosa19.ziro.error-boundary";
import Router from "./Router";

const App = () => {
    const [loading, setLoading] = useState(true);
    const [errorLoading, setErrorLoading] = useState(false);
    const [uid, setUid] = useState(null);
    const [name, setName] = useState(null);
    const [nickname, setNickname] = useState(null);
    const [cpf, setCpf] = useState(null);
    const [height, setHeight] = useState(null);
    const [cep, setCep] = useState(null);
    const [city, setCity] = useState(null);
    const [emergencyContact, setEmergencyContact] = useState(null);
    const [initialDate, setInitialDate] = useState(null);
    const [address, setAddress] = useState(null);
    const [cityState, setCityState] = useState(null);
    const [scope, setScope] = useState(null);
    const [maritalStatus, setMaritalStatus] = useState(null);
    const [github, setGithub] = useState(null);
    const [paymentModel, setPaymentModel] = useState(null);
    const [birthDate, setBirthDate] = useState(null);
    const [emergencyName, setEmergencyName] = useState(null);
    const [issuingBody, setIssuingBody] = useState(null);
    const [kinship, setKinship] = useState(null);
    const [weight, setWeight] = useState(null);
    const [rg, setRg] = useState(null);
    const [shippingDate, setShippingDate] = useState(null);
    const [personalPhone, setPersonalPhone] = useState(null);
    const [amountCharged, setAmountCharged] = useState(null);
    const [userPos, setUserPos] = useState(null);
    const [bankNumber, setBankNumber] = useState(null);
    const [accountNumber, setAccountNumber] = useState(null);
    const [agency, setAgency] = useState(null);
    const [listStatusForFilter, setListStatusForFilter] = useState([]);
    const [listSellersForFilter, setListSellersForFilter] = useState([]);

    const url = process.env.SHEET_URL;
    const config = {
        headers: {
            "Content-type": "application/json",
            Authorization: process.env.SHEET_TOKEN,
        },
    };
    const body = {
        apiResource: "values",
        apiMethod: "get",
        range: "Base",
        spreadsheetId: process.env.SHEET_ID,
    };
    useEffect(() => {
        let unsubscribe = () => null;
        return auth.onAuthStateChanged(async (user) => {
            if (user && user.emailVerified) {
                setUid(user.uid);
                // Adding event listener
                unsubscribe = db
                    .collection("team")
                    .where("uid", "==", user.uid)
                    .onSnapshot((snapshot) => {
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
                            } = snapshot.docs[0].data();
                            setName(nome ? nome : "");
                            setNickname(apelido ? apelido : "");
                            setCpf(cpf ? cpf : "");
                            setHeight(altura ? altura : "");
                            setCep(cep ? cep : "");
                            setCity(cidade ? cidade : "");
                            setEmergencyContact(
                                contatoEmergencia ? contatoEmergencia : ""
                            );
                            setInitialDate(dataInicio ? dataInicio : "");
                            setAddress(endereco ? endereco : "");
                            setCityState(estado ? estado : "");
                            setScope(escopo ? escopo : "");
                            setMaritalStatus(estadoCivil ? estadoCivil : "");
                            setGithub(github ? github : "");
                            setPaymentModel(
                                modeloPagamento ? modeloPagamento : ""
                            );
                            setBirthDate(nascimento ? nascimento : "");
                            setEmergencyName(
                                nomeEmergencia ? nomeEmergencia : ""
                            );
                            setIssuingBody(orgExp ? orgExp : "");
                            setKinship(parentesco ? parentesco : "");
                            setWeight(peso ? peso : "");
                            setRg(rg ? rg : "");
                            setShippingDate(shippingDate ? shippingDate : "");
                            setPersonalPhone(telefone ? telefone : "");
                            setAmountCharged(valorCobrado ? valorCobrado : "");
                            setBankNumber(banco ? banco : "");
                            setAccountNumber(conta ? conta : "");
                            setAgency(agencia ? agencia : "");
                        }
                    });
            } else {
                unsubscribe();
                setUid("");
                setName("");
                setNickname("");
                setCpf("");
                setHeight("");
                setCep("");
                setCity("");
                setEmergencyContact("");
                setInitialDate("");
                setAddress("");
                setCityState("");
                setScope("");
                setMaritalStatus("");
                setGithub("");
                setPaymentModel("");
                setEmergencyName("");
                setIssuingBody("");
                setKinship("");
                setWeight("");
                setRg("");
                setShippingDate("");
                setPersonalPhone("");
                setAmountCharged("");
                setBankNumber("");
                setAccountNumber("");
                setAgency("");
            }
        });
    }, []);
    useEffect(() => {
        const getUserData = async () => {
            if (uid) {
                try {
                    const docRef = await db
                        .collection("team")
                        .where("uid", "==", uid)
                        .get();
                    if (!docRef.empty) {
                        docRef.forEach(async (doc) => {
                            const data = doc.data();
                            setName(data.nome);
                            setNickname(data.apelido);
                            setCpf(data.cpf);
                            setHeight(data.altura);
                            setCep(data.cep);
                            setCity(data.cidade);
                            setEmergencyContact(data.contatoEmergencia);
                            setInitialDate(data.dataInicio);
                            setAddress(data.endereco);
                            setCityState(data.estado);
                            setScope(data.escopo);
                            setMaritalStatus(data.estadoCivil);
                            setGithub(data.github);
                            setPaymentModel(data.modeloPagamento);
                            setBirthDate(data.nascimento);
                            setEmergencyName(data.nomeEmergencia);
                            setIssuingBody(data.orgExp);
                            setKinship(data.parentesco);
                            setWeight(data.peso);
                            setRg(data.rg);
                            setShippingDate(data.shippingDate);
                            setPersonalPhone(data.telefone);
                            setAmountCharged(data.valorCobrado);
                            setBankNumber(data.banco);
                            setAccountNumber(data.conta);
                            setAgency(data.agencia);
                            if (userPos === null || userPos === "") {
                                const {
                                    data: { values },
                                } = await post(url, body, config);
                                values.map((user, index) => {
                                    if (user[11] === data.email) {
                                        setUserPos(index + 1);
                                    }
                                });
                            }
                        });
                    }
                    const docRefCreditCardPayments = await db
                        .collection("credit-card-payments")
                        .get();
                    let StatusDocuments = [];
                    let SellersDocuments = [];
                    if (!docRefCreditCardPayments.empty) {
                        docRefCreditCardPayments.forEach(async (doc) => {
                            const data = doc.data();
                            StatusDocuments.push(data.status);
                            SellersDocuments.push(data.seller);
                        });
                    }

                    setListStatusForFilter([...new Set(StatusDocuments)]);
                    setListSellersForFilter([...new Set(SellersDocuments)]);
                } catch (error) {
                    if (error.response) console.log(error.response);
                    else console.log(error);
                    setErrorLoading(true);
                }
            }
            if (uid !== null) setLoading(false); // wait uid to be set to either a value or ''
        };
        getUserData();
    }, [uid]);
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
    };
    if (loading) return <InitialLoader />;
    if (errorLoading) return <Error />;
    return (
        <ErrorBoundary>
            <userContext.Provider value={userData}>
                <Router isLogged={!!uid} />
            </userContext.Provider>
        </ErrorBoundary>
    );
};

export default hot(App);
