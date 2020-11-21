import AWS from 'aws-sdk';
import { addProductToDB } from '@database-controllers';
import { ERROR_MESSAGES } from '@src/constants';
import { SNS_ARN, SNS_REGION } from '@config/config';

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

    const sns = new AWS.SNS({ region: SNS_REGION })

    const productsData = event.Records.map(({ body }) => JSON.parse(body));
    const addedProducts = [];

    console.log('Received data: ', productsData);

    for (let productData of productsData) {
      if (!checkIsDataValid(productData)) {
        console.log(ERROR_MESSAGES.INVALID_PRODUCT);
        console.log('Product was not added! ', productData);

        return;
      };
      const { title, description, imageurl, price, count } = productData
      const newProductDBData = await addProductToDB({ title, description, imageurl, price, count });

      sns.publish({
        Subject: 'New guitar was added to DataBase',
        Message: `New guitar was added. Guitar info: ${JSON.stringify(newProductDBData)}`,
        TopicArn: SNS_ARN
      }, (error) => {
        if (error) {
          console.log('Error occured during subscribtion', error);
        }
        console.log('Send email for subscriber, data: ', JSON.stringify(newProductDBData));
      })

      addedProducts.push(newProductDBData);
    }

    console.log('Added products: ', addedProducts);

		const response = {
      statusCode: 202,
      addedProducts: JSON.stringify(addedProducts)
    };

    return response;
}

export default catalogBatchProcess;
