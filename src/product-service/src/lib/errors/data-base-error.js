class DataBaseError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Database handling error';
    this.message = message;
    this.code = 500;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default DataBaseError;