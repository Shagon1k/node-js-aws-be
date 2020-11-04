import { ERROR_MESSAGES } from '@src/constants';
import { DataBaseError } from '@lib/errors';

import { createDBConnection } from './helpers';

const generateGetProductsQuery = () =>
  `SELECT p.id, p.title, p.description, p.imageUrl, p.price, s.count
  FROM products p INNER JOIN stocks s ON (s.product_id = p.id)`;

const getProductsDBData = async () => {
	const dbClient = await createDBConnection();
	try {
		const { rows: productsData } = await dbClient.query(generateGetProductsQuery());

		return productsData;
	} catch (error) {
    console.error(error);

    throw new DataBaseError(ERROR_MESSAGES.DB_HANDLING_ERROR);
	} finally {
		dbClient.end();
	}
};

export default getProductsDBData;
