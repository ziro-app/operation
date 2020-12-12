const configGet = ranges => {
  return {
    method: 'POST',
    url: process.env.SHEET_URL,
    data: {
      apiResource: 'values',
      apiMethod: 'batchGet',
      spreadsheetId: process.env.SHEET_ID_BANK_DATA,
      ranges,
    },
    headers: {
      Authorization: process.env.SHEET_TOKEN,
      'Content-Type': 'application/json',
    },
  }
}

module.exports = configGet
