const currencyFormat = (value) => {
  if (value || value === 0) {
    const valueString = `${parseFloat(value).toFixed(2) * 100}`;
    // checks if string is in integer format and if it only has 2 digits if starts with leading 0
    if (valueString.match(/^0[0-9]{0,1}$|^[1-9]([0-9]?)+$/g)) {
      const noFormat = (parseInt(value, 10) / 100).toFixed(2);
      if (noFormat.length <= "6") return `R$${noFormat.replace(".", ",")}`;
      else {
        const [integer, decimal] = noFormat.split(".");
        const indexToSlice = integer.length - 3;
        const format = [
          integer.slice(0, indexToSlice),
          integer.slice(indexToSlice)
        ].join(".");
        return `R$${[format, decimal].join(",")}`;
      }
    }
  }
  return "";
};

export default currencyFormat