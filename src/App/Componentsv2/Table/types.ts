export interface TableDataProps {
  // Cabeçalho da Tabela
  header: string[]
  // Linhas da Tabela
  rows: string[][]
  // Totals da Tabela
  totals: string[]
}

interface CommonProps {
  // Título da Tabela
  title: string
  // Array com as informações da Tabela
  data: TableDataProps
  // Estilos gerais da Tabela
  style?: React.CSSProperties
  // Estilos adicionais do corpo da Tabela
  styleBody?: React.CSSProperties
  // Estilos adicionais do cabeçalho da Tabela
  styleHeader?: React.CSSProperties
  // Estilos adicionais de cada célula da Tabela
  styleCell?: React.CSSProperties
  // Estilos adicionais do Totals da Tabela
  styleCellTotal?: React.CSSProperties
}

interface hasIcon extends CommonProps {
  // Ícone da Tabela
  Icon: React.ReactNode
  // Array com os caminhos para cada linha da tabela
  paths: string[]
}

interface noIcon extends CommonProps {
  Icon?: never
  // Array com os caminhos para cada linha da tabela
  paths?: never
}

export type TableProps = hasIcon | noIcon
