import { PrismaClient } from "@prisma/client";
import { IUserRepositoryContract } from "./interfaces";
import {
  RegisterUserRequest,
  RegisterUserResponse,
} from "../useCases/registerUser/registerUserUseCase";
import { prismaClient } from "../libs/prismaClient";

export class RegisterUserRepository implements IUserRepositoryContract {
  // Create
  async create(data: RegisterUserRequest): Promise<RegisterUserResponse> {
    const user = await prismaClient.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        cpf: data.cpf,
        password: data.password, // Lembre-se de aplicar hashing na senha!
        userType: data.userType,
      },
    });

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      cpf: user.cpf,
      userType: user.userType,
      createdAt: user.createdAt.toISOString(),
    };
  }

  // Update
  async update(
    id: string,
    data: Partial<RegisterUserRequest>
  ): Promise<RegisterUserResponse | null> {
    const updatedUser = await prismaClient.user.update({
      where: { id },
      data: {
        ...data, // Atualiza os campos fornecidos
      },
    });

    if (!updatedUser) return null;

    return {
      id: updatedUser.id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      cpf: updatedUser.cpf,
      userType: updatedUser.userType,
      createdAt: updatedUser.createdAt.toISOString(),
    };
  }

  // FindById
  async findById(id: string): Promise<RegisterUserResponse | null> {
    const user = await prismaClient.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      cpf: user.cpf,
      userType: user.userType,
      createdAt: user.createdAt.toISOString(),
    };
  }

  // FindUnique
  async findUnique(
    field: "id" | "email" | "cpf",
    value: string
  ): Promise<RegisterUserResponse | null> {
    const where = {
      [field]: value,
    } as { [key in typeof field]: string };

    const user = await prismaClient.user.findUnique({
      where,
    });

    if (!user) return null;

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      cpf: user.cpf,
      userType: user.userType,
      createdAt: user.createdAt.toISOString(),
    };
  }

  // Delete
  async delete(id: string): Promise<boolean> {
    try {
      await prismaClient.user.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
