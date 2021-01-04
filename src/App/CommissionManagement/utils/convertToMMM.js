export const convertMMToMMM = (number) => {
    const objConvert = {
        '-2': 'out',
        '-1': 'nov',
        0: 'dez',
        1:'jan',
        2:'fev',
        3:'mar',
        4:'abr',
        5:'mai',
        6:'jun',
        7:'jul',
        8:'ago',
        9:'set',
        10:'out',
        11:'nov',
        12:'dez'
    }
    return objConvert[number]
}

export const convertMMMToMM = (str) => {
    const objConvert = {
        'jan':1,
        'fev':2,
        'mar':3,
        'abr':4,
        'mai':5,
        'jun':6,
        'jul':7,
        'ago':8,
        'set':9,
        'out':10,
        'nov':11,
        'dez':12
    }
    return objConvert[String(str)]
}