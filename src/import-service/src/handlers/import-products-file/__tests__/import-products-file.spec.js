import importProductsFile, { responseMsg } from '../import-products-file';
import { prepareErrorResponse, getAccessOriginHeader } from '@handlers/helpers';

import { BadRequestError } from '@lib/errors';
import { ERROR_MESSAGES } from '@src/constants';

import AWS from 'aws-sdk-mock';

jest.mock('@handlers/helpers');

let mockedOrigin;
let mockedSignedUrl;

describe('importProductsFile function', () => {
  beforeAll(() => {
    mockedSignedUrl = 'mockedSignedUrl';
    mockedOrigin = 'http://allowed-origin.com';

    getAccessOriginHeader.mockReturnValue(mockedOrigin)
    AWS.mock('S3', 'getSignedUrl', mockedSignedUrl);
  });
  afterAll(() => {
    AWS.restore('S3');
  });

  describe('when "name" query parameter was missed', () => {
    const mockedEvent = {
      headers: {
        origin: mockedOrigin
      },
      queryStringParameters: {
        notName: 'test-name.csv'
      }
    };

    it('should throw BadRequestError', async () => {
      await importProductsFile(mockedEvent);

      expect(prepareErrorResponse).toHaveBeenCalledWith(new BadRequestError(ERROR_MESSAGES.IMPORT_INVALID_PARAMS), 400);
    });
  });

  describe('when "name" query parameter passed correctly', () => {
    const mockedEvent = {
      heades: {
        origin: mockedOrigin
      },
      queryStringParameters: {
        name: 'test-name.csv'
      }
    };

    it('should return correct response with signed url to use', async () => {
      const expectedResult = {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
          'Access-Control-Allow-Origin': mockedOrigin,
        },
        body: JSON.stringify({
          message: responseMsg,
          data: mockedSignedUrl
        })
      }
      const response = await importProductsFile(mockedEvent);

      expect(response).toEqual(expectedResult);
    });
  })
});
