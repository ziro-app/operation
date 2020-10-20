import {convertMMToMMM} from './convertToMMM'

const arrayMonth = () => {
  const monthToday = new Date().getMonth() + 1
  if(monthToday === 3){
    return [convertMMToMMM(monthToday-2), convertMMToMMM(monthToday-1), convertMMToMMM(monthToday),]
  }
  if(monthToday === 2){
    return [convertMMToMMM(monthToday-1), convertMMToMMM(monthToday)]
  }
  if(monthToday === 1){
    return [convertMMToMMM(monthToday)]
  }
  return [convertMMToMMM(monthToday-3),convertMMToMMM(monthToday-2), convertMMToMMM(monthToday-1), convertMMToMMM(monthToday) ]
}

export default arrayMonth