import getProductsList, { responseMsg } from '../get-products-list';
import { getProductsDBData } from '@database-controllers';
import { prepareErrorResponse, getAccessOriginHeader } from '@handlers/helpers';

jest.mock('@handlers/helpers');
jest.mock('@database-controllers');

const mockedProductsData = [
  { testProduct: 'testProduct1', id: 'testProduct1' },
  { testProduct: 'testProduct2', id: 'testProduct2' },
];

let mockedOrigin;
let mockedError;

describe('getProductsList function', () => {
  beforeAll(() => {
    getProductsDBData.mockImplementation(() => mockedProductsData)
  });

  describe('when correct event passed', () => {
    describe('and allowed origin was passed', () => {
      beforeAll(() => {
        mockedOrigin = 'http://allowed-origin.com';
        getAccessOriginHeader.mockReturnValue(mockedOrigin)
      })

      it('should return correct response', async () => {
        const mockedEvent = {
          headers: {
            origin: mockedOrigin
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
            data: mockedProductsData
          })
        }
        const response = await getProductsList(mockedEvent);

        expect(response).toEqual(expectedResult);
      });
    })

    describe('and not allowed origin was passed', () => {
      beforeAll(() => {
        mockedOrigin = 'http://not-allowed-origin.com';
        getAccessOriginHeader.mockReturnValue('')
      })

      it('should return correct response but with reduced allowed origin header', async () => {
        const mockedEvent = {
          headers: {
            origin: mockedOrigin
          }
        };
        const expectedResult = {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
            'Access-Control-Allow-Origin': '',
          },
          body: JSON.stringify({
            message: responseMsg,
            data: mockedProductsData
          })
        }
        const response = await getProductsList(mockedEvent);

        expect(response).toEqual(expectedResult);
      });
    });

    describe('and something went wrong', () => {
      beforeAll(() => {
        mockedError = new Error('Error!');
        getAccessOriginHeader.mockImplementation(() => {
          throw mockedError
        });
      })

      it('should return correct error response', async () => {
        const mockedEvent = {
          headers: {
            origin: 'Origin'
          }
        };
        await getProductsList(mockedEvent);
        expect(prepareErrorResponse).toHaveBeenCalledWith(mockedError, 500);
      });
    })
  });
});
