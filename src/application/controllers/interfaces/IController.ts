export interface IRequest {
  body: Record<string, any>;
  params: Record<string, string | number | undefined>;
}

export interface IResponse {
  statusCode: number;
  headers?: Record<string, string | string[] | undefined>;
  body: Record<string, any> | null;
  send?: (body: any) => void;
  json?: (data: Record<string, any>) => void;
}

export interface IController {
  handle(request: IRequest): Promise<IResponse>;
}
