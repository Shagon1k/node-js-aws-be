import productsContent from '@data/guitars-list.json';
import { prepareErrorResponse } from '../helpers';

async function getProductsList() {
  try {
    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers' : 'Content-Type',
        'Access-Control-Allow-Origin': 'https://d2zvo2vdnqfgz1.cloudfront.net',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
      },
      body: JSON.stringify({
        message: 'Products List',
        data: productsContent,
      })
    };

    return response;
  } catch (error) {
    console.log('Get products list request failed', error);

    const errorResponse = prepareErrorResponse(error, 500);

    return errorResponse;
  }
};

export default getProductsList;
