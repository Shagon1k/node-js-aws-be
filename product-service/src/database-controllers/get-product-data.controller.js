import { ERROR_MESSAGES } from '@src/constants';
import { DataBaseError } from '@lib/errors';

import { createDBConnection } from './helpers';

const GET_PRODUCT_QUERY =
  `SELECT p.id, p.title, p.description, p.imageUrl, p.price, s.count
  FROM products p INNER JOIN stocks s ON (s.product_id = p.id) WHERE (p.id = $1)`;

const getProductDBData = async (productId) => {
	const dbClient = await createDBConnection();
	try {
    const values = [productId];
    const dbData = await dbClient.query(GET_PRODUCT_QUERY, values);
    const productData = dbData?.rows?.[0];

		return productData;
	} catch (error) {
    console.log(error);

    throw new DataBaseError(ERROR_MESSAGES.DB_HANDLING_ERROR);
	} finally {
		dbClient.end();
	}
};

export default getProductDBData;
