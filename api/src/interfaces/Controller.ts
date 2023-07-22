import { RequestHandler } from "express";

export default interface Controller {
  /**
   * Добавляет сущность в базу данных
   */
  create: RequestHandler;

  /**
   * Получает записи из базы данных с возможностью пагинации
   */
  get: RequestHandler;

  /**
   * Получает указанную запись из базы данных
   */
  get_one: RequestHandler;

  /**
   * Обновляет указанную запись в базе данных
   */
  update: RequestHandler;

  /**
   * Удаляет указанную запись в базе данных
   */
  delete: RequestHandler;
}
