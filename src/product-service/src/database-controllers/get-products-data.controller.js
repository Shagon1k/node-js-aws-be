import { ERROR_MESSAGES } from '@src/constants';
import { DataBaseError } from '@lib/errors';
import logger from '@lib/logger';

import { createDBConnection } from './helpers';

const GET_PRODUCTS_QUERY =
  `SELECT p.id, p.title, p.description, p.imageUrl, p.price, s.count
  FROM products p INNER JOIN stocks s ON (s.product_id = p.id)`;

const getProductsDBData = async () => {
	const dbClient = await createDBConnection();
	try {
		const { rows: productsData } = await dbClient.query(GET_PRODUCTS_QUERY);

		return productsData;
	} catch (error) {
		logger.error(error);

		throw new DataBaseError(ERROR_MESSAGES.DB_HANDLING_ERROR);
	} finally {
		dbClient.end();
	}
};

export default getProductsDBData;
