import { addProductToDB } from '@database-controllers';
import { ERROR_MESSAGES } from '@src/constants';
import { BadRequestError } from '@lib/errors';
import { prepareErrorResponse, getAccessOriginHeader } from '../helpers';

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

async function catalogBatchProcess(event) {
		console.log('Catalog batch process lambda triggered with event: ', event);

    const productData = JSON.parse(event?.body);

    console.log(productData);

    // if (!checkIsDataValid(productData)) {
    //   throw new BadRequestError(ERROR_MESSAGES.INVALID_PRODUCT);
    // }

		// const { title, description, imageurl, price, count } = productData;

		// const newProductDBData = await addProductToDB({ title, description, imageurl, price, count });

		const response = {
      statusCode: 202,
    };

    return response;
}

export default catalogBatchProcess;
