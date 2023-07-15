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
  private _limit: number = 5;
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

  /**
   * Возвращает список пользователей с возможностью пагинации
   * @params request
   * @params response
   */
  public get: RequestHandler = async (request, response) => {
    console.log(`[${new Date().toLocaleString()}]: GET ${get_full_url(request)}`);

    let query: any = {
      select: {
        user_id: true,
        firstname: true,
        lastname: true,
        username: true,
        email: true,
        roles: {
          role_id: true,
          name: true,
          description: true,
        },
        created_at: true,
        updated_at: true,
      },
      relations: {
        roles: true,
      },
    };

    const page = parseInt(request.query.page as string);

    if (page && page > 0) {
      query.take = this._limit;
      query.skip = this._limit * (page - 1);
    }

    try {
      const users: User[] = await this._repository.find(query);

      response.status(200);
      response.json(users);

      console.log(`[${new Date().toLocaleString()}]: Данные пользователей были получены!`);
    }
    catch (error) {
      response.status(500);

      response.json({
        errors: [error.message],
      });

      console.error(`[ERROR ${new Date().toLocaleString()}]: ${error.message}!`);
    }
  }

  /**
   * Возвращает данные указанного пользователя
   * @params request
   * @params response
   */
  public get_one: RequestHandler = async (request, response) => {
    console.log(`[${new Date().toLocaleString()}]: GET ${get_full_url(request)}`);

    const user_id = parseInt(request.params.id as string);

    if (!user_id) {
      response.status(400);

      response.json({
        errors: [`Некорректный идентификатор пользователя!`],
      });

      console.error(`[ERROR ${new Date().toLocaleString()}]: Некорректный идентификатор пользователя!`);
      return;
    }

    try {
      const user = await this._repository.findOne({
        select: {
          user_id: true,
          firstname: true,
          lastname: true,
          username: true,
          email: true,
          password: true,
          roles: {
            role_id: true,
            name: true,
            description: true,
          },
          created_at: true,
          updated_at: true,
        },
        where: {
          user_id: user_id,
        },
        relations: {
          roles: true,
        },
      });

      if (!user) {
        response.status(404);

        response.json({
          errors: [`Пользователь с id = ${user_id} не найден!`],
        });

        console.error(`[ERROR ${new Date().toLocaleString()}]: Пользователь с id = ${user_id} не найден!`);
        return;
      }

      response.status(200);
      response.json(user);

      console.log(`[${new Date().toLocaleString()}]: Данные пользователя с id = ${user_id} получены!`);
    }
    catch (error) {
      response.status(500);

      response.json({
        errors: [error.message],
      });

      console.error(`[ERROR ${new Date().toLocaleString()}]: ${error.message}`);
    }
  }

  /**
   * Обновляет данные указанного пользователя
   * @params request
   * @params response
   */
  public update: RequestHandler = async (request, response) => {
    console.log(`[${new Date().toLocaleString()}]: PUT ${get_full_url(request)}`);

    const user_id = parseInt(request.params.id as string);

    if (!user_id) {
      response.status(400);

      response.json({
        errors: ["Некорректный идентификатор пользователя!"],
      });

      console.error(`[ERROR ${new Date().toLocaleString()}]: Некорректный идентификатор пользователя!`);
      return;
    }

    // проверка на существование пользователя
    const existing_user = await this._repository.findOne({
      select: { user_id: true },
      where: { user_id: user_id },
    });

    if (!existing_user) {
      response.status(404);

      response.json({
        errors: [`Пользователь с id = ${user_id} не найден!`],
      });

      console.error(`[ERROR ${new Date().toLocaleString()}]: Пользователь с id = ${user_id} не найден!`);
      return;
    }

    const user: User = new User();
    user.user_id = user_id;

    // сбор полей для обновления
    if (request.body.firstname && request.body.firstname.length !== 0) {
      user.firstname = request.body.firstname;
    }
    if (request.body.lastname && request.body.lastname.length !== 0) {
      user.lastname = request.body.lastname;
    }
    if (request.body.username && request.body.username.length !== 0) {
      user.username = request.body.username;
    }
    if (request.body.email && request.body.email.length !== 0) {
      user.email = request.body.email;
    }

    try {
      const updated_user = await this._repository.save(user);

      response.status(200);
      response.json(updated_user);

      console.log(`[${new Date().toLocaleString()}]: Обновление данных пользователя с id = ${user_id} прошло успешно!`);
    }
    catch (error) {
      response.status(500);

      response.json({
        errors: [error.message],
      });

      console.error(`[ERROR ${new Date().toLocaleString()}]: ${error.message}`);
    }
  }

  public delete: RequestHandler = (_, __) => {
    return;
  }
}
