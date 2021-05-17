const HtmlWebpackPlugin = require('html-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')
const webpack = require('webpack')

module.exports = (env, { mode }) => {
    const config = {
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env', '@babel/preset-react'],
                            plugins: ['@babel/plugin-transform-runtime', 'react-hot-loader/babel'],
                        },
                    },
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'raw-loader'],
                },
            ],
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js'],
        },
        plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
    }
    if (mode === 'development') {
        const {
            sheet_url,
            sheet_token,
            sheet_id,
            continue_url,
            pay,
            pay_token,
            sheet_storeowners_id,
            sheet_id_affiliates,
            sheet_id_brands,
            sheet_id_register_get,
            sheet_id_supplies,
            sheet_id_providers,
            sheet_id_billets,
            sheet_id_input_output,
            sheet_id_expenses,
            sheet_id_appointments,
            sheet_id_suppliers,
            sheet_id_link_payments,
            sheet_id_fetch_link,
            sheet_id_bank_data,
            cnpj_url,
            cnpj_token,
            firebase_auth_url,
            firebase_auth_token,
            email_token,
            api_email,
            sheet_leads_pre_id,
            token_correios,
            url_correios,
            url_providers,
            token_providers,
            sheet_id_pickup,
            sheet_id_form_duplicates,
            sheet_id_transito,
            sheet_id_pessoas,
            document_id_for_utilities_main,
            homolog,
            zoop_token,
            ziro_marketplace,
        } = require('./credentials')
        config.devtool = 'cheap-module-eval-source-map'
        config.devServer = { historyApiFallback: true, hot: true, port: 9090 }
        config.plugins.push(
            new webpack.DefinePlugin({
                'process.env': {
                    SHEET_URL: JSON.stringify(sheet_url),
                    SHEET_TOKEN: JSON.stringify(sheet_token),
                    SHEET_ID: JSON.stringify(sheet_id),
                    CONTINUE_URL: JSON.stringify(continue_url),
                    PAY: JSON.stringify(pay),
                    PAY_TOKEN: JSON.stringify(pay_token),
                    SHEET_STOREOWNERS_ID: JSON.stringify(sheet_storeowners_id),
                    SHEET_ID_AFFILIATES: JSON.stringify(sheet_id_affiliates),
                    SHEET_ID_BRANDS: JSON.stringify(sheet_id_brands),
                    SHEET_ID_REGISTER_GET: JSON.stringify(sheet_id_register_get),
                    SHEET_ID_SUPPLIES: JSON.stringify(sheet_id_supplies),
                    SHEET_ID_PROVIDERS: JSON.stringify(sheet_id_providers),
                    SHEET_ID_BILLETS: JSON.stringify(sheet_id_billets),
                    SHEET_ID_INPUT_OUTPUT: JSON.stringify(sheet_id_input_output),
                    SHEET_ID_EXPENSES: JSON.stringify(sheet_id_expenses),
                    SHEET_ID_APPOINTMENTS: JSON.stringify(sheet_id_appointments),
                    SHEET_ID_SUPPLIERS: JSON.stringify(sheet_id_suppliers),
                    SHEET_ID_FETCH_LINK: JSON.stringify(sheet_id_fetch_link),
                    SHEET_ID_BANK_DATA: JSON.stringify(sheet_id_bank_data),
                    SHEET_ID_LINK_PAYMENTS: JSON.stringify(sheet_id_link_payments),
                    CNPJ_URL: JSON.stringify(cnpj_url),
                    CNPJ_TOKEN: JSON.stringify(cnpj_token),
                    FIREBASE_AUTH_URL: JSON.stringify(firebase_auth_url),
                    FIREBASE_AUTH_TOKEN: JSON.stringify(firebase_auth_token),
                    EMAIL_TOKEN: JSON.stringify(email_token),
                    API_EMAIL: JSON.stringify(api_email),
                    SHEET_LEADS_PRE_ID: JSON.stringify(sheet_leads_pre_id),
                    TOKEN_CORREIOS: JSON.stringify(token_correios),
                    URL_CORREIOS: JSON.stringify(url_correios),
                    URL_PROVIDERS: JSON.stringify(url_providers),
                    TOKEN_PROVIDERS: JSON.stringify(token_providers),
                    SHEET_ID_PICKUP: JSON.stringify(sheet_id_pickup),
                    SHEET_ID_FORM_DUPLICATES: JSON.stringify(sheet_id_form_duplicates),
                    SHEET_ID_TRANSITO: JSON.stringify(sheet_id_transito),
                    SHEET_ID_PESSOAS: JSON.stringify(sheet_id_pessoas),
                    DOCUMENT_ID_FOR_UTILITIES_MAIN: JSON.stringify(document_id_for_utilities_main),
                    ZOOP_TOKEN: JSON.stringify(zoop_token),
                    ZIRO_MARKETPLACE: JSON.stringify(ziro_marketplace),
                    // FOR DEV TESTS ONLY
                    HOMOLOG: JSON.stringify(homolog),
                },
            }),
        )
    }
    if (mode === 'production') {
        config.devtool = 'cheap-module-source-map'
        config.plugins.push(
            new CompressionPlugin(),
            new CopyWebpackPlugin([
                { from: './_redirects', to: '_redirects', toType: 'file' },
                { from: './src/sw.js', to: 'sw.js', toType: 'file' },
            ]),
            new WebpackPwaManifest({
                name: 'Interno',
                short_name: 'Interno',
                start_url: '/',
                background_color: '#FFF',
                theme_color: '#FFF',
                display: 'standalone',
                icons: [{ src: './logo.png', sizes: [96, 128, 192, 256, 384, 512] }],
            }),
            new webpack.DefinePlugin({
                'process.env': {
                    SHEET_URL: JSON.stringify(process.env.SHEET_URL),
                    SHEET_TOKEN: JSON.stringify(process.env.SHEET_TOKEN),
                    SHEET_ID: JSON.stringify(process.env.SHEET_ID),
                    CONTINUE_URL: JSON.stringify(process.env.CONTINUE_URL),
                    PAY: JSON.stringify(process.env.PAY),
                    PAY_TOKEN: JSON.stringify(process.env.PAY_TOKEN),
                    SHEET_STOREOWNERS_ID: JSON.stringify(process.env.SHEET_STOREOWNERS_ID),
                    SHEET_ID_AFFILIATES: JSON.stringify(process.env.SHEET_ID_AFFILIATES),
                    SHEET_ID_BRANDS: JSON.stringify(process.env.SHEET_ID_BRANDS),
                    SHEET_ID_REGISTER_GET: JSON.stringify(process.env.SHEET_ID_REGISTER_GET),
                    SHEET_ID_SUPPLIES: JSON.stringify(process.env.SHEET_ID_SUPPLIES),
                    SHEET_ID_PROVIDERS: JSON.stringify(process.env.SHEET_ID_PROVIDERS),
                    SHEET_ID_BILLETS: JSON.stringify(process.env.SHEET_ID_BILLETS),
                    SHEET_ID_INPUT_OUTPUT: JSON.stringify(process.env.SHEET_ID_INPUT_OUTPUT),
                    SHEET_ID_EXPENSES: JSON.stringify(process.env.SHEET_ID_EXPENSES),
                    SHEET_ID_APPOINTMENTS: JSON.stringify(process.env.SHEET_ID_APPOINTMENTS),
                    SHEET_ID_SUPPLIERS: JSON.stringify(process.env.SHEET_ID_SUPPLIERS),
                    SHEET_ID_FETCH_LINK: JSON.stringify(process.env.SHEET_ID_FETCH_LINK),
                    SHEET_ID_BANK_DATA: JSON.stringify(process.env.SHEET_ID_BANK_DATA),
                    SHEET_ID_LINK_PAYMENTS: JSON.stringify(process.env.SHEET_ID_LINK_PAYMENTS),
                    CNPJ_URL: JSON.stringify(process.env.CNPJ_URL),
                    CNPJ_TOKEN: JSON.stringify(process.env.CNPJ_TOKEN),
                    FIREBASE_AUTH_URL: JSON.stringify(process.env.FIREBASE_AUTH_URL),
                    FIREBASE_AUTH_TOKEN: JSON.stringify(process.env.FIREBASE_AUTH_TOKEN),
                    EMAIL_TOKEN: JSON.stringify(process.env.EMAIL_TOKEN),
                    API_EMAIL: JSON.stringify(process.env.API_EMAIL),
                    SHEET_LEADS_PRE_ID: JSON.stringify(process.env.SHEET_LEADS_PRE_ID),
                    TOKEN_CORREIOS: JSON.stringify(process.env.TOKEN_CORREIOS),
                    URL_CORREIOS: JSON.stringify(process.env.URL_CORREIOS),
                    URL_PROVIDERS: JSON.stringify(process.env.URL_PROVIDERS),
                    SHEET_ID_PICKUP: JSON.stringify(process.env.SHEET_ID_PICKUP),
                    TOKEN_PROVIDERS: JSON.stringify(process.env.TOKEN_PROVIDERS),
                    SHEET_ID_FORM_DUPLICATES: JSON.stringify(process.env.SHEET_ID_FORM_DUPLICATES),
                    SHEET_ID_TRANSITO: JSON.stringify(process.env.SHEET_ID_TRANSITO),
                    SHEET_ID_PESSOAS: JSON.stringify(process.env.SHEET_ID_PESSOAS),
                    DOCUMENT_ID_FOR_UTILITIES_MAIN: JSON.stringify(process.env.DOCUMENT_ID_FOR_UTILITIES_MAIN),
                    ZOOP_TOKEN: JSON.stringify(process.env.ZOOP_TOKEN),
                    ZIRO_MARKETPLACE: JSON.stringify(process.env.ZIRO_MARKETPLACE),
                },
            }),
        )
    }
    return config
}
