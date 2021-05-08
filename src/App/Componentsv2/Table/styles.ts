import { CSSProperties } from 'react'
import theme from '../themes'

export const container: CSSProperties = {
  display: 'grid',
  gridRowGap: '12px',
}
export const titleStyle: CSSProperties = {
  borderBottom: '1px solid rgba(34,34,34,.1)',
  borderTopLeftRadius: '5px',
  borderTopRightRadius: '5px',
  padding: '4px 0px',
}
export const table = (numberOfColumns: number, hasIcon: boolean): CSSProperties => {
  const columns = hasIcon ? numberOfColumns + 1 : numberOfColumns
  const templateColumns = columns === 2 ? 'auto auto' : `auto repeat(${columns - 2}, 1fr) auto`
  return {
    display: 'grid',
    gridTemplateColumns: templateColumns,
    gridRowGap: '10px',
  }
}
export const cellHeader: CSSProperties = {
  display: 'grid',
  width: '100%',
  height: '100%',
  fontWeight: theme.fontWeight.title,
  textAlign: 'center',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  cursor: 'default',
}
export const cell: CSSProperties = {
  display: 'grid',
  width: '100%',
  height: '100%',
  fontWeight: theme.fontWeight.muted,
  textAlign: 'center',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  cursor: 'default',
}
export const cellWithIcon: CSSProperties = {
  ...cell,
  cursor: 'pointer',
}
export const cellTotal: CSSProperties = {
  display: 'grid',
  width: '100%',
  height: '100%',
  fontWeight: theme.fontWeight.title,
  textAlign: 'center',
  backgroundColor: 'rgba(34,34,34,.05)',
  padding: '4px',
  cursor: 'default',
}
