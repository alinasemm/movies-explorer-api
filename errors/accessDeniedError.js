class AccessDeniedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
    this.name = 'AccessDeniedError';
  }
}

module.exports = AccessDeniedError;
