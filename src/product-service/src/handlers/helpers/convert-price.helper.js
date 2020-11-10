import axios from 'axios';
import { CURRENCY_API } from '@config/config';
import { ERROR_MESSAGES } from '@src/constants';

const convertPrice = async (fromCurrency, toCurrency, value) => {
  const { API_URL, ROUTES } = CURRENCY_API;

  const exchangeRateResponse = await axios.get(`${API_URL + ROUTES.latest}`, {
    params: {
      base: fromCurrency,
      symbols: toCurrency
    }
  });

  const rate = exchangeRateResponse?.data?.rates?.[toCurrency];
  if (!rate) {
    throw new Error(ERROR_MESSAGES.CONVERT_PRICE_ERROR);
  }

  const convertedPrice = rate * value;
  const convertedPriceFixed = +convertedPrice.toFixed(1)

  return convertedPriceFixed;
}

export default convertPrice;
