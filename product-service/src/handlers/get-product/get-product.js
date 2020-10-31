import productsContent from '@data/guitars-list.json';
import { ERROR_MESSAGES } from '@handlers/constants';

import { prepareErrorResponse, convertPrice } from '../helpers';

async function getProduct(event) {
  try {
    const { productId } = event.pathParameters;
    const productData = productsContent.find(el => el.id === productId);

    if (!productData) {
      throw new Error(ERROR_MESSAGES.NO_SUCH_PRODUCT)
    }

    const { value: priceValue, currency: priceCurrency = 'USD' } = productData?.price || {};

    const priceGBP = await convertPrice(priceCurrency, 'GBP', priceValue);

    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers' : 'Content-Type',
        'Access-Control-Allow-Origin': 'https://d2zvo2vdnqfgz1.cloudfront.net', // TODO: Add multi-origin support (check how to get event origin)
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
      },
      body: JSON.stringify({
        message: 'Product Info',
        data: {
          ...productData,
          priceGBP
        }
      })
    };

    return response;
  } catch (error) {
    console.log('Get product request error', error);

    const errorResponse = prepareErrorResponse(error, 500);

    return errorResponse;
  }
};

export default getProduct;
