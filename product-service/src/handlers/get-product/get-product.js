import { getProductDBData } from '@database-controllers';
import { ERROR_MESSAGES } from '@src/constants';
import { NotFoundError } from '@lib/errors';

import { prepareErrorResponse, convertPrice, getAccessOriginHeader } from '../helpers';

export const responseMsg = 'Product Info';

async function getProduct(event) {
  try {
    const requestOrigin = event?.headers?.origin || '';
    const { productId } = event.pathParameters;
    const productData = await getProductDBData(productId);

    if (!productData) {
      throw new NotFoundError(ERROR_MESSAGES.NO_SUCH_PRODUCT)
    }

    const { price } = productData;

    const priceGBP = await convertPrice('USD', 'GBP', price);

    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers' : 'Content-Type',
        'Access-Control-Allow-Origin': getAccessOriginHeader(requestOrigin),
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
      },
      body: JSON.stringify({
        message: responseMsg,
        data: {
          ...productData,
          priceGBP
        }
      })
    };

    return response;
  } catch (error) {
    console.log('Get product request error', error);

    const statusCode = error.code || 500;
    const errorResponse = prepareErrorResponse(error, statusCode);

    return errorResponse;
  }
};

export default getProduct;
