const sumTextNumbers = (arrayTextNumbers) => {
    const arrayNumber = arrayTextNumbers.map(numText => {
        return Number(numText)
    })
    const sumElements = arrayNumber.reduce((a, b) => a + b, 0)
    const roundSum = (Math.round(sumElements*100))/100
    const transformToPorcentText = (num) => {
        if(num === 0){
            return '0,00%'
        }
        console.log('num',num)
        const result = `${String(num).replace('.',',')}`
        console.log('result',result)
        if(result.split(',')[1] && result.split(',')[1].length === 2){
            return `${result}%`
        }
        return `${result}0%`
    }
    return transformToPorcentText(roundSum)
}

export default sumTextNumbers
