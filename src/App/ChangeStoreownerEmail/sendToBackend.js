import { db } from '../../Firebase/index';
import { post } from 'axios';
import { apiResendEmail, generateConfirmLink } from './emailUtils';
import { findLeadRow, findStoreownerRow, findSupplierRow } from './findRows';

const collection = {
    'catalog': 'storeowners',
    'suppliers': 'suppliers'
};

const sendToBackend = state => () => {
    const { email, newEmail, setEmail, setNewEmail } = state;
    const url = process.env.SHEET_URL;
    const config = {
        headers: {
            'Content-type': 'application/json',
            'Authorization': process.env.SHEET_TOKEN
        }
    };

    return new Promise(async (resolve, reject) => {
        try {
            const docUserCollection = await db.collection('users').where('email', '==', email).get();

            if (!docUserCollection.empty) {
                // VERIFICANDO SE O EMAIL É DE UM ADMIN
                let docRefUser, userApp;
                docUserCollection.forEach(user => {
                    userApp = user.data().app
                    docRefUser = user.ref
                });

                if (userApp === 'admin') throw { msg: 'Não permitido para admin', customError: true };
                if (userApp !== 'catalog' && userApp !== 'suppliers') throw { msg: `Não permitido para o app ${userApp}`, customError: true };
                else {
                    const collectionName = collection[userApp];
                    const docCollection = await db.collection(collectionName).where('email', '==', email).get();

                    if (!docCollection.empty) {
                        const uid = docCollection.docs[0].data().uid;
                        const urlChangeEmail = `${process.env.FIREBASE_AUTH_URL}updateUserInfo`;
                        const configChangeEmail = {
                            headers: {
                                'Content-type': 'application/json',
                                'Authorization': process.env.FIREBASE_AUTH_TOKEN
                            }
                        };
                        const bodyChangeEmail = {
                            uid,
                            prop: {
                                email: newEmail,
                                emailVerified: false
                            }
                        };

                        // ATUALIZANDO AS INFORMAÇÕES NO FIREBASE AUTH
                        const { data: { ok } } = await post(urlChangeEmail, bodyChangeEmail, configChangeEmail);

                        if (ok) {
                            // PEGANDO A REF DO DOC STOREOWNER
                            let docRefCollection;
                            docCollection.forEach(doc => docRefCollection = doc.ref);

                            // ATUALIZANDO NAS COLLECTIONS
                            await docRefCollection.update({ email: newEmail });
                            await docRefUser.update({ email: newEmail });

                            // ENVIANDO EMAIL DE CONFIRMAÇÃO
                            try {
                                const link = await generateConfirmLink(newEmail);
                                await apiResendEmail(newEmail, link);
                            } catch (error) {
                                throw { msg: 'Atualizado. Envie email de confirmação manualmente', emailError: true };
                            }

                            if (collectionName === 'storeowners') {
                                const storeownerRow = await findStoreownerRow(email);
                                const leadRow = await findLeadRow(email);
                                if (storeownerRow && storeownerRow !== 0) {
                                    try {
                                        // ATUALIZANDO NA PLANILHA LOJISTAS
                                        const body = {
                                            apiResource: 'values',
                                            apiMethod: 'update',
                                            range: `Base!D${storeownerRow}`,
                                            valueInputOption: 'raw',
                                            spreadsheetId: process.env.SHEET_STOREOWNERS_ID,
                                            resource: {
                                                values: [[newEmail]]
                                            }
                                        };
                                        await post(url, body, config);
                                    } catch (error) {
                                        throw { msg: 'Atualizado. Email de confirmação enviado', sheetError: true };
                                    }
                                }
                                if (leadRow && leadRow !== 0) {
                                    try {
                                        const bodyLeads = {
                                            apiResource: 'values',
                                            apiMethod: 'update',
                                            range: `Base!D${leadRow}`,
                                            valueInputOption: 'raw',
                                            spreadsheetId: process.env.SHEET_LEADS_PRE_ID,
                                            resource: {
                                                values: [[newEmail]]
                                            }
                                        };
                                        await post(url, bodyLeads, config);
                                    } catch (error) {
                                        throw { msg: 'Atualizado. Email de confirmação enviado', sheetError: true };
                                    }
                                }
                            } else {
                                const [supplierRow, collaborator] = await findSupplierRow(email);
                                if (supplierRow && supplierRow !== 0) {
                                    try {
                                        const bodySupplier = {
                                            apiResource: 'values',
                                            apiMethod: 'update',
                                            range: collaborator ? `Colaboradores!C${supplierRow}` : `Base!F${supplierRow}`,
                                            valueInputOption: 'raw',
                                            spreadsheetId: process.env.SHEET_ID_SUPPLIERS,
                                            resource: {
                                                values: [[newEmail]]
                                            }
                                        }
                                        await post(url, bodySupplier, config);
                                    } catch (error) {
                                        throw { msg: 'Atualizado. Email de confirmação enviado', sheetError: true };
                                    }
                                }
                            }
                            setEmail('');
                            setNewEmail('');
                            resolve('Atualizado. Email de confirmação enviado');
                        } else throw { msg: 'Erro ao atualizar. Tente novamente', customError: true };
                    } else throw { msg: 'Usuário não encontrado', customError: true }
                }
            } else throw { msg: 'Usuário não encontrado', customError: true }
        } catch (error) {
            console.log(error);
            if (error.sheetError || error.emailError) {
                setEmail('');
                setNewEmail('');
                resolve(error.msg);
            }
            if (error.customError) reject(error);
            else if (error.response && error.response.data && error.response.data.erro) {
                const { erro, message } = error.response.data;
                console.log(message);
                reject({ msg: erro, customError: true });
            }
            else reject(error);
        }
    })
}

export default sendToBackend
