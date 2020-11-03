import getProduct, { responseMsg } from '../get-product';
import { prepareErrorResponse, getAccessOriginHeader, convertPrice } from '@handlers/helpers';
import { ERROR_MESSAGES } from '@handlers/constants';

jest.mock('@handlers/helpers');

jest.mock('@data/guitars-list.json', () => [
  { testProduct: 'testProduct1', id: 'testProduct1' },
  { testProduct: 'testProduct2', id: 'testProduct2' },
]);

let mockedOrigin;
let mockedError;
let additionalProductData;

describe('getProduct function', () => {
  beforeAll(() => {
    const mockedPriceGBP = 500;
    additionalProductData = {
      priceGBP: mockedPriceGBP
    };
    convertPrice.mockReturnValue(Promise.resolve(mockedPriceGBP));
  });
  describe('when correct event passed', () => {
    describe('and allowed origin was passed', () => {
      beforeAll(() => {
        mockedOrigin = 'http://allowed-origin.com';
        getAccessOriginHeader.mockReturnValue(mockedOrigin)
      })
      describe('and product with passed product ID exists', () => {
        it('should return correct response', async () => {
          const mockedEvent = {
            headers: {
              origin: mockedOrigin
            },
            pathParameters: {
              productId: 'testProduct1'
            }
          };
          const expectedResult = {
            statusCode: 200,
            headers: {
              'Access-Control-Allow-Headers': 'Content-Type',
              'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
              'Access-Control-Allow-Origin': mockedOrigin,
            },
            body: JSON.stringify({
              message: responseMsg,
              data: {
                testProduct: 'testProduct1',
                id: 'testProduct1',
                ...additionalProductData
              }
            })
          }
          const response = await getProduct(mockedEvent);

          expect(response).toEqual(expectedResult);
        });
      });

      describe('and product with passed product ID does not exist', () => {
        it('should throw error handled by lambda itself', async () => {
          const mockedEvent = {
            headers: {
              origin: mockedOrigin
            },
            pathParameters: {
              productId: 'testProduct42'
            }
          };
          await getProduct(mockedEvent);
          expect(prepareErrorResponse).toHaveBeenCalledWith(new Error(ERROR_MESSAGES.NO_SUCH_PRODUCT), 500);
        });
      })

      describe('and something went wrong', () => {
        beforeAll(() => {
          mockedError = new Error('Error!');
          convertPrice.mockImplementation(() => {
            throw mockedError;
          });
        });
        it('should return correct error response', async () => {
          const mockedEvent = {
            headers: {
              origin: mockedOrigin
            },
            pathParameters: {
              productId: 'testProduct1'
            }
          };
          await getProduct(mockedEvent);
          expect(prepareErrorResponse).toHaveBeenCalledWith(mockedError, 500);
        });
      })
    });

    describe('and not allowed origin was passed', () => {
      beforeAll(() => {
        mockedOrigin = 'http://not-allowed-origin.com';
        getAccessOriginHeader.mockReturnValue('');
        convertPrice.mockClear();
      })
      it('should return correct response but with reduced Origin header', async () => {
        const mockedEvent = {
          headers: {
            origin: mockedOrigin
          },
          pathParameters: {
            productId: 'testProduct1'
          }
        };

        await getProduct(mockedEvent);
        expect(prepareErrorResponse).toHaveBeenCalledWith(mockedError, 500);
      });
    });
  });
});