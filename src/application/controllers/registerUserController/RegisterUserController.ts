import { z } from "zod";
import { RegisterUserUseCase } from "../../useCases/registerUser/registerUserUseCase";
import { IController, IRequest, IResponse } from "../interfaces/IController";
import { Response } from "../helpers/Response";

enum UserType {
  COMMON = "COMMON",
  MERCHANT = "MERCHANT",
}

const RegisterUserRequestSchema = z.object({
  firstName: z.string().min(1, "Primeiro nome é obrigatório"),
  lastName: z.string().min(1, "Último nome é obrigatório"),
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  cpf: z
    .string()
    .min(11, "CPF deve ter 11 caracteres")
    .max(11, "CPF deve ter 11 caracteres")
    .regex(/^\d{11}$/, "CPF deve conter apenas números"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  userType: z
    .nativeEnum(UserType)
    .refine((val) => Object.values(UserType).includes(val), {
      message: "Tipo de usuário inválido",
    }),
});

export class RegisterUserController implements IController {
  constructor(private readonly registerUserCase: RegisterUserUseCase) {}

  async handle({ body }: IRequest): Promise<IResponse> {
    try {
      const { cpf, email, firstName, lastName, password, userType } =
        RegisterUserRequestSchema.parse(body);

      await this.registerUserCase.execute({
        cpf,
        email,
        firstName,
        lastName,
        password,
        userType,
      });
      return Response.noContent();
    } catch (error) {
      return Response.mapError(error);
    }
  }
}
