import { fontBody, fontSizeNormal, fontTitle, fontWeightBody, gradient, primaryColor } from '@ziro/theme'

export const content = {
    display: 'grid',
    gridTemplateColumns: 'auto auto',
    alignItems: 'center',
  },
  item = { width: '137px', fontFamily: fontBody, placeSelf: 'center' },
  wrapper = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill,minmax(153px,1fr))',
  },
  cardTitle = {
    fontFamily: fontTitle,
    fontSize: fontSizeNormal,
    textAlign: 'center',
    paddingBottom: '10px',
  }
