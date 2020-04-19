import { primaryColor, grayColor3, fontTitle } from '@ziro/theme'

export const

cart = {
    display: 'grid',
    gridRowGap: '40px'
},

statusBlock = {
    display: 'grid',
    gridRowGap: '25px'
},

statusName = {
    padding: '0 10px',
    color: primaryColor,
    fontSize: '1.5rem',
    marginBottom: '-10px'
},

button = {
    display: 'grid',
    padding: '25px 20px',
    background: 'white',
    borderRadius: '10px',
    boxShadow: 'rgba(34, 34, 34, 0.3) 0px 5px 12px -1px',
    gridTemplateColumns: '1fr auto auto',
    alignItems: 'center',
    fontFamily: fontTitle,
    color: primaryColor
},

bubble = {
    display: 'grid',
    alignItems: 'center',
    justifyContent: 'center',
    height: 20,
    width: 20,
    borderRadius: '50%',
    fontFamily: fontTitle,
    fontWeight: '600',
    color: primaryColor,
    background: grayColor3,
}