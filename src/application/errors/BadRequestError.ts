import { ApplicationError } from "./applicationError";

export class BadRequestError extends ApplicationError {
  constructor(message: string) {
    super(400, message);
    this.name = "BadRequestError";
  }
}
