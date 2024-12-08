import { prismaClient } from "../libs/prismaClient";
import {
  TransferRequest,
  TransferResponse,
} from "../useCases/transfer/TransferUseCase";
import { IRepository } from "./interfaces/IRepository";
import { ITransferRepositoryContract } from "./ITransferRepositoryContract";

export class TransferRepository implements ITransferRepositoryContract {
  // FindById
  async findById(id: string): Promise<TransferResponse | null> {
    const transfer = await prismaClient.transfer.findUnique({
      where: { id },
      include: {
        sender: true,
        receiver: true,
      },
    });

    if (!transfer) return null;

    return {
      id: transfer.id,
      amount: transfer.amount,
      senderId: transfer.senderId,
      receiverId: transfer.receiverId,
      status: transfer.status,
      createdAt: transfer.createdAt.toISOString(),
      sender: {
        id: transfer.sender.id,
        firstName: transfer.sender.firstName,
        lastName: transfer.sender.lastName,
        email: transfer.sender.email,
        cpf: transfer.sender.cpf, // Campo obrigatório em RegisterUserResponse
        userType: transfer.sender.userType, // Campo obrigatório em RegisterUserResponse
        createdAt: transfer.sender.createdAt.toISOString(), // Campo obrigatório em RegisterUserResponse
      },
      receiver: {
        id: transfer.receiver.id,
        firstName: transfer.receiver.firstName,
        lastName: transfer.receiver.lastName,
        email: transfer.receiver.email,
        cpf: transfer.receiver.cpf, // Campo obrigatório em RegisterUserResponse
        userType: transfer.receiver.userType, // Campo obrigatório em RegisterUserResponse
        createdAt: transfer.receiver.createdAt.toISOString(), // Campo obrigatório em RegisterUserResponse
      },
    };
  }

  // Create
  async create(transfer: TransferRequest): Promise<TransferResponse> {
    const createdTransfer = await prismaClient.transfer.create({
      data: {
        amount: transfer.amount,
        senderId: transfer.senderId,
        receiverId: transfer.receiverId,
      },
      include: {
        sender: true,
        receiver: true,
      },
    });

    return {
      id: createdTransfer.id,
      amount: createdTransfer.amount,
      senderId: createdTransfer.senderId,
      receiverId: createdTransfer.receiverId,
      status: createdTransfer.status,
      createdAt: createdTransfer.createdAt.toISOString(),
      sender: {
        id: createdTransfer.sender.id,
        firstName: createdTransfer.sender.firstName,
        lastName: createdTransfer.sender.lastName,
        email: createdTransfer.sender.email,
        cpf: createdTransfer.sender.cpf, // Campo obrigatório em RegisterUserResponse
        userType: createdTransfer.sender.userType, // Campo obrigatório em RegisterUserResponse
        createdAt: createdTransfer.sender.createdAt.toISOString(), // Campo obrigatório em RegisterUserResponse
      },
      receiver: {
        id: createdTransfer.receiver.id,
        firstName: createdTransfer.receiver.firstName,
        lastName: createdTransfer.receiver.lastName,
        email: createdTransfer.receiver.email,
        cpf: createdTransfer.receiver.cpf, // Campo obrigatório em RegisterUserResponse
        userType: createdTransfer.receiver.userType, // Campo obrigatório em RegisterUserResponse
        createdAt: createdTransfer.receiver.createdAt.toISOString(), // Campo obrigatório em RegisterUserResponse
      },
    };
  }

  // Update
  async update(
    id: string,
    transfer: Partial<TransferRequest>
  ): Promise<TransferResponse | null> {
    const updatedTransfer = await prismaClient.transfer.update({
      where: { id },
      data: transfer,
      include: {
        sender: true,
        receiver: true,
      },
    });

    if (!updatedTransfer) return null;

    return {
      id: updatedTransfer.id,
      amount: updatedTransfer.amount,
      senderId: updatedTransfer.senderId,
      receiverId: updatedTransfer.receiverId,
      status: updatedTransfer.status,
      createdAt: updatedTransfer.createdAt.toISOString(),
      sender: {
        id: updatedTransfer.sender.id,
        firstName: updatedTransfer.sender.firstName,
        lastName: updatedTransfer.sender.lastName,
        email: updatedTransfer.sender.email,
        cpf: updatedTransfer.sender.cpf, // Campo obrigatório em RegisterUserResponse
        userType: updatedTransfer.sender.userType, // Campo obrigatório em RegisterUserResponse
        createdAt: updatedTransfer.sender.createdAt.toISOString(), // Campo obrigatório em RegisterUserResponse
      },
      receiver: {
        id: updatedTransfer.receiver.id,
        firstName: updatedTransfer.receiver.firstName,
        lastName: updatedTransfer.receiver.lastName,
        email: updatedTransfer.receiver.email,
        cpf: updatedTransfer.receiver.cpf, // Campo obrigatório em RegisterUserResponse
        userType: updatedTransfer.receiver.userType, // Campo obrigatório em RegisterUserResponse
        createdAt: updatedTransfer.receiver.createdAt.toISOString(), // Campo obrigatório em RegisterUserResponse
      },
    };
  }

  // Delete
  async delete(id: string): Promise<boolean> {
    try {
      await prismaClient.transfer.delete({
        where: { id },
      });
      return true; // Indica que a exclusão foi bem-sucedida
    } catch (error) {
      console.error("Erro ao deletar transferência:", error);
      return false; // Indica que a exclusão falhou
    }
  }
}
