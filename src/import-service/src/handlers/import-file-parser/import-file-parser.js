import AWS from 'aws-sdk';
import csv from 'csv-parser';
import { BUCKET_NAME, BUCKET_REGION, S3_FOULDERS_NAMES_MAP, SQS_URL } from '@config/config';
import logger from '@lib/logger';

const prepareProductData = (data) => {
  let preparedData = {};
  const { price: originalPrice } = data;

  preparedData = {
    ...data,
    price: originalPrice ? Number(originalPrice) : undefined
  }

  return preparedData;
}

async function importFileParser(event) {
	logger.log('Import file parser lambda triggered');

	const s3 = new AWS.S3({ region: BUCKET_REGION });
	const s3DefaultParams = {
		Bucket: BUCKET_NAME,
  };

  const sqs = new AWS.SQS();

	const recordsPromises = event.Records.map(
		(record) =>
			new Promise((resolve, reject) => {
				const originalRecordKey = record?.s3.object.key;
				const parsedRecordKey = originalRecordKey.replace(
					S3_FOULDERS_NAMES_MAP.UPLOADED,
					S3_FOULDERS_NAMES_MAP.PARSED
				);

				// Getting newly added object
				const s3ReadStream = s3.getObject({ ...s3DefaultParams, Key: originalRecordKey }).createReadStream();

				s3ReadStream
					.pipe(csv())
					.on('data', (data) => {
            logger.log('CSV parse stream data:', data);
            const preparedData = prepareProductData(data);
            const stringifiedData = JSON.stringify(preparedData);
            sqs.sendMessage({
              QueueUrl: SQS_URL,
              MessageBody: stringifiedData
            }, (error) => {
              if (error) {
                console.log('error', error);
              } else {
                console.log(`Send message to ${SQS_URL}. Message: ${stringifiedData}`);
              }
            });

					})
					.on('error', (error) => reject(error))
					.on('end', async () => {
						const copySource = `${BUCKET_NAME}/${originalRecordKey}`;

						logger.log('Copying from: ', copySource);
						logger.log('Copying to: ', parsedRecordKey);

						// Copying parsed record from 'uploaded' into 'parsed' folder
						await s3
							.copyObject({
								...s3DefaultParams,
								CopySource: copySource,
								Key: parsedRecordKey,
							})
							.promise();

						logger.log('Successfully copied!');
						logger.log('Removing original record: ', originalRecordKey);

						// Removing original record from 'uploaded' folder
						await s3
							.deleteObject({
								...s3DefaultParams,
								Key: originalRecordKey,
							})
							.promise();

						logger.log('Successfully removed!');

						resolve(`Record ${originalRecordKey} handled successfully!`);
					});
			})
	);

	const parseResults = await Promise.all(recordsPromises);

	const response = {
		statusCode: 202,
		body: JSON.stringify(parseResults),
	};

	return response;
}

export default importFileParser;
