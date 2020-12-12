const configPost = (arrayUpdate, apiMethod = 'batchUpdate') => {
    return {
        method: 'POST',
        url: process.env.SHEET_URL,
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
