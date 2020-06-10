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
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env', '@babel/preset-react'],
                            plugins: ['@babel/plugin-transform-runtime', 'react-hot-loader/babel']
                        }
                    }
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'raw-loader']
                }
            ]
        },
        plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
        resolve: {
            alias: {
                'react-dom': '@hot-loader/react-dom'
            }
        }
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
            sheet_id_suppliers_banks,
            sheet_id_suppliers_base,
            sheet_id_link_payments,
            cnpj_url,
            cnpj_token
        } = require('./credentials')
        config.devtool = 'cheap-module-eval-source-map'
        config.devServer = { historyApiFallback: true, hot: true }
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
                    SHEET_ID_SUPPLIERS_BANKS: JSON.stringify(sheet_id_suppliers_banks),
                    SHEET_ID_SUPPLIERS_BASE: JSON.stringify(sheet_id_suppliers_base),
                    SHEET_ID_LINK_PAYMENTS: JSON.stringify(sheet_id_link_payments),
                    CNPJ_URL: JSON.stringify(cnpj_url),
                    CNPJ_TOKEN: JSON.stringify(cnpj_token)
                }
            })
        )
    }
    if (mode === 'production') {
        config.devtool = 'cheap-module-source-map'
        config.plugins.push(
            new CompressionPlugin(),
            new CopyWebpackPlugin([
                { from: './_redirects', to: '_redirects', toType: 'file' },
                { from: './src/sw.js', to: 'sw.js', toType: 'file' }
            ]),
            new WebpackPwaManifest({
                name: 'Interno',
                short_name: 'Interno',
                start_url: '/',
                background_color: '#FFF',
                theme_color: '#FFF',
                display: 'standalone',
                icons: [{ src: './logo.png', sizes: [96, 128, 192, 256, 384, 512] }]
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
                    SHEET_ID_SUPPLIERS_BANKS: JSON.stringify(process.env.SHEET_ID_SUPPLIERS_BANKS),
                    SHEET_ID_SUPPLIERS_BASE: JSON.stringify(process.env.SHEET_ID_SUPPLIERS_BASE),
                    SHEET_ID_LINK_PAYMENTS: JSON.stringify(process.env.SHEET_ID_LINK_PAYMENTS),
                    CNPJ_URL: JSON.stringify(process.env.CNPJ_URL),
                    CNPJ_TOKEN: JSON.stringify(process.env.CNPJ_TOKEN)
                }
            })
        )
    }
    return config
}

// tentar dar os bit remove e tals, dps o bit import
