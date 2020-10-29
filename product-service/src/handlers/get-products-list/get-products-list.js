import productsContent from '@data/guitars-list.json';
import { prepareErrorResponse } from '../helpers';

async function getProductsList() {
  try {
    const response = {
      statusCode: 200,
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
