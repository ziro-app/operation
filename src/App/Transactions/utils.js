import currencyFormat from '@ziro/currency-format';

export const round = (num, places) => {
    if (!("" + num).includes("e")) {
        return +(Math.round(num + "e+" + places) + "e-" + places);
    } else {
        let arr = ("" + num).split("e");
        let sig = ""
        if (+arr[1] + places > 0) {
            sig = "+";
        }
        return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + places)) + "e-" + places);
    }
},

    dateFormat = (date) => {
        if (date) {
            return new Date(date.seconds * 1000)
                .toLocaleDateString('pt-br', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                })
                .replace(' de ', '/');
        } else return '-';
    },

    parcelFormat = (number) => {
        if (number === 0) return '0,00';
        if (number > 0 && number < 1) return ('' + number).replace('.', ',');
        let numSplit = ('' + number).split('.');
        if (numSplit.length === 1) return `${number},00`;
        let num = numSplit[1].length === 1 ? `${number}0` : `${number}`
        const formatted = currencyFormat((num).replace('.', ''));
        return formatted.replace('R$', '').includes(',') ? formatted.replace('R$', '') : `${formatted.replace('R$', '')},00`;
    },

    stringToFloat = (str) => parseFloat(str.replace(/[R$\.,]/g, '')) / 100,
    internalFormat = value => {
        if (value) {
            const valueString = `${value}`
            if (valueString.match(/^0[0-9]{0,1}$|^[1-9]([0-9]?)+$/g)) {
                const noFormat = (parseInt(value, 10) / 100).toFixed(2)
                if (noFormat.length <= '6')
                    return `R$${noFormat.replace('.', ',')}`
                else {
                    const [integer, decimal] = noFormat.split('.')
                    const indexToSlice = integer.length - 3
                    const format = [integer.slice(0, indexToSlice), integer.slice(indexToSlice)].join('.')
                    return `R$${[format, decimal].join(',')}`
                }
            } else {
                const noFormat = `${round(value, 2)}`
                if (noFormat.length <= '7')
                    return `R$${noFormat.replace('.', ',')}`
                else {
                    const [integer, decimal] = noFormat.split('.')
                    const indexToSlice = integer.length - 3
                    const format = [integer.slice(0, indexToSlice), integer.slice(indexToSlice)].join('.')
                    return `R$${[format, decimal].join(',')}`
                }
            }
        }
        return ''
    }