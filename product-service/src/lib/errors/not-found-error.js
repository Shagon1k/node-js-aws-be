class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Not Found Error';
    this.message = message;
    this.code = 404;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default NotFoundError;