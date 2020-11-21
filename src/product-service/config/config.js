export const CURRENCY_API = {
  API_URL: "https://api.exchangeratesapi.io/",
  ROUTES: {
    latest: "latest",
    history: "history",
  },
};

export const ALLOWED_REQUEST_ORIGINS = [
  "http://localhost:3000",
  "https://d2zvo2vdnqfgz1.cloudfront.net",
  "http://d2zvo2vdnqfgz1.cloudfront.net",
];

export const SNS_ARN = process.env.SNS_ARN;
export const SQS_URL = process.env.SQS_URL;
export const SNS_REGION = 'eu-west-1';
export const SQS_REGION = 'eu-west-1';