import { getProductsDBData } from '@database-controllers';

import { prepareErrorResponse, getAccessOriginHeader } from '../helpers';

export const responseMsg = 'Products List';

async function getProductsList(event) {
  try {
    console.log('Get products list lambda triggered');

    const requestOrigin = event?.headers?.origin || '';
    const productsData = await getProductsDBData();
    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers' : 'Content-Type',
        'Access-Control-Allow-Origin': getAccessOriginHeader(requestOrigin),
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
      },
      body: JSON.stringify({
        message: responseMsg,
        data: productsData,
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

export default getProductsList;
