import axios from 'axios';
import { CURRENCY_API } from '@config/config';
import { ERROR_MESSAGES } from '@src/constants';

import convertPrice from '../convert-price.helper';

const { API_URL, ROUTES } = CURRENCY_API;

jest.mock('axios');

describe('convertPrice function', () => {
  describe('when correct parameters was passed', () => {
    beforeAll(() => {
      const mockedToExistCurrency = 'GBP';
      const mockedRate = 2;
      const mockedResponse = {
        data: {
          rates: {
            [mockedToExistCurrency]: mockedRate
          },
        },
      };
      axios.get.mockReturnValue(mockedResponse);
    });

    describe('and rate exists', () => {
      it('should fetch price with correct params and return correct converted price', async () => {
        const mockedFromCurrency = 'USD';
        const mockedToCurrency = 'GBP';
        const mockedValue = 5;
        const convertedPrice = await convertPrice(mockedFromCurrency, mockedToCurrency, mockedValue);

        expect(axios.get).toHaveBeenCalledWith(`${API_URL + ROUTES.latest}`, {
          params: {
            base: mockedFromCurrency,
            symbols: mockedToCurrency
          }
        });
        expect(convertedPrice).toEqual(10);
      })
    });

    describe('and rate does not exists', () => {
      it('should throw an error', async () => {
        const mockedFromCurrency = 'USD';
        const mockedToCurrency = 'BYN';
        const mockedValue = 5;
        try {
          await convertPrice(mockedFromCurrency, mockedToCurrency, mockedValue)
        } catch(e) {
          expect(e).toEqual(new Error(ERROR_MESSAGES.CONVERT_PRICE_ERROR));
        }
      })
    })
  });
});