import { z } from "zod";
import { TransferUseCase } from "../../useCases/transfer/TransferUseCase";
import { IController, IRequest, IResponse } from "../interfaces/IController";
import { Response } from "../helpers/Response";

export const transferRequestSchema = z.object({
  amount: z
    .number()
    .positive("O valor deve ser um número positivo")
    .min(0.01, "O valor mínimo permitido é 0.01"),
  senderId: z.string().uuid("O ID do remetente deve ser um UUID válido"),
  receiverId: z.string().uuid("O ID do destinatário deve ser um UUID válido"),
});

export class TransferController implements IController {
  constructor(private readonly transferUseCase: TransferUseCase) {}

  async handle({ body }: IRequest): Promise<IResponse> {
    try {
      const { amount, receiverId, senderId } =
        transferRequestSchema.parse(body);

      await this.transferUseCase.execute({
        amount,
        receiverId,
        senderId,
      });
      return Response.noContent();
    } catch (error) {
      return Response.mapError(error);
    }
  }
}
