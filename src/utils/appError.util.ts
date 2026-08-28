class AppError extends Error {
  httpCode: number;
  errors: any[];

  constructor(message: string, httpCode = 400, errors: any[] = []) {
    super(message);
    this.httpCode = httpCode;
    this.errors = errors;
  }
}

export default AppError;
