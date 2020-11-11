import AWS from 'aws-sdk';
import { prepareErrorResponse, getAccessOriginHeader } from '../helpers';
import { BUCKET_NAME, BUCKET_REGION } from '@src/constants';
import { BadRequestError } from '@lib/errors';
import { ERROR_MESSAGES } from '@src/constants';

export const responseMsg = 'Import signed url created successfully!';

const getBucketUrl = (bucketName) => `https://${bucketName}.s3.amazonaws.com/`;

async function importProductsFile(event) {
  try {
    console.log('Import products lambda triggered');
    const requestOrigin = event?.headers?.origin || '';
    const { name } = event?.queryStringParameters || {};
    if (!name) {
      throw new BadRequestError(ERROR_MESSAGES.IMPORT_INVALID_PARAMS);
    }

    // TODO: Worth to check whether such file already exists via s3.listObjectsV2(...).Contents
    const s3 = new AWS.S3({ region: BUCKET_REGION, signatureVersion: 'v4' });
    const importKey = `uploaded/${name}`
    const s3Params = {
      Bucket: BUCKET_NAME,
      Key: importKey
    };

    await s3.putObject(s3Params).promise();

    const signedUrl = `${getBucketUrl(BUCKET_NAME)}${importKey}`;
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
    console.log('Get products list request failed', error);

    const statusCode = error.code || 500;
    const errorResponse = prepareErrorResponse(error, statusCode);

    return errorResponse;
  }
};

export default importProductsFile;
