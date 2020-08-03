import { fontTitle } from '@ziro/theme'

export const

container = {
	position: 'absolute',
	display: 'grid',
	gridTemplateColumns: '1fr 1fr 1fr',
	boxSizing: 'border-box',
	width: '100%',
	padding: '10px 0px',
	borderTopLeftRadius: '5px',
	borderTopRightRadius: '5px',
	background: 'rgba(0,0,0,0.6)'
},

checkboxContainer = {
	display: 'grid',
	gridTemplateColumns: 'auto auto',
	alignItems: 'center',
	justifyItems: 'center'
},

checkbox = {
    cursor: 'pointer',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    padding: '6px',
    background: '#fff',
    boxShadow: '0px 2px 10px -4px #222'
},

caption = {
	fontFamily: fontTitle,
	fontSize: '1.5rem',
	color: 'white'
}