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
    marginTop: '50px',
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
}
