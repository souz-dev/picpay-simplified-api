import { ApplicationError } from "./applicationError";

export class ConflictError extends ApplicationError {
  constructor(message: string) {
    super(409, message);
    this.name = "ConflictError";
  }
}
