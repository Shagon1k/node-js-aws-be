import AWS from 'aws-sdk';
import { prepareErrorResponse, getAccessOriginHeader } from '../helpers';
import { BUCKET_NAME, BUCKET_REGION } from '@config/config';
import { BadRequestError } from '@lib/errors';
import logger from '@lib/logger';
import { ERROR_MESSAGES } from '@src/constants';

export const responseMsg = 'Import signed url created successfully!';

async function importProductsFile(event) {
  try {
    logger.log('Import products lambda triggered');
    const requestOrigin = event?.headers?.origin || '';
    const { name } = event?.queryStringParameters || {};
    if (!name) {
      throw new BadRequestError(ERROR_MESSAGES.IMPORT_INVALID_PARAMS);
    }

    const s3 = new AWS.S3({ region: BUCKET_REGION, signatureVersion: 'v4' });
    const importKey = `uploaded/${name}`
    const s3Params = {
      Bucket: BUCKET_NAME,
      Key: importKey,
      Expires: 60,
      ContentType: 'text/csv'
    };

    /* Note: Using asynchronous flow with callback is more safe in case credentials will expire.
     * Alternative (synchronous) implementation:
     * const signedUrl = s3.getSignedUrl('putObject', s3Params);
     */
    const signedUrl = await new Promise(function(resolve, reject) {
      s3.getSignedUrl('putObject', s3Params, function(err, data) {
          if (err) {
              reject(err);
          } else {
              resolve(data);
          }
      });
    });

    logger.log('Created signed url:', signedUrl);

    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers' : 'Content-Type',
        'Access-Control-Allow-Origin': getAccessOriginHeader(requestOrigin),
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
      },
      body: JSON.stringify({
        message: responseMsg,
        data: signedUrl,
      }),
    };

    return response;
  } catch (error) {
    logger.error('Import products file failed!', error);

    const statusCode = error.code || 500;
    const errorResponse = prepareErrorResponse(error, statusCode);

    return errorResponse;
  }
};

export default importProductsFile;
