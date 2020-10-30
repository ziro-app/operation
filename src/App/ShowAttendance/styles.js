import { fontTitle, fontSizeInput, gradient, shadow, primaryColor } from '@ziro/theme'

export const

container = {
	display: 'grid',
	justifyItems: 'center',
	gridRowGap: '5px',
	borderRadius: '4px'
},

name = {
	fontFamily: 'Rubik',
    fontSize: '1.4rem',
    textTransform: 'uppercase'
},

block = {
    marginTop: '50px',
    textAlign: 'center'
},

blockTitle = {
    ...name,
    fontSize: '1.5rem',
    display: 'grid',
    textAlign: 'left',
},

containerOneColumn = {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridColumnGap: '8px'
},

containerTwoColumn = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridColumnGap: '8px'
},

containerTwoColumnButton = {
    display: 'grid',
    gridTemplateColumns: '60% 40%'
},

button = {
    marginTop: '10px',
    display: 'block', // necessary for link version
    WebkitAppearance: 'none',
    WebkitTapHighlightColor: 'rgba(0,0,0,0)',
    MozAppearance: 'none',
    outline: 'none',
    cursor: 'pointer',
    width: '100%',
    padding: '8px 0px',
    border: 'none',
    borderRadius: '20px',
    fontFamily: fontTitle,
    fontSize: '1.2rem',
    color: '#FFF',
    textAlign: 'center',
    background: gradient,
    boxShadow: `0px 3px 12px -3px rgba(34,34,34,0.65)`
},

bar = {
    margin: '30px 0',
    border: 'none',
    height: '2px',
    background: '#EAEAEA'
}
