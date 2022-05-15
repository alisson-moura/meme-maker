class AppError extends Error {
  constructor(message) {
    super();
    this.message = message;
  }
}

module.exports = { AppError };
