const months = {
    '01': 'Jan',
    '02': 'Fev',
    '03': 'Mar',
    '04': 'Apr',
    '05': 'May',
    '06': 'Jun',
    '07': 'Jul',
    '08': 'Aug',
    '09': 'Sep',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dec'
}

export const intFormatter = (num) => num ? parseInt(num) : '',
floatFormatter = (num) => num ? parseFloat(num) : '',
numberFormatter = (num) => num? (floatFormatter(num.replace(/\,/g, '.'))) : '',
dateHourFormatter = (date) => {
    let dateString = date.toString()
    return `${date.getMonth()+1}/${dateString.substr(8,2)}/${dateString.substr(11,13)}`
},
singleDateFormatter = (date) => {
    if(date){
        let parts = date.split('/')
        return `${parts[0]}/${months[parts[1]]}/${parts[2]}`
    } else return ''
}
