import {convertMMToMMM} from './convertToMMM'

const arrayMonthYear = () => {
  const monthToday = new Date().getMonth() + 1
  const thisYear = String(new Date().getFullYear()).slice(2,4)
  const year = (monthNumber) => {
    return monthNumber > 0 ? thisYear : String(Number(thisYear)-1)
  }
  return [
    {mes:convertMMToMMM(monthToday-3), ano: year(monthToday-3)},
    {mes:convertMMToMMM(monthToday-2), ano: year(monthToday-2)},
    {mes:convertMMToMMM(monthToday-1), ano: year(monthToday-1)},
    {mes: convertMMToMMM(monthToday), ano: year(monthToday)}
  ]
}

export default arrayMonthYear