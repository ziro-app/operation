const arrayAdresses = (array) => {
    if(array.length === 2){
        return [`${array[0]} -- ${array[1]}`]
    }
    if(array.length === 4){
        return [`${array[0]} -- ${array[1]}`, `${array[2]} -- ${array[3]}`]
    }
    if(array.length === 6){
        return [`${array[0]} -- ${array[1]}`, `${array[2]} -- ${array[3]}`, `${array[4]} -- ${array[5]}`]
    }
    if(array.length === 8){
        return [`${array[0]} -- ${array[1]}`, `${array[2]} -- ${array[3]}`, `${array[4]} -- ${array[5]}`, `${array[6]} -- ${array[7]}`]
    }
    if(array.length === 10){
        return [`${array[0]} -- ${array[1]}`, `${array[2]} -- ${array[3]}`, `${array[4]} -- ${array[5]}`, `${array[6]} -- ${array[7]}`, `${array[8]} -- ${array[9]}`]
    }
    if(array.length === 12){
        return [`${array[0]} -- ${array[1]}`, `${array[2]} -- ${array[3]}`, `${array[4]} -- ${array[5]}`, `${array[6]} -- ${array[7]}`, `${array[8]} -- ${array[9]}`, `${array[10]} -- ${array[11]}`]
    }
    return []
}

export default arrayAdresses