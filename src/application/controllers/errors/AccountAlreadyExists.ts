import { ConflictError } from "../../errors/ConflictError";

export class AccountAlreadyExists extends ConflictError {
  constructor() {
    super("Account Already Exists");
  }
}
