import { formatDateUTC3 } from '@ziro/format-date-utc3'

const configPost = (arrayUpdate, tab, apiMethod = 'batchUpdate') => {
  if (apiMethod === 'append') {
    return {
      method: 'POST',
      url: process.env.SHEET_URL,
      data: {
        apiResource: 'values',
        apiMethod,
        spreadsheetId: process.env.SHEET_ID_BANK_DATA,
        range: `${tab}!A1`,
        resource: {
          values: [arrayUpdate],
        },
        valueInputOption: 'user_entered',
      },
      headers: {
        Authorization: process.env.SHEET_TOKEN,
        'Content-Type': 'application/json',
      },
    }
  }
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

export default configPost
