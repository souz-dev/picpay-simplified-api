import { prismaClient } from "../../libs/prismaClient";
import { RegisterUserRepository } from "../../repositories/registerUserRepository";
import { BadRequestError } from "../../errors/BadRequestError";
import { IUseCase } from "../interface/IUseCase";
import { hash } from "bcrypt";

type UserType = "COMMON" | "MERCHANT";

export interface RegisterUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  cpf: string;
  password: string;
  userType: UserType;
}

export interface RegisterUserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  cpf: string;
  userType: UserType;
  createdAt: string;
  wallet?: {
    id: string;
    balance: number;
  };
}

export class RegisterUserUseCase
  implements IUseCase<RegisterUserRequest, RegisterUserResponse>
{
  constructor(private registerUserRepository: RegisterUserRepository) {}

  async execute({
    cpf,
    email,
    firstName,
    lastName,
    password,
    userType,
  }: RegisterUserRequest): Promise<RegisterUserResponse> {
    const [emailExists, cpfExists] = await Promise.all([
      this.registerUserRepository.findUnique("email", email),
      this.registerUserRepository.findUnique("cpf", cpf),
    ]);

    if (emailExists) {
      throw new BadRequestError("E-mail já cadastrado.");
    }

    if (cpfExists) {
      throw new BadRequestError("CPF já cadastrado.");
    }

    if (!password) {
      throw new BadRequestError("Password não foi informado.");
    }
    if (!firstName) {
      throw new BadRequestError("firstName não foi informado.");
    }
    if (!lastName) {
      throw new BadRequestError("lastName não foi informado.");
    }
    if (!userType) {
      throw new BadRequestError("Tipo de user não foi informado.");
    }
    const hashedPassword = await hash(password, 10);

    const user = await this.registerUserRepository.create({
      firstName,
      lastName,
      cpf,
      email,
      password: hashedPassword,
      userType,
    });

    await prismaClient.wallet.create({
      data: {
        userId: user?.id,
        balance: 100.0,
      },
    });
    return {
      id: user.id,
      firstName: user?.firstName,
      lastName: user.lastName,
      email: user?.email,
      cpf: user?.cpf,
      userType: user?.userType,
      wallet: user?.wallet,
      createdAt: user?.createdAt,
    };
  }
}
