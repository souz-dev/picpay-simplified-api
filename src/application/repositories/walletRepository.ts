import { prismaClient } from "../libs/prismaClient";
import { IRepository } from "./interfaces/IRepository";

interface Wallet {
  id: string;
  userId: string;
  balance: number;
}

export class WalletRepository implements IRepository<Wallet> {
  async findById(id: string): Promise<Wallet | null> {
    return await prismaClient.wallet.findUnique({
      where: { userId: id },
    });
  }

  async create(wallet: Wallet): Promise<Wallet> {
    return await prismaClient.wallet.create({
      data: wallet,
    });
  }

  async update(id: string, wallet: Partial<Wallet>): Promise<Wallet> {
    return await prismaClient.wallet.update({
      where: { userId: id },
      data: wallet,
    });
  }

  async delete(id: string): Promise<void> {
    await prismaClient.wallet.delete({
      where: { id },
    });
  }
}
