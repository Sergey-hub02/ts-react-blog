import { Request } from "express";
import config from "../config.js";

/**
 * Возвращает полный URL пользовательского запроса, включая все параметры
 * @params request
 */
export const get_full_url = (request: Request) => {
  const protocol: string = request.protocol;
  const host: string = request.hostname;

  const url: string = request.originalUrl;
  const port: number | undefined = config.PORT;

  return `${protocol}://${host}:${port}${url}`;
}
