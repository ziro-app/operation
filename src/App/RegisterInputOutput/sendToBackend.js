import { post } from 'axios'

const sendToBackend = state => () => {
	const { nickname, category, value, description, setCategory, setValue, setDescription } = state
    const nome = nickname ? nickname.trim() : ''
    const valor = value ? parseFloat(value.replace(/\,/g, '.')).toLocaleString('en-USA', { maximumFractionDigits: 2 }) : ''
    const descricao = description ? description.trim() : ''
    const url = process.env.SHEET_URL
    const today = new Date()
    const data = `${today.getDate()}/${today.getMonth()+1 >= 10? today.getMonth()+1 : `0${today.getMonth()+1}`}/${today.getFullYear().toString().slice(2)}`

	const body = {
		apiResource: 'values',
		apiMethod: 'append',
		spreadsheetId: '1zvlBZ0sNsY0Zs4X8OsnkYDX55gHcZgEHl6Jc6ysxFQU',//process.env.SHEET_ID_INPUT_OUTPUT,
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
