export function calcTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}

export function calcTotalWithDiscount(items) {
  const unitPrices = [];

  items.forEach((item) => {
    for (let i = 0; i < item.qty; i++) {
      unitPrices.push(item.price);
    }
  });

  unitPrices.sort((a, b) => a - b);

  let total = 0;
  let discount = 0;

  for (let i = 0; i < unitPrices.length; i++) {
    if ((i + 1) % 3 === 0) {
      discount += unitPrices[i];
      continue;
    }
    total += unitPrices[i];
  }

  const totalBeforeDiscount = unitPrices.reduce((sum, price) => sum + price, 0);

  return {
    totalBeforeDiscount,
    discount,
    total,
  };
}
