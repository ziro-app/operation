const configGet = ranges => {
  return {
    method: 'POST',
    url: 'https://ziro-sheets.netlify.app/.netlify/functions/api',
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
