const DEFAULT_ERROR_RESPONSE = {
  status: 500,
  data: {
    message: 'Unhandled server error'
  }
};

const getErrorMiddleware = () => (error, req, res, next) => {
  const err = error.response || DEFAULT_ERROR_RESPONSE;
  const {
    status = 500,
    data
  } = err;

  res.status(status).json(data);
}

export default getErrorMiddleware;