import { RequestHandler } from "express";
import { DataSource, Repository } from "typeorm";
import { get_full_url } from "../utils/utils.js";
import Controller from "../interfaces/Controller.js";
import User from "../entities/User.js";
import Role from "../entities/Role.js";
import argon2 from "argon2";

/**
 * Обрабатывает все запросы, связанные с сущностью User
 */
export default class UserController implements Controller {
  // private _limit: number = 15;
  private _repository: Repository<User>;

  /**
   * Инициализирует репозиторий для работы с базой данных
   * @param data_source
   */
  public constructor(data_source: DataSource) {
    this._repository = data_source.getRepository(User);
  }

  /**
   * Добавляет пользователя в базу данных
   * @params request
   * @params response
   */
  public create: RequestHandler = async (request, response) => {
    console.log(`[${new Date().toLocaleString()}]: POST ${get_full_url(request)}`);

    /*========== ВАЛИДАЦИЯ ДАННЫХ ==========*/
    const errors: string[] = [];

    if (!request.body.username || request.body.username.length === 0) {
      errors.push("Пожалуйста, заполните поле \"Имя в системе\"!");
    }
    if (!request.body.email || request.body.email.length === 0) {
      errors.push("Пожалуйста, заполните поле \"Email\"!");
    }
    if (!request.body.password || request.body.password.length === 0) {
      errors.push("Пожалуйста, заполните поле \"Пароль\"!");
    }

    // проверка на существующее имя пользователя в системе
    const existing_users: User[] = await this._repository.find({
      select: {
        user_id: true,
      },
      where: {
        username: request.body.username,
      },
    });

    if (existing_users.length !== 0) {
      errors.push(`Имя ${request.body.username} уже занято! Пожалуйста, выберите другое имя!`);
    }
    if (request.body.password.length < 6) {
      errors.push("Пароль должен содержать не менее 6 символов!");
    }

    if (errors.length !== 0) {
      response.status(400);

      response.json({
        errors: errors,
      });

      console.error(`[ERROR ${new Date().toLocaleString()}]: Пользователь не ввёл неверные данные для регистрации!`);
      return;
    }

    const firstname: string = request.body.firstname || "";
    const lastname: string = request.body.lastname || "";

    const username: string = request.body.username;
    const email: string = request.body.email;
    const hashed_password = await argon2.hash(request.body.password);

    const user: User = new User();

    user.firstname = firstname;
    user.lastname = lastname;
    user.username = username;
    user.email = email;
    user.password = hashed_password;

    const user_role = new Role();

    user_role.role_id = 1;    // роль "Пользователь"
    user.roles = [user_role];

    try {
      const added_user = await this._repository.save(user);

      response.status(201);
      response.json(added_user);

      console.log(`[${new Date().toLocaleString()}]: Пользователь ${added_user.user_id} был успешно зарегистрирован!`);
    }
    catch (error) {
      response.status(500);

      response.json({
        errors: [error.message],
      });

      console.error(`[ERROR ${new Date().toLocaleString()}]: ${error.message}!`);
    }
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
