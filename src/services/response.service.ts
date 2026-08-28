import { HttpError } from "routing-controllers";

export interface IResponse {
  status: "success";
  message: string;
  data: any;
}

export class ErrorResponse extends HttpError {
  success!: boolean;
  message!: string;
  errors: any;
  constructor(message = "Something went wrong", code?: number, errors?: any) {
    const httpCode = code || 400;

    super(httpCode, message);

    this.message = message;
    this.httpCode = httpCode;
    this.success = false;
    this.errors = errors;
  }
}

export class ServiceResponse {
  static success(message: string, data: any): IResponse {
    return { status: "success", message, data };
  }

  static error(message: string, code?: number, errors?: any): never {
    throw new ErrorResponse(message, code, errors);
  }
}
