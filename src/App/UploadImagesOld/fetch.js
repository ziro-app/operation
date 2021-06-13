import axios from 'axios';

const fetch = (setIsLoading, setIsError, setBrands, setBrandsAndTrends) => {
    const source = axios.CancelToken.source();
    const run = async () => {
        const config = {
            method: 'POST',
            url: 'https://ziro-sheets.netlify.app/.netlify/functions/api',
            data: {
                apiResource: 'values',
                apiMethod: 'get',
                spreadsheetId: process.env.SHEET_ID_BRANDS,
                range: 'Trends!A2:E',
            },
            headers: {
                Authorization: process.env.SHEET_TOKEN,
                'Content-Type': 'application/json',
            },
            cancelToken: source.token,
        };
        try {
            const {
                data: { values },
            } = await axios(config);

            const brands = values.map(([name]) => name);
            const brandsAndTrends = values.map(([name, insta, ...trends]) => [name, trends]);
            setBrands(['TestNewUpload', 'Bot', ...new Set(brands)]);
            setBrandsAndTrends(...new Set(brandsAndTrends));
        } catch (error) {
            if (error.response) console.log(error.response);
            else console.log(error);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };
    run();
    return () => source.cancel('Canceled fetch request. Component unmounted');
};

export default fetch;
