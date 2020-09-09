import { fontBody, fontSizeSmall, fontTitle, gradient, grayColor2 } from '@ziro/theme'

export const brandCart = {
    display: 'grid',
    gridGap: '20px',
  },
  brandName = {
    marginBottom: '-20px',
    padding: '10px 0',
    fontFamily: fontTitle,
    fontSize: '20px',
    textAlign: 'center',
  },
  cardBlock = {
    display: 'grid',
    gridTemplateColumns: '80px 1fr',
    alignItems: 'end',
    padding: '20px 10px',
    borderRadius: '3px',
    boxShadow: 'rgba(34, 34, 34, 0.3) 0px 5px 10px -1px',
  },
  image = {
    alignSelf: 'start',
    objectFit: 'cover',
    width: '100%',
    borderRadius: '3px',
  },
  cardText = {
    display: 'grid',
    alignItems: 'center',
    gridRowGap: '15px',
    padding: '0 0 0 15px',
  },
  icon = {
    alignSelf: 'center',
    justifySelf: 'end',
    display: 'grid',
    justifyItems: 'center',
    alignItems: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'white',
    boxShadow: 'rgba(34, 34, 34, 0.3) 0px 5px 10px -1px',
  },
  orderStatus = status => ({
    fontFamily: fontTitle,
    textAlign: status ? 'center' : 'left',
    alignSelf: status ? 'end' : 'initial',
  }),
  order = {
    display: 'grid',
    gridRowGap: '2px',
  },
  orderTitle = {
    color: grayColor2,
    fontSize: '1.4rem',
    fontWeight: '500',
  },
  orderGrid = {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
  },
  orderQty = {
    fontSize: '1.4rem',
  },
  button = {
    margin: '10px auto 0',
    display: 'block', // necessary for link version
    WebkitAppearance: 'none',
    WebkitTapHighlightColor: 'rgba(0,0,0,0)',
    MozAppearance: 'none',
    outline: 'none',
    cursor: 'pointer',
    height: '30px',
    width: '100%',
    maxWidth: '200px',
    padding: '8px 0px',
    border: 'none',
    borderRadius: '20px',
    fontFamily: fontTitle,
    fontSize: '1.3rem',
    color: '#FFF',
    textAlign: 'center',
    background: gradient,
    boxShadow: `0px 3px 12px -3px rgba(34,34,34,0.65)`,
  },
  buttonDownload = {
    ...button,
    maxWidth: 'none',
    height: 'none',
    margin: '0',
    padding: '10px 0px',
    fontSize: '1.5rem',
    boxShadow: `0px 3px 12px -2px rgba(34,34,34,0.65)`,
  },
  card = {
    display: 'grid',
    padding: '10px',
    background: 'white',
    gridGap: '10px',
    boxShadow: 'rgba(34, 34, 34, 0.3) 0px 5px 15px -4px',
  },
  content = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: '10px',
    alignItems: 'center',
    borderTop: '1px solid #F0F0F0',
  },
  qtyLabel = {
    padding: '10px 10px',
    borderTop: '1px solid #F0F0F0',
    borderBottom: '1px solid #F0F0F0',
  },
  qtyContainer = {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr 1fr',
    alignItems: 'center',
  },
  container = {
    display: 'grid',
  },
  labelRadioButton = {
    fontSize: fontSizeSmall,
    fontFamily: fontBody,
    marginLeft: '12px',
    marginBottom: '12px',
    cursor: 'pointer',
  },
  radioButton = { cursor: 'pointer' },
  radioButtonContainer = {
    display: 'flex',
    position: 'relative',
  },
  checkmark = `
.container {
  display: block;
  position: relative;
  padding-left: 30px;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* hide the browser default radio */
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  position: absolute;
  top: -3px;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: #eee;
  border-radius: 50%;
}

.container:hover input ~ .checkmark {
  background-color: #ccc;
}

.container input:checked ~ .checkmark {
  background-color: #2196F3;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the indicator (dot/circle) when checked */
.container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the indicator (dot/circle) */
.container .checkmark:after {
top: 9px;
left: 9px;
width: 8px;
height: 8px;
border-radius: 50%;
background: white;
}
`
