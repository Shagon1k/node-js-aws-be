import { addProductToDB } from '@database-controllers';
import { ERROR_MESSAGES } from '@src/constants';
import { BadRequestError } from '@lib/errors';
import { prepareErrorResponse, getAccessOriginHeader } from '../helpers';
import logger from '@lib/logger';

export const responseMsg = 'Product was added!';

const checkIsDataValid = (productData) => {
	const { title, description, imageurl, price } = productData;

	return (
		typeof title === 'string' &&
		typeof description === 'string' &&
		typeof imageurl === 'string' &&
		typeof price === 'number'
	);
};

async function addProduct(event) {
	try {
		logger.log('Add product lambda triggered with event: ', event);

		const requestOrigin = event?.headers?.origin || '';
    const productData = JSON.parse(event?.body);

    if (!checkIsDataValid(productData)) {
      throw new BadRequestError(ERROR_MESSAGES.INVALID_PRODUCT);
    }

		const { title, description, imageurl, price, count } = productData;

		const newProductDBData = await addProductToDB({ title, description, imageurl, price, count });

		const response = {
			statusCode: 201,
			headers: {
				'Access-Control-Allow-Headers': 'Content-Type',
				'Access-Control-Allow-Origin': getAccessOriginHeader(requestOrigin),
				'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
			},
			body: JSON.stringify({
				message: responseMsg,
				data: newProductDBData,
			}),
		};

		return response;
	} catch (error) {
		logger.log('Add product request error', error);

		const statusCode = error.code || 500;
		const errorResponse = prepareErrorResponse(error, statusCode);

		return errorResponse;
	}
}

export default addProduct;
