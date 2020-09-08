const removeDuplicates = arrayWithDuplicates => {
	if (!arrayWithDuplicates) throw new Error('function removeDuplicates must receive an array')
	if (!(arrayWithDuplicates instanceof Array)) throw new Error('function removeDuplicates must receive an array')
	return arrayWithDuplicates.flat().reduce((accumulated, current) => {
		if (accumulated.includes(current)) return accumulated
		return [...accumulated, current]
	}, [])
}

export default removeDuplicates