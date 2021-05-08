/* eslint-disable react/no-array-index-key */
import React from 'react'
import { useLocation } from '../Router'
import Link from '../Link'
import Title from '../Title'
import Text from '../Text'
import { TableProps } from './types'
import { validateTable } from './isValidTable'
import { container, titleStyle, table, cellHeader, cell, cellWithIcon, cellTotal } from './styles'

const Table = ({ title, Icon, data, paths, style, styleBody, styleHeader, styleCell, styleCellTotal }: TableProps) => {
  const [location] = useLocation()
  validateTable(data)
  const { header, rows, totals } = data
  /** line below makes sure paths has the right size and its contents are strings. If array of paths is corrupted, it creates a new array with fake paths that just block navigation */
  const _paths = paths && paths.length === rows.length ? paths : Array.from(Array(rows.length).keys()).map(() => `${location}#`)
  return (
    <div style={{ ...container, ...style }}>
      <Title style={titleStyle}>{title}</Title>
      <div style={{ ...table(header.length, !!Icon), ...styleBody }}>
        {/* Cabeçalho */}
        {header &&
          header.map((column: string, index: React.Key) => (
            <Text key={index} style={{ ...cellHeader, ...styleHeader }}>
              {column}
            </Text>
          ))}
        {Icon && <Text style={{ ...cellHeader, ...styleHeader }}> </Text>}

        {/* Corpo da tabela */}
        {rows &&
          rows.map((row, indexRows: number) => (
            <React.Fragment key={indexRows}>
              {row &&
                row.map((eachCell, indexRow: number) =>
                  Icon ? (
                    <Link href={_paths[indexRows]} key={`${indexRows}-${indexRow}`}>
                      <Text style={{ ...cellWithIcon, ...styleCell }}>{eachCell}</Text>
                    </Link>
                  ) : (
                    <Text key={`${indexRows}-${indexRow}`} style={{ ...cell, ...styleCell }}>
                      {eachCell}
                    </Text>
                  ),
                )}
              {Icon && <Link href={_paths[indexRows]}>{Icon}</Link>}
            </React.Fragment>
          ))}

        {/* Total */}
        {totals &&
          totals.map((column: string, index: React.Key) => (
            <Text key={index} style={{ ...cellTotal, ...styleCellTotal }}>
              {column}
            </Text>
          ))}
        {Icon && <Text style={{ width: '100%', height: '100%', ...cellTotal, ...styleCellTotal }}> </Text>}
      </div>
    </div>
  )
}

export default Table
