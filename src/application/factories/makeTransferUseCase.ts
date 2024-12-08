import { TransferUseCase } from "../useCases/transfer/TransferUseCase";
import { WalletRepository } from "../repositories/WalletRepository";
import { TransferRepository } from "../repositories/transferRepository";
import { RegisterUserRepository } from "../repositories/registerUserRepository";
import { AuthorizeService } from "../service/AuthorizerService";
import { NotificationService } from "../service/NotificationService";

export function makeTransferUseCase() {
  const walletRepository = new WalletRepository();
  const transferRepository = new TransferRepository();
  const registerUserRepository = new RegisterUserRepository();
  const authorizerService = new AuthorizeService();
  const notificationService = new NotificationService();

  return new TransferUseCase(
    walletRepository,
    transferRepository,
    registerUserRepository,
    authorizerService,
    notificationService
  );
}
