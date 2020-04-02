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
    numberFormatter = (num) => num ? (floatFormatter(num.replace(/\,/g, '.'))) : '',
    dateHourFormatter = (date) => {
        const cadastro = date.toLocaleString("en-GB")
        const mes = cadastro.substring(3, 5)
        const dia = cadastro.substring(0, 2)
        const ano = cadastro.substring(6, 10)
        const hora = cadastro.substring(12)
        return `${mes}/${dia}/${ano} ${hora}`
    },
    singleDateFormatter = (date) => {
        if (date) {
            let parts = date.split('/')
            return `${parts[0]}/${months[parts[1]]}/${parts[2]}`
        } else return ''
    },
    // Realiza o percorrimento circular do 0 - 23
    // Para ajustar a hora para Utc-3, subtrai 2 unidades (por conta da hora zero diminui uma unidade)
    // Soma a hora mais 21 por conta do desconto das 2 horas
    hourFormat = (hour) => {
        let partsHour = hour.split(':')
        let hourUtc3 = (parseInt(partsHour[0]) + 21) % 24
        return `${hourUtc3 >= 10 ? hourUtc3 : `0${hourUtc3}`}:${partsHour[1]}:${partsHour[2]}`

    },
    dateHourFormatterUTC3 = (date) => {
        let utc = date.toUTCString()
        let parts = utc.substr(5).split(' ')
        return `${date.getDate()}/${date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`}/${parts[2]} ${hourFormat(parts[3])}`
    }
