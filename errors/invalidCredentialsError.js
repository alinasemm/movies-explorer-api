class InvalidCredentialsError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
    this.name = 'InvalidCredentialsError';
  }
}

module.exports = InvalidCredentialsError;
