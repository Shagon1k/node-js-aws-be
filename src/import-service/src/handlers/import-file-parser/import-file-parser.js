import AWS from 'aws-sdk';
import csv from 'csv-parser';
import { BUCKET_NAME, BUCKET_REGION, S3_FOULDERS_NAMES_MAP } from '@config/config';

function importFileParser(event) {
	console.log('Import file parser lambda triggered');

	const s3 = new AWS.S3({ region: BUCKET_REGION });

	event.Records.forEach((record) => {
		const s3DefaultParams = {
			Bucket: BUCKET_NAME,
		};

		const originalRecordKey = record?.s3.object.key;
		const parsedRecordKey = originalRecordKey.replace(
			S3_FOULDERS_NAMES_MAP.UPLOADED,
			S3_FOULDERS_NAMES_MAP.PARSED
    );

    // Getting newly added object
    const s3ReadStream = s3.getObject({ ...s3DefaultParams, Key: originalRecordKey }).createReadStream();

    s3ReadStream.pipe(csv())
			.on('data', (data) => {
				console.log('CSV parse stream data:', data);
			})
			.on('end', async () => {
        const copySource = `${BUCKET_NAME}/${originalRecordKey}`;

        console.log('Copying from: ', copySource);
        console.log('Copying to: ', parsedRecordKey);

        // Copying parsed record from 'uploaded' into 'parsed' folder
				await s3
					.copyObject({
						...s3DefaultParams,
						CopySource: copySource,
						Key: parsedRecordKey,
					})
          .promise();

        console.log('Successfully copied!');
        console.log('Removing original record: ', originalRecordKey);

        // Removing original record from 'uploaded' folder
        await s3
          .deleteObject({
            ...s3DefaultParams,
            Key: originalRecordKey
          })
          .promise();

        console.log('Successfully removed!');
      });
	});
}

export default importFileParser;
