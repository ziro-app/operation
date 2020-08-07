import axios from 'axios'

const fetch = (setIsLoading, setIsError, setAttendanceList) => {
    let attendances = []
    const source = axios.CancelToken.source()
	const run = async () => {
		const config = {
			method: 'POST',
			url: process.env.SHEET_URL,
			data: {
				apiResource: 'values',
				apiMethod: 'get',
				spreadsheetId: process.env.SHEET_ID_APPOINTMENTS,
				range: 'Atendimentos!B:O'
			},
			headers: {
				'Authorization': process.env.SHEET_TOKEN,
				'Content-Type': 'application/json'
			},
			cancelToken: source.token
		}
		try {
			const { data: { values } } = await axios(config)
            const [, ...dataWithoutHeaderRow] = values
            dataWithoutHeaderRow.map(attendance => {
                if(attendance[13] !== 'Cancelado')
                    attendances.push(`${attendance[0]} - ${attendance[3]}`)
            })
            setAttendanceList(attendances)
		} catch (error) {
			if (error.response) console.log(error.response)
			else console.log(error)
			setIsError(true)
		} finally {
			setIsLoading(false)
		}
	}
	run()
	return () => source.cancel('Canceled fetch request. Component unmounted')
}

export default fetch
