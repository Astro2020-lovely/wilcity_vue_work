export const Money = {
  methods: {
    renderPrice(price, currencySymbol, position) {
      let priceHTML = "";
      switch (position) {
        case "left":
          priceHTML = `${currencySymbol}${price}`;
          break;
        case "right":
          priceHTML = `${price}${currencySymbol}`;
          break;
        case "left_space":
          priceHTML = `${currencySymbol} ${price}`;
          break;
        case "right_space":
          priceHTML = `${price} ${currencySymbol}`;
          break;
      }

      return priceHTML;
    }
  }
};
