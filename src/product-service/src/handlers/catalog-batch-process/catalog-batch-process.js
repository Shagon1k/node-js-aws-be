import AWS from 'aws-sdk';
import { addProductToDB } from '@database-controllers';
import { ERROR_MESSAGES } from '@src/constants';
import { SNS_ARN, SQS_URL, SNS_REGION } from '@config/config';
import snsFilterConfig from '@config/sns-filter.config.json';
import logger from '@lib/logger';

export const responseMsg = 'Products was added!';

const FILTER_ELECTRIC_GUITAR_TYPE = snsFilterConfig.filter.values.electric;
const FILTER_NON_ELECTRIC_GUITAR_TYPE = snsFilterConfig.filter.values.nonelectric;

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
	const recordsData = event.Records.map(({ receiptHandle, body }) => ({ receiptHandle, data: JSON.parse(body) }));
	const addedProducts = [];

	logger.log('Received data: ', recordsData);

	for (let recordData of recordsData) {
		const { data: productData, receiptHandle } = recordData;

		if (!checkIsDataValid(productData)) {
			logger.log(ERROR_MESSAGES.INVALID_PRODUCT);
			logger.log('Product was not added!', productData);

			try {
				let deleteResp = await sqs
					.deleteMessage({
						QueueUrl: SQS_URL,
						ReceiptHandle: receiptHandle,
					})
					.promise();

				logger.log('Deleted SQS: ', deleteResp);
			} catch (error) {
				logger.log(`Error occured when deleting receipt: ${receiptHandle}`, error);
			}
		} else {
			const { title, description, imageurl, price, count } = productData;
			const newProductDBData = await addProductToDB({ title, description, imageurl, price, count });

			logger.log('Send email for subscriber, data: ', JSON.stringify(newProductDBData));

			const guitarType =
				title.toLowerCase().indexOf('electric') > -1
					? FILTER_ELECTRIC_GUITAR_TYPE
					: FILTER_NON_ELECTRIC_GUITAR_TYPE;

			logger.log('Newly added guitar type is: ', guitarType);

			try {
				let publishResp = await sns
					.publish({
						Subject: 'New guitar was added to DataBase',
						Message: `New guitar was added. Guitar info: ${JSON.stringify(newProductDBData)}`,
						TopicArn: SNS_ARN,
						MessageAttributes: {
							guitarType: {
								DataType: 'String',
								StringValue: guitarType,
							},
						},
					})
					.promise();

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
