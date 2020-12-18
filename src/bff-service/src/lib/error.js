// Creates Axios-like error to handle in common way

class ServerError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = 'Server Error';
    this.status = status;
    this.message = message;
    this.response = {
      data: {
        statusCode: status,
        message,
      },
      status,
    };

  }
}

export default ServerError;