import { fontBody, fontSizeNormal, fontTitle, fontWeightBody, gradient, primaryColor } from '@ziro/theme'

export const content = {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gridGap: '5px',
    alignItems: 'center',
    padding: '0px 0px',
    // borderTop: '1px solid #F0F0F0',
    justifyContent: 'center',
    textAlign: 'center',
  },
  item = { width: '215px', fontFamily: fontBody },
  item2 = { width: '120px', fontFamily: fontBody },
  wrapper = {
    display: 'flex',
    flexFlow: 'row wrap',
    fontWeight: fontWeightBody,
    textAlign: 'center',
    flex: '1 100%',
    justifyContent: 'center',
    color: primaryColor,
  },
  title = {
    fontFamily: fontTitle,
    fontSize: fontSizeNormal,
    paddingBottom: '10px',
  }
