import { RequestHandler } from "express";
// import { DataSource, Repository } from "typeorm";
import Controller from "../interfaces/Controller.js";
// import User from "../entities/User.js";

/**
 * Обрабатывает все запросы, связанные с сущностью User
 */
export default class UserController implements Controller {
  // private _limit: number = 15;
  // private _repository: Repository<User>;

  /**
   * Инициализирует репозиторий для работы с базой данных
   * @param data_source
   */
  // public constructor(data_source: DataSource) {
  //   this._repository = data_source.getRepository(User);
  // }

  public create: RequestHandler = (_, response) => {
    response.json({
      message: "all good",
    });
  }

  public get: RequestHandler = (_, __) => {
    return;
  }

  public get_one: RequestHandler = (_, __) => {
    return;
  }

  public update: RequestHandler = (_, __) => {
    return;
  }

  public delete: RequestHandler = (_, __) => {
    return;
  }
}
