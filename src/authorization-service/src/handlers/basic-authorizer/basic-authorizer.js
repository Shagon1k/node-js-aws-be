import logger from '@lib/logger';
import { UNAUTHORIZED_STATUS_MESSAGE, BASIC_AUTHORIZATION_TYPE, ALLOW_EFFECT, DENY_EFFECT } from '@src/constants';

const checkIfBasicAuthorizationType = (parsedAuthorizationType) => parsedAuthorizationType === BASIC_AUTHORIZATION_TYPE;

const checkPassedCredentialsValid = (username, password) => {
	if (typeof username !== 'string' || typeof password !== 'string') {
		return false;
	}
	const correctPassword = process.env[username];

	return correctPassword && correctPassword === password;
};

// NOTE: Check how this one created and it's fields
const generatePolicy = (principalId, resource, authorizerEffect = DENY_EFFECT) => ({
	principalId,
	policyDocument: {
		Version: '2012-10-17',
		Statement: [
			{
				Action: 'execute-api:Invoke',
				Effect: authorizerEffect,
				Resource: resource,
			},
		],
	},
});

// NOTE: Check throwing error instead of callback

async function basicAuthorizer(event, context, callback) {
	logger.log('Basic Authorizer was triggered');
	logger.log('Event: ', JSON.stringify(event));

	const { type: authorizationType, authorizationToken, methodArn } = event;

	if (authorizationType !== 'TOKEN') {
		callback('Unauthorized');
	}

	try {
		const [passedTokenType, passedToken] = authorizationToken.split(' ');
		const isBasicAuthorizationTokenPassed = checkIfBasicAuthorizationType(passedTokenType);
		if (!isBasicAuthorizationTokenPassed) {
			throw new Error('Incorrect authorization type used.');
		}

    const decodedCredentials = Buffer.from(passedToken, 'base64').toString('utf-8');
    // ? Check correct passing format "Username:Password"?
		const [username, password] = decodedCredentials.split(':');

		logger.log(`Passed credentials. Username: ${username}. Last 3 password letters: ${password.slice(-3)}`);

		const authorizerEffect = checkPassedCredentialsValid(username, password) ? ALLOW_EFFECT : DENY_EFFECT;

		const policy = generatePolicy(passedToken, methodArn, authorizerEffect);

		callback(null, policy);
	} catch (error) {
		logger.log('Authorization error occured.', error);
		callback(`${UNAUTHORIZED_STATUS_MESSAGE}. ${error}`);
	}
}

export default basicAuthorizer;
