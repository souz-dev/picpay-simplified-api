import {
  TransferRequest,
  TransferResponse,
} from "../useCases/transfer/TransferUseCase";

export interface ITransferRepositoryContract {
  findById(id: string): Promise<TransferResponse | null>;
  create(data: TransferRequest): Promise<TransferResponse>;
  update(
    id: string,
    data: Partial<TransferRequest>
  ): Promise<TransferResponse | null>;
  delete(id: string): Promise<boolean>;
}
