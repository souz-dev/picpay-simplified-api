import axios from "axios";

export class AuthorizeService {
  private authorizeApiUrl = "https://util.devi.tools/api/v2/authorize";

  /**
   * Autoriza a transferência consultando o serviço externo.
   * @param value Valor da transferência.
   * @param payerId ID do pagador.
   * @param payeeId ID do recebedor.
   * @returns Retorna `true` se a transferência for autorizada, caso contrário `false`.
   */
  async authorizeTransfer(
    value: number,
    payerId: string,
    payeeId: string
  ): Promise<boolean> {
    try {
      const response = await axios.get(this.authorizeApiUrl, {
        timeout: 5000,
      });
      console.log(response.data);
      return response.data?.data.authorization;
    } catch (error) {
      console.error(
        `Erro ao consultar o serviço de autorização para a transferência:`,
        { value, payerId, payeeId, error: error.response.data }
      );

      return false;
    }
  }
}
