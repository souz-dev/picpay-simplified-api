import { RegisterUserRepository } from "../../repositories/registerUserRepository";
import { TransferRepository } from "../../repositories/transferRepository";
import { WalletRepository } from "../../repositories/WalletRepository";
import { AuthorizeService } from "../../service/AuthorizerService";
import { BadRequestError } from "../../errors/BadRequestError";
import { IUseCase } from "../interface/IUseCase";
import { RegisterUserResponse } from "../registerUser/registerUserUseCase";

export interface TransferRequest {
  amount: number;
  senderId: string;
  receiverId: string;
}

export type TransferStatus = "PENDING" | "COMPLETED" | "FAILED";
export interface TransferResponse {
  id: string;
  amount: number;
  senderId: string;
  receiverId: string;
  sender: RegisterUserResponse;
  receiver: RegisterUserResponse;
  createdAt: string;
  status: TransferStatus;
}
export class TransferUseCase
  implements IUseCase<TransferRequest, TransferResponse>
{
  constructor(
    private walletRepository: WalletRepository,
    private transferRepository: TransferRepository,
    private registerUserRepository: RegisterUserRepository,
    private authorizerService: AuthorizeService
  ) {}

  async execute({
    senderId,
    receiverId,
    amount,
  }: TransferRequest): Promise<TransferResponse> {
    const sender = await this.registerUserRepository.findById(senderId);
    const receiver = await this.registerUserRepository.findById(receiverId);

    if (!sender || !receiver) {
      throw new BadRequestError(
        "Usuário remetente ou destinatário não encontrado"
      );
    }

    if (sender.userType === "MERCHANT") {
      throw new BadRequestError("Lojistas não podem enviar dinheiro");
    }

    const senderWallet = await this.walletRepository.findById(senderId);
    if (!senderWallet || senderWallet.balance < amount) {
      console.log({ senderWallet: senderWallet?.balance });
      throw new BadRequestError(
        "Saldo insuficiente para realizar a transferência"
      );
    }
    const isAuthorized = await this.authorizerService.authorizeTransfer(
      amount,
      senderId,
      receiverId
    );
    if (!isAuthorized) {
      throw new BadRequestError("Transferência não autorizada");
    }

    const transfer = await this.transferRepository.create({
      amount,
      senderId,
      receiverId,
    });
    await this.walletRepository.update(senderId, {
      balance: senderWallet.balance - amount,
    });

    const receiverWallet = await this.walletRepository.findById(receiverId);

    if (!receiverWallet) {
      throw new Error("Carteira do recebedor não encontrada.");
    }

    await this.walletRepository.update(receiverId, {
      balance: receiverWallet.balance + amount,
    });

    // to-do queue https://github.com/OptimalBits/bull#readme

    return {
      id: transfer.id,
      amount: transfer.amount,
      receiver: transfer.receiver,
      sender: transfer.sender,
      receiverId: transfer.receiverId,
      senderId: transfer.senderId,
      status: transfer.status,
      createdAt: transfer.createdAt,
    };
  }
}
