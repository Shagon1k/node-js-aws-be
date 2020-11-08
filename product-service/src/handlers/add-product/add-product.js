import { addProductToDB } from '@database-controllers';
import { prepareErrorResponse, getAccessOriginHeader } from '../helpers';

export const responseMsg = 'Product was added!';

async function addProduct(event) {
  try {
    console.log('Add product lambda triggered with event: ', event);

    const requestOrigin = event?.headers?.origin || '';
    const productData = JSON.parse(event?.body);
    const { title, description, imageurl, price, count } = productData;

    const newProductDBData = await addProductToDB({ title, description, imageurl, price, count });

    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers' : 'Content-Type',
        'Access-Control-Allow-Origin': getAccessOriginHeader(requestOrigin),
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
      },
      body: JSON.stringify({
        message: responseMsg,
        data: newProductDBData
      })
    };

    return response;
  } catch (error) {
    console.log('Add product request error', error);

    const statusCode = error.code || 500;
    const errorResponse = prepareErrorResponse(error, statusCode);

    return errorResponse;
  }
};

export default addProduct;
