const prepareErrorResponse = (error, statusCode) => {
  const {
    stack = '',
    message = ''
  } = error;
  const errorStr = JSON.stringify({ stack, message });
  const errorResponse = {
    statusCode,
    body: errorStr
  };

  return errorResponse;
};

export default prepareErrorResponse;