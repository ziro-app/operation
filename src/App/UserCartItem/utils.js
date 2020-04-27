export const reduceItem = price => {
    const priceNumber = price ? parseFloat(price.replace(',', '.')) : 0;
    return ([prevItems, prevPrice], cur) => (cur ? [prevItems + parseInt(cur), prevPrice + parseInt(cur) * priceNumber] : [prevItems, prevPrice]);
  },
  reduceTotal = ([prevItems, prevPrice], cur) => {
    if (!cur || !cur.requestedQuantities || !cur.price) return [prevItems, prevPrice];
    const [curItems, curPrice] = Object.values(cur.requestedQuantities).reduce(reduceItem(cur.price), [0, 0]);
    return [prevItems + curItems, prevPrice + curPrice];
  };
