import { post } from 'axios';

const url = process.env.SHEET_URL;
const config = {
    headers: {
        'Content-type': 'application/json',
        'Authorization': process.env.SHEET_TOKEN
    }
}


export const findStoreownerRow = async email => {
    let pos;
    const body = {
        "apiResource": "values",
        "apiMethod": "get",
        "range": "Base",
        "spreadsheetId": process.env.SHEET_STOREOWNERS_ID
    };
    const { data: { values } } = await post(url, body, config);
    values.map((user, index) => {
        if (user[3] === email) {
            pos = index
        }
    });
    return pos + 1;
}

export const findLeadRow = async email => {
    let pos;
    const body = {
        "apiResource": "values",
        "apiMethod": "get",
        "range": "Base",
        "spreadsheetId": process.env.SHEET_LEADS_PRE_ID
    };
    const { data: { values } } = await post(url, body, config);
    values.map((user, index) => {
        if (user[3] === email) {
            pos = index
        }
    });
    return pos + 1;
}

export const findSupplierRow = async email => {
    let pos;
    let collaborator = false;
    const body = {
        "apiResource": "values",
        "apiMethod": "get",
        "range": "Base",
        "spreadsheetId": process.env.SHEET_ID_SUPPLIERS
    };
    const { data: { values } } = await post(url, body, config);
    values.map((user, index) => {
        if (user[5] === email) {
            pos = index;
        }
    });
    if (!pos) {
        collaborator = true;
        const collaboratorsBody = {
            "apiResource": "values",
            "apiMethod": "get",
            "range": "Colaboradores",
            "spreadsheetId": process.env.SHEET_ID_SUPPLIERS
        };
        const { data: { values } } = await post(url, collaboratorsBody, config);
        values.map((user, index) => {
            if (user[2] === email) {
                pos = index;
            }
        });
    }
    return [pos + 1, collaborator];
}
