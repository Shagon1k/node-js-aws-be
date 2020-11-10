class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Bad Request Error';
    this.message = message;
    this.code = 400;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default BadRequestError;