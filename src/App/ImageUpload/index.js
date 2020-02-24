import React, { useState, useEffect } from 'react'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner'
import Error from '@bit/vitorbarbosa19.ziro.error'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import ImageUpload from '@bit/vitorbarbosa19.ziro.image-upload'
import fetch from './fetch'
import sendToBackend from './sendToBackend'
import isValidBrand from './isValidBrand'
import { container, block, title } from './styles'

export default () => {
	const [isLoading, setIsLoading] = useState(true)
	const [isError, setIsError] = useState(false)
	const [brands, setBrands] = useState('')
	const [brand, setBrand] = useState('')
	useEffect(() => fetch(setIsLoading, setIsError, setBrands), [])
	if (isLoading) return <div style={{ display: 'grid' }}><Spinner size={'6rem'} /></div>
	if (isError) return <Error />
	return (
		<div style={container}>
			<div style={block}>
				<label style={title}>Como usar</label>
				<label>Faça upload de imagens do seu dispositivo para atualizar o catálogo Ziro com novidades das marcas</label>
			</div>
			<div style={block}>
				<label style={title}>Etapa 1</label>
				<Dropdown
					readOnly={false}
					value={brand}
					onChange={({ target: { value } }) => setBrand(value)}
					list={brands}
					placeholder='Escolha uma marca'
					onChangeKeyboard={element => element ? setBrand(element.value) : null }
				/>
			</div>
			<div style={block}>
				<label style={title}>Etapa 2</label>
				<ImageUpload
					sendToBackend={sendToBackend}
					isDisabled={!isValidBrand(brands,brand)}
				/>
			</div>
		</div>
	)
}