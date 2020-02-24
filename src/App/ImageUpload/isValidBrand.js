const isValidBrand = (brands, brand) => {
	if (!(brands instanceof Array)) return false
	if (brands.length === 0) return false
	return brands.includes(brand)
}

export default isValidBrand