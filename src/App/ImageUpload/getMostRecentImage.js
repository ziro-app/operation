const getMostRecentImage = uploadResult => {
	return uploadResult.reduce(([prevUrl,prevTime], [currentUrl,currentTime]) =>
		prevTime > currentTime ? [prevUrl,prevTime] : [currentUrl,currentTime])
}

export default getMostRecentImage