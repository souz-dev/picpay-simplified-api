import { TransferController } from "../controllers/transferController/TransferController";
import { makeTransferUseCase } from "./makeTransferUseCase";

export function makeTransferController() {
  const transferUseCase = makeTransferUseCase();
  return new TransferController(transferUseCase);
}
