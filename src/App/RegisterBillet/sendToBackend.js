import { post } from 'axios'
import { readAndCompressImage } from 'browser-image-resizer'
import { storage } from '../../Firebase/index'
import { dateHourFormatter, intFormatter, numberFormatter, singleDateFormatter } from '../utils'

const sendToBackend = state => () => {
    const { file, billet, saleDate, provider, storeowner, billetValue, paymentMethod, romaneio,
        dueDate, revenue, advisor, type, submitCount, percentage, setSearchedName, setBillet, setSaleDate, setProvider, setStoreowner,
        setBilletValue, setPaymentMethod, setRomaneio, setDueDate, setRevenue, setAdvisor,
        setType, setSubmitCount, setPercentage, setFile, setFilename } = state
    const comissao = numberFormatter(percentage) ? numberFormatter(percentage) / 100 : 0.00
    const today = new Date()
    const url = process.env.SHEET_URL

    const config = {
        headers: {
            'Content-type': 'application/json',
            'Authorization': process.env.SHEET_TOKEN
        }
    }
    return new Promise(async (resolve, reject) => {
        try {
            if (file.size === 0) throw { msg: 'Imagem com tamanho vazio', customError: true };
            const compressed = await readAndCompressImage(file, { quality: 0.65 });
            const timestamp = Date.now();
            const image = storage.child(`Boletos/${billet}-${timestamp}`);
            const uploadTask = await image.put(compressed);
            const imgUrl = await uploadTask.ref.getDownloadURL();
            const body = {
                apiResource: 'values',
                apiMethod: 'append',
                spreadsheetId: process.env.SHEET_ID_BILLETS,
                range: 'Boletos!A1',
                resource: {
                    values: [
                        [dateHourFormatter(today), intFormatter(romaneio), intFormatter(billet), today.getMonth() + 1, today.getFullYear(),
                        singleDateFormatter(saleDate), storeowner, numberFormatter(billetValue) ? numberFormatter(billetValue) / 100 : 0.00, comissao, revenue, provider.nome, paymentMethod,
                            type, advisor, singleDateFormatter(dueDate), '-', provider.endereco.split(' — ')[0],
                        provider.endereco.split(' — ')[1], , , , , , imgUrl]
                    ]
                },
                valueInputOption: 'user_entered'
            }
            await post(url, body, config)
            // clear all fields after submission
            setSearchedName('')
            setBillet('')
            setSaleDate('')
            setProvider({ 'nome': '', 'comissao': '', 'endereco': '' })
            setStoreowner('')
            setBilletValue('')
            setPaymentMethod('')
            setRomaneio('')
            setDueDate('')
            setRevenue('')
            setAdvisor('')
            setType('')
            setSubmitCount(submitCount + 1)
            setPercentage('')
            setFile('')
            setFilename('')
            // resolve Promise with message to user
            resolve('Boleto adicionado com sucesso !')
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
