import AWS from 'aws-sdk';
import { addProductToDB } from '@database-controllers';
import { ERROR_MESSAGES } from '@src/constants';
import { SNS_ARN, SQS_URL, SNS_REGION } from '@config/config';
import logger from '@lib/logger';

export const responseMsg = 'Products was added!';

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
	logger.log('Catalog batch process lambda triggered with event: ', event);

	const sns = new AWS.SNS({ region: SNS_REGION });
  const sqs = new AWS.SQS();
  const recordsData = event.Records.map(({ receiptHandle, body }) => ({receiptHandle, data: JSON.parse(body)}));
	const addedProducts = [];

	logger.log('Received data: ', recordsData);

	for (let recordData of recordsData) {
    const {
      data: productData,
      receiptHandle
    } = recordData;

		if (!checkIsDataValid(productData)) {
			logger.log(ERROR_MESSAGES.INVALID_PRODUCT);
      logger.log('Product was not added!', productData);

      try {
        let deleteResp = await sqs.deleteMessage({
          QueueUrl: SQS_URL,
          ReceiptHandle: receiptHandle
        }).promise();

        logger.log('Deleted SQS: ', deleteResp);
      } catch (error) {
        logger.log(`Error occured when deleting receipt: ${receiptHandle}`, error);
      }

		} else {
			const { title, description, imageurl, price, count } = productData;
      const newProductDBData = await addProductToDB({ title, description, imageurl, price, count });

      logger.log('Send email for subscriber, data: ', JSON.stringify(newProductDBData));

      try {
        let publishResp = await sns.publish(
          {
            Subject: 'New guitar was added to DataBase',
            Message: `New guitar was added. Guitar info: ${JSON.stringify(newProductDBData)}`,
            TopicArn: SNS_ARN,
          }
        ).promise();

        logger.log('Publish data', publishResp);
      } catch (error) {
        logger.log('Error occured when sending email', error);
      }

			addedProducts.push(newProductDBData);
		}
	}

	logger.log('Added products: ', addedProducts);

	const response = {
		statusCode: 202,
		message: responseMsg,
		data: {
			addedProducts: JSON.stringify(addedProducts),
		},
	};

	return response;
}

export default catalogBatchProcess;
