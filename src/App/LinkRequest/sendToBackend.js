import { post } from 'axios';
import md5 from 'md5';
import { readAndCompressImage } from 'browser-image-resizer';
import { formatDateUTC3 } from '@ziro/format-date-utc3';
import { storage } from '../../Firebase/index';
import { round, internalFormat } from '../Transactions/utils';

const defineCardValue = ({ discount, installment, totalAmount }) => {
    const valueAmount = (totalAmount / 100)
    if (discount === '' || discount == 0) {
        if (installment.indexOf('1') !== -1)
            return round((valueAmount / 0.96), 2)
        else if (installment.indexOf('2') !== -1)
            return round((valueAmount / 0.95), 2)
        else if (installment.indexOf('3') !== -1 || installment.indexOf('4') !== -1)
            return round((valueAmount / 0.93), 2)
        else return round((valueAmount / 0.92), 2)
    } else return totalAmount;
}

const defineTEDValue = ({ hasCommission, commissionValue, totalAmount }) => {
    if (hasCommission === 'Sim') {
        const percent = commissionValue / 100;
        return totalAmount - (totalAmount * percent);
    } else return totalAmount;
}

const randStr = () => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 5; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const sendToBackend = state => () => {
    const { totalAmount, type, storeownerName, supplierName, romaneio,
        installment, discount, paymentType, beneficiary, beneficiaryDocument, bankName,
        accountNumber, agency, note, setTotalAmount, setType, setStoreowner, setStoreownerName, setSupplier, setSupplierName,
        setRomaneio, setFilename, setInstallment, setDiscount, setPaymentType, setBeneficiary, setBeneficiaryDocument,
        setBankName, setAccountNumber, setAgency, setBank, setHasCommission, setCommissionValue, setNote } = state;
    const linkValue = type === 'Cartão de Crédito' ? internalFormat(defineCardValue(state)) : internalFormat(defineTEDValue(state));
    const total = totalAmount ? internalFormat(totalAmount) : '';
    const doc = beneficiaryDocument.startsWith('0') ? `'${beneficiaryDocument}` : beneficiaryDocument;
    const agencia = agency.startsWith('0') ? `'${agency}` : agency;
    const conta = accountNumber.startsWith('0') ? `'${accountNumber}` : accountNumber;
    const obs = note ? note.trim() : '';
    const url = process.env.SHEET_URL;
    const config = {
        headers: {
            'Content-type': 'application/json',
            'Authorization': process.env.SHEET_TOKEN
        }
    };
    return new Promise(async (resolve, reject) => {
        try {
            if (romaneio.size === 0) throw { msg: 'Imagem com tamanho vazio', customError: true };
            const nameOfFile = md5(`${romaneio.name}${randStr()}`).substr(0, 5);
            const compressed = await readAndCompressImage(romaneio, { quality: 0.65 });
            const timestamp = Date.now();
            const image = storage.child(`Romaneios/${nameOfFile}-${timestamp}`);
            const uploadTask = await image.put(compressed);
            const imgUrl = await uploadTask.ref.getDownloadURL();
            let body = {};
            if (type === 'Cartão de Crédito') {
                body = {
                    apiResource: 'values',
                    apiMethod: 'append',
                    spreadsheetId: process.env.SHEET_ID_LINK_PAYMENTS,
                    range: 'Link Pagamentos!A1',
                    resource: {
                        values: [
                            [formatDateUTC3(new Date()), storeownerName, supplierName, linkValue, total,
                                installment, discount, paymentType, imgUrl, paymentType === 'TED' ? beneficiary : '', paymentType === 'TED' ? bankName : '', paymentType === 'TED' ? agencia : '',
                            paymentType === 'TED' ? conta : '', paymentType === 'TED' ? doc : '', obs]
                        ]
                    },
                    valueInputOption: 'user_entered'
                }
            } else {
                body = {
                    apiResource: 'values',
                    apiMethod: 'append',
                    spreadsheetId: process.env.SHEET_ID_LINK_PAYMENTS,
                    range: 'Link TED!A1',
                    resource: {
                        values: [
                            [formatDateUTC3(new Date()), storeownerName, supplierName, total, linkValue,
                                imgUrl, paymentType === 'TED' ? beneficiary : '', paymentType === 'TED' ? bankName : '', paymentType === 'TED' ? agencia : '', paymentType === 'TED' ? conta : '', paymentType === 'TED' ? doc : '', obs, paymentType]
                        ]
                    },
                    valueInputOption: 'user_entered'
                }
            }
            await post(url, body, config)
            setType('')
            setTotalAmount('')
            setStoreowner({})
            setStoreownerName('')
            setSupplier({})
            setSupplierName('')
            setRomaneio('')
            setFilename('')
            setInstallment('')
            setDiscount('')
            setPaymentType('')
            setBank({})
            setBeneficiary('')
            setBeneficiaryDocument('')
            setBankName('')
            setAccountNumber('')
            setAgency('')
            setHasCommission('')
            setCommissionValue('')
            setNote('')
            resolve('Link cadastrado com sucesso.')
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
