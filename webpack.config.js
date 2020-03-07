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
							plugins: ['@babel/plugin-transform-runtime']
						}
					}
				},
				{
					test: /\.css$/,
					use: ['style-loader', 'raw-loader']
				}
			]
		},
		plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })]
	}
	if (mode === 'development') {
		const {
			sheet_url,
			sheet_token,
			sheet_id,
			continue_url,
			sheet_storeowners_id,
			sheet_id_refer_legacy,
			sheet_id_affiliates,
			sheet_id_people,
			sheet_id_brands,
			cnpj_url,
			cnpj_token
		} = require('./credentials')
		config.devtool = 'cheap-module-eval-source-map'
		config.devServer = { historyApiFallback: true }
		config.plugins.push(
			new webpack.DefinePlugin({
				'process.env': {
					SHEET_URL: JSON.stringify(sheet_url),
					SHEET_TOKEN: JSON.stringify(sheet_token),
					SHEET_ID: JSON.stringify(sheet_id),
					CONTINUE_URL: JSON.stringify(continue_url),
					SHEET_STOREOWNERS_ID: JSON.stringify(sheet_storeowners_id),
					SHEET_ID_REFER_LEGACY: JSON.stringify(sheet_id_refer_legacy),
					SHEET_ID_AFFILIATES: JSON.stringify(sheet_id_affiliates),
					SHEET_ID_PEOPLE: JSON.stringify(sheet_id_people),
					SHEET_ID_BRANDS: JSON.stringify(sheet_id_brands),
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
					SHEET_STOREOWNERS_ID: JSON.stringify(process.env.SHEET_STOREOWNERS_ID),
					SHEET_ID_REFER_LEGACY: JSON.stringify(process.env.SHEET_ID_REFER_LEGACY),
					SHEET_ID_AFFILIATES: JSON.stringify(process.env.SHEET_ID_AFFILIATES),
					SHEET_ID_PEOPLE: JSON.stringify(process.env.SHEET_ID_PEOPLE),
					SHEET_ID_BRANDS: JSON.stringify(process.env.SHEET_ID_BRANDS),
					CNPJ_URL: JSON.stringify(process.env.CNPJ_URL),
					CNPJ_TOKEN: JSON.stringify(process.env.CNPJ_TOKEN)
				}
			})
		)
	}
	return config
}

// tentar dar os bit remove e tals, dps o bit import