export const ALLOWED_REQUEST_ORIGINS = [
	'http://localhost:3000',
	'https://d2zvo2vdnqfgz1.cloudfront.net',
	'http://d2zvo2vdnqfgz1.cloudfront.net',
];

export const BUCKET_NAME = 'rs-school-app-shagon1k-uploaded';
export const BUCKET_REGION = 'eu-west-1';

export const S3_FOULDERS_NAMES_MAP = {
	UPLOADED: 'uploaded',
	PARSED: 'parsed',
};

export const SQS_URL = process.env.SQS_URL;
