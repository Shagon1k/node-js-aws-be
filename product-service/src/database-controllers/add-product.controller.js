import { ERROR_MESSAGES } from '@src/constants';
import { DataBaseError } from '@lib/errors';

import { createDBConnection } from './helpers';

const ADD_PRODUCT_QUERY = `INSERT INTO products (title, description, imageUrl, price)
  VALUES($1, $2, $3, $4) RETURNING *`;
const ADD_STOCK_QUERY = `INSERT INTO stocks (product_id, count) VALUES($1, $2)`;

const GET_PRODUCT_QUERY =
  `SELECT p.id, p.title, p.description, p.imageUrl, p.price, s.count
  FROM products p INNER JOIN stocks s ON (s.product_id = p.id) WHERE (p.id = $1)`;

const addProductToDB = async ({ title, description, imageurl, price, count = 0 }) => {
	const dbClient = await createDBConnection();
	try {
		const productDataValues = [title, description, imageurl, price];
		const { rows: productsData } = await dbClient.query(ADD_PRODUCT_QUERY, productDataValues);

    const addedProductId = productsData?.[0]?.id;
    const stockDataValues = [addedProductId, count];
    await dbClient.query(ADD_STOCK_QUERY, stockDataValues);

    const newProductDBData = await dbClient.query(GET_PRODUCT_QUERY, [addedProductId]);
    const productData = newProductDBData?.rows?.[0];

		return productData;

	} catch (error) {
		console.log(error);

		throw new DataBaseError(ERROR_MESSAGES.DB_HANDLING_ERROR);
	} finally {
		dbClient.end();
	}
};

export default addProductToDB;
