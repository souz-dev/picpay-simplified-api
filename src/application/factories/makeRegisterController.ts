import { RegisterUserController } from "../controllers/registerUserController/RegisterUserController";
import { RegisterUserRepository } from "../repositories/registerUserRepository";
import { RegisterUserUseCase } from "../useCases/registerUser/registerUserUseCase";

export function makeRegisterController() {
  const registerUserRepository = new RegisterUserRepository();
  const registerUserUseCase = new RegisterUserUseCase(registerUserRepository);
  return new RegisterUserController(registerUserUseCase);
}
