export class ApiError extends Error {
  constructor(statusCode, message, fieldErrors = null) {
    super(message);
    this.statusCode = statusCode;
    this.fieldErrors = fieldErrors;
  }
}
