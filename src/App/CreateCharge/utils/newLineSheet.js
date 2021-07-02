const configPost = (arrayUpdate, apiMethod = 'batchUpdate') => {
    return {
        method: 'POST',
        url: 'https://ziro-sheets.netlify.app/.netlify/functions/api',
        data: {
            apiResource: 'values',
            apiMethod,
            spreadsheetId: process.env.SHEET_ID_BANK_DATA,
            resource: {
                data: arrayUpdate,
            },
            valueInputOption: 'user_entered',
        },
        headers: {
            Authorization: process.env.SHEET_TOKEN,
            'Content-Type': 'application/json',
        },
    }
}

module.exports = configPost
