export default (value,setValue,index) => {
    let _value = value.replace(',','')
    _value = parseInt(_value).toString()
    if(/^[0-9]*$/gm.test(_value)) {
        const r = _value.substring(0,_value.length-2)||'0'
        let c = _value.substring(_value.length-2)
        if(c.length==1) c = `0${c}`
        setValue('price', `${r},${c}`, index)
    }
}