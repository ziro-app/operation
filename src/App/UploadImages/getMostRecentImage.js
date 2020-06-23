const getMostRecentImage = uploadResult =>
    uploadResult.reduce(([prevUrl, prevTime], [currentUrl, currentTime]) =>
        prevTime > currentTime ? [prevUrl, prevTime] : [currentUrl, currentTime]);

export default getMostRecentImage;
