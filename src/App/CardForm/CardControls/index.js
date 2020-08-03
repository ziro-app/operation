import React from 'react'
import PropTypes from 'prop-types'
import { container, checkboxContainer, checkbox, caption } from './styles'

const CardControls = props => {
	return (
		<div style={container}>
			<div style={checkboxContainer}>
				<div style={checkbox}></div>
				<div style={caption}>Foto de capa</div>
			</div>
			<div>Copy Icon</div>
			<div>Delete Icon</div>
		</div>
	)
}

CardControls.propTypes = {

}

export default CardControls