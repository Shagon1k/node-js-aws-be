import ServerError from '../lib/error';

const getCheckIfHandledMiddleware = () => (req, res, next) => {
  const { handled } = res.locals;

	if (!handled) {
		throw new ServerError('Cannot process request', 502);
	}
};

export default getCheckIfHandledMiddleware;
