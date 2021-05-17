import { db } from '../../Firebase/index'
import { post } from 'axios'

const updateSheet = async (row, endDate) => {
    const url = process.env.SHEET_URL
    const body = {
        apiResource: 'values',
        apiMethod: 'update',
        range: `Base!S${row}`,
        valueInputOption: 'user_entered',
        spreadsheetId: process.env.SHEET_ID,
        resource: {
            values: [[endDate]]
        }
    }
    const config = {
        headers: {
            'Content-type': 'application/json',
            'Authorization': process.env.SHEET_TOKEN
        }
    }
    try {
        await post(url, body, config);
    } catch (error) {
        throw error;
    }
}

const sendToBackend = state => () => {
    const { selectedUser: { email, row }, endDate, setSelectedUser, setSelectedName, setEndDate } = state
    return new Promise(async (resolve, reject) => {
        try {
            const docCollection = await db.collection('team').where('email', '==', email).get()
            const docUserCollection = await db.collection('users').where('email', '==', email).get()
            if (!docCollection.empty && !docUserCollection.empty) {
                const uid = docCollection.docs[0].data().uid;
                const urlDeleteUser = `${process.env.FIREBASE_AUTH_URL}deleteAuthUser`;
                const configDeleteUser = {
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': process.env.FIREBASE_AUTH_TOKEN
                    }
                };
                const bodyDeleteUser = { uid };

                // DELETANDO NO FIREBASE AUTH
                const { data: { ok } } = await post(urlDeleteUser, bodyDeleteUser, configDeleteUser);

                if (ok) {

                    try {
                        // PEGANDO A REF DO DOC USERS
                        let docRefUser
                        docUserCollection.forEach(user => docRefUser = user.ref)

                        // PEGANDO A REF DO DOC TEAM
                        let docRefCollection
                        docCollection.forEach(doc => docRefCollection = doc.ref)

                        // ATUALIZANDO NA COLLECTION TEAM
                        await docRefCollection.update({ dataFim: endDate })

                        // DELETANDO NA COLLECTION USERS
                        await docRefUser.delete()
                    } catch (error) {
                        throw { msg: 'Login excluído. Atualize os outros campos manualmente', firebaseError: true };
                    }

                    try {
                        await updateSheet(row, endDate);
                    } catch (error) {
                        throw { msg: 'Excluído. Atualize a planilha manualmente', sheetsError: true };
                    }
                    setSelectedUser({ 'nome': '', 'email': '', 'row': '' });
                    setSelectedName('');
                    setEndDate('');
                    resolve('Usuário deletado com sucesso');
                } else throw { msg: 'Erro ao excluir usuário', customError: true }
            } else throw { msg: 'Usuário não encontrado', customError: true }
        } catch (error) {
            console.log(error);
            if (error.firebaseError || error.sheetsError) {
                setSelectedUser({ 'nome': '', 'email': '', 'row': '' });
                setSelectedName('');
                setEndDate('');
                resolve(error.msg);
            }
            else if (error.customError) reject(error);
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
