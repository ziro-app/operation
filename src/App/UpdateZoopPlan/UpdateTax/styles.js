import { fontBody, fontTitle } from '@ziro/theme'

export const content = {
    display: 'grid',
    gridTemplateColumns: 'auto auto',
    alignItems: 'center',
  },
  item = {
    fontFamily: fontBody,
    placeSelf: 'center'
  },
  wrapper = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill,minmax(100px,137px))',
    gridColumnGap: '6px',
    justifyContent: 'space-between'
  },
  cardTitle = {
    fontFamily: fontTitle,
    fontSize: '1.4rem',
    textAlign: 'center',
    paddingBottom: '10px',
  }
