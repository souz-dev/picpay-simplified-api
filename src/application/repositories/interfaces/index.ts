import {
  RegisterUserRequest,
  RegisterUserResponse,
} from "../../useCases/registerUser/registerUserUseCase";

export interface IUserRepositoryContract {
  findById(id: string): Promise<RegisterUserResponse | null>;
  create(data: RegisterUserRequest): Promise<RegisterUserResponse>;
  update(
    id: string,
    data: Partial<RegisterUserRequest>
  ): Promise<RegisterUserResponse | null>;
  delete(id: string): Promise<boolean>;
  findUnique(
    field: "id" | "email" | "cpf",
    value: string
  ): Promise<RegisterUserResponse | null>;
}
