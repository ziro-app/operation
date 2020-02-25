import React from 'react'
import PropTypes from 'prop-types'
import SpinnerWithDiv from '@bit/vitorbarbosa19.ziro.spinner-with-div'

const SubmitBlock = ({ isSubmitting, isSubmitted }) => {
	if (isSubmitting) return <SpinnerWithDiv size={'5rem'} />
	if (isSubmitted) return <div>Finalizado</div>
	return null
}

SubmitBlock.propTypes = {
	isSubmitting: PropTypes.bool.isRequired,
	isSubmitted: PropTypes.bool.isRequired
}

export default SubmitBlock