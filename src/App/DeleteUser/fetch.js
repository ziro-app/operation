import axios from 'axios'

const fetch = (setIsLoading, setIsError, setUsers) => {
    const source = axios.CancelToken.source()
    const users = []
    const run = async () => {
        const config = {
            method: 'POST',
            url: process.env.SHEET_URL,
            data: {
                apiResource: 'values',
                apiMethod: 'get',
                spreadsheetId: process.env.SHEET_ID,
                range: 'Base!C:S'
            },
            headers: {
                'Authorization': process.env.SHEET_TOKEN,
                'Content-Type': 'application/json'
            },
            cancelToken: source.token
        }
        try {
            const dataUsers = await axios(config)
            const [, ...listUsers] = dataUsers.data.values
            listUsers.map((user, index) => {
                if (user[16] === '-') {
                    users.push({ name: user[0], email: user[9], row: (index + 2) });
                }
            });
            setUsers(users)
            setIsLoading(false)
        } catch (error) {
            if (error.response) console.log(error.response)
            else console.log(error)
            setIsError(true)
        }
    }
    run()
    return () => source.cancel('Canceled fetch request. Component unmounted')
}

export default fetch
