const configGet = (ranges, baseUrl, sheetBaseId, sheetAuth) => {
    return {
        method: 'POST',
        url: baseUrl,
        data: {
            'apiResource': 'values',
            'apiMethod': 'batchGet',
            'spreadsheetId': sheetBaseId,
            'ranges': ranges
        },
        headers: {
            'Authorization':sheetAuth,
            'Content-Type': 'application/json'
        }
    }
}

export default configGet