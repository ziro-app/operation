import { post } from 'axios'

const dateHourFormatter = (date) => {
    let dateString = date.toString()
    return `${dateString.substr(8,2)}/${date.getMonth()+1 >= 10? date.getMonth()+1 : `0${date.getMonth()+1}`}/${dateString.substr(11,13)}`
}

const sendToBackend = state => () => {
	const { nickname, category, value, description, setCategory, setValue, setDescription } = state
    const nome = nickname ? nickname.trim() : ''
    const valor = value ? parseFloat(value.replace(/\,/g, '.')) : ''
    const descricao = description ? description.trim() : ''
    const url = process.env.SHEET_URL
    const data = dateHourFormatter(new Date())

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
            if(nome === 'Claudia'){
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
