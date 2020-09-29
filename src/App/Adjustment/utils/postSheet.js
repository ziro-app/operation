const configPost = (baseUrl, sheetBaseId, sheetAuth,arrayUpdate) => {
    return {
        method: 'POST',
        url: baseUrl,
        data:{
            "apiResource": "values",
            "apiMethod": "batchUpdate",
            "spreadsheetId": sheetBaseId,
            "resource": {
                "data": arrayUpdate
            },
            "valueInputOption": "user_entered"
        },
        headers: {
            'Authorization': sheetAuth,
            'Content-Type': 'application/json'
        }
    }
}

export default configPost