import { Request, Response } from "express";
import { IController } from "../../application/controllers/interfaces/IController";

export function routeAdapters(controller: IController) {
  return async (request: Request, response: Response) => {
    const { statusCode, body } = await controller.handle({
      body: request.body,
      params: request.params,
    });

    response.status(statusCode).json(body);
  };
}
