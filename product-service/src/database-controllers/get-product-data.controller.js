import { createDBConnection } from './helpers';

const generateGetProductQuery = (productId) =>
  `SELECT p.id, p.title, p.description, p.imageUrl, p.price, s.count
  FROM products p INNER JOIN stocks s ON (s.product_id = p.id) WHERE (p.id = '${productId}')`;

const getProductDBData = async (productId) => {
	const dbClient = await createDBConnection();
	try {
    const dbData = await dbClient.query(generateGetProductQuery(productId));
    const productData = dbData?.rows?.[0];

		return productData;
	} catch (error) {
		console.log(error);
	} finally {
		dbClient.end();
	}
};

export default getProductDBData;
