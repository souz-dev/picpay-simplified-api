import { ZodError } from "zod";
import { IResponse } from "../interfaces/IController";
import { ApplicationError } from "../../errors/applicationError";

export abstract class Response {
  static ok<T extends IResponse["body"]>(body: T): IResponse {
    return {
      statusCode: 200,
      body: body,
    };
  }

  static noContent(): IResponse {
    return {
      statusCode: 204,
      body: null,
    };
  }
  static mapError(error: unknown): IResponse {
    if (error instanceof ZodError) {
      return {
        statusCode: 400,
        body: error.issues,
      };
    }

    if (error instanceof ApplicationError) {
      return {
        statusCode: error.statusCode,
        body: {
          error: error.message,
        },
      };
    }

    return {
      statusCode: 500,
      body: {
        error: "Internal server error",
      },
    };
  }
}
