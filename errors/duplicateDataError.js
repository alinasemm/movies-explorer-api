class DuplicateDataError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
    this.name = 'DuplicateDataError';
  }
}

module.exports = DuplicateDataError;
