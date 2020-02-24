import React, { useState } from 'react'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import ImageUpload from '@bit/vitorbarbosa19.ziro.image-upload'
import sendToBackend from './sendToBackend'
import { container, block, title } from './styles'

export default () => {
	const [brand, setBrand] = useState('')
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
					list={['Apples', 'Bananas', 'Oranges', 'Melons', 'Berries']}
					placeholder='Escolha uma marca'
					onChangeKeyboard={element => element ? setBrand(element.value) : null }
				/>
			</div>
			<div style={block}>
				<label style={title}>Etapa 2</label>
				<ImageUpload sendToBackend={sendToBackend} />
			</div>
		</div>
	)
}