import { TableDataProps } from "./types"

export const validateTable = (data: TableDataProps) => {
  const { header, rows, totals } = data
  rows.forEach(row => {
    if (header.length !== row.length)
      throw new Error("A quantidade de índices em Header e cada Row dentro de Rows devem ser iguais.")
    if (row.length < 2)
      throw new Error("A quantidade de índices em cada Row dentro de Rows deve ser maior ou igual a 2.")
  })

  if (header.length < 2) throw new Error("A quantidade de índices em Header deve ser maior ou igual a 2.")
  if (totals.length < 2) throw new Error("A quantidade de índices em Totals deve ser maior ou igual a 2.")
  if (header.length !== totals.length) throw new Error("A quantidade de índices em Header e Totals devem ser iguais.")
}
