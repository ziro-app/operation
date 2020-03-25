import { post } from 'axios'
import { dateHourFormatterUTC3, numberFormatter } from '../utils'

const sendToBackend = state => () => {
    const { nickname, category, value, description, setCategory, setValue, setDescription } = state
    const nome = nickname ? nickname.trim() : ''
    const valor = value ? numberFormatter(value) : ''
    const descricao = description ? description.trim() : ''
    const url = process.env.SHEET_URL
    const data = dateHourFormatterUTC3(new Date())

	const body = {
		apiResource: 'values',
		apiMethod: 'append',
		spreadsheetId: process.env.SHEET_ID_INPUT_OUTPUT,
		range: `${category}!A1`,
		resource: {
			values: [
				[data, descricao, valor]
			]
		},
		valueInputOption: 'raw'
	}
	const config = {
		headers: {
			'Content-type': 'application/json',
			'Authorization': process.env.SHEET_TOKEN
		}
	}
	return new Promise(async (resolve, reject) => {
        try {
            if(nome === 'Claudia' || nome === 'Vitor'){
                await post(url, body, config)
                setCategory('')
                setValue('')
                setDescription('')
                resolve('Movimentação salva com sucesso')
            } else throw { msg: 'Permissão insuficiente', customError: true }
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
