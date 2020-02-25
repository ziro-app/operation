import React from 'react'
import PropTypes from 'prop-types'
import SpinnerWithDiv from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import { fontTitle } from '@ziro/theme'

const SubmitBlock = ({ isSubmitting, isSubmitted }) => {
	if (isSubmitting) return <SpinnerWithDiv size={'5rem'} />
	if (isSubmitted) return (
		<label style={{
			marginTop: '10px',
			fontFamily: fontTitle,
			fontSize: '1.5rem',
			textAlign: 'center'
		}}>
			Finalizado!
		</label>
	)
	return null
}

SubmitBlock.propTypes = {
	isSubmitting: PropTypes.bool.isRequired,
	isSubmitted: PropTypes.bool.isRequired
}

export default SubmitBlock