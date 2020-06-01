import { post } from 'axios';
import { readAndCompressImage } from 'browser-image-resizer';
import { storage } from '../../Firebase/index';

const findBilletRow = async billetNumber => {
    const url = process.env.SHEET_URL;
    let pos;
    const config = {
        headers: {
            'Content-type': 'application/json',
            'Authorization': process.env.SHEET_TOKEN
        }
    };
    const body = {
        apiResource: 'values',
        apiMethod: 'get',
        spreadsheetId: process.env.SHEET_ID_BILLETS,
        range: 'Boletos!C:C'
    };
    const { data: { values } } = await post(url, body, config);
    values.map((billet, index) => {
        if (billet[0] === billetNumber) {
            pos = index;
        }
    })
    return pos + 1;
};

const sendToBackend = state => () => {
    const { billet, fileBillet, setFilename, setBillet, setFileBillet } = state;
    return new Promise(async (resolve, reject) => {
        try {
            if (fileBillet.size === 0) throw { msg: 'Imagem com tamanho vazio', customError: true };
            const row = await findBilletRow(billet);
            if (!row) throw { msg: 'Boleto inválido, confira o número', customError: true };
            const compressed = await readAndCompressImage(state.fileBillet, { quality: 0.65 });
            const timestamp = Date.now();
            const image = storage.child(`Boletos/${billet}-${timestamp}`);
            const uploadTask = await image.put(compressed);
            const imgUrl = await uploadTask.ref.getDownloadURL();
            const url = process.env.SHEET_URL
            const body = {
                apiResource: 'values',
                apiMethod: 'update',
                range: `Boletos!X${row}`,
                valueInputOption: 'raw',
                spreadsheetId: process.env.SHEET_ID_BILLETS,
                resource: {
                    values: [[imgUrl]]
                }
            };
            const config = {
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': process.env.SHEET_TOKEN
                }
            };
            await post(url, body, config);
            setBillet('');
            setFilename('');
            setFileBillet({ name: 'Arraste imagens ou escolha do dispositivo' });
            resolve('Boleto enviado com sucesso')
        } catch (error) {
            if (error.customError) reject(error);
            else {
                console.log(error)
                if (error.response) console.log(error.response)
                reject(error)
            }
        }
    });
}

export default sendToBackend
