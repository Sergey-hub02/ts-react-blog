import { RequestHandler } from "express";
import { Repository, DataSource } from "typeorm";
import { get_full_url } from "../utils/utils.js";

import Controller from "../interfaces/Controller.js";
import Comment from "../entities/Comment.js";
import User from "../entities/User.js";
import Post from "../entities/Post.js";

/**
 * Обрабатывает запросы, связанные с комментариями к публикациям
 */
export default class CommentController implements Controller {
  private _limit: number = 10;
  private _repository: Repository<Comment>;

  public constructor(data_source: DataSource) {
    this._repository = data_source.getRepository(Comment);
  }

  /**
   * Добавляет комментарий в базу данных
   * @params request
   * @params response
   */
  public create: RequestHandler = async (request, response) => {
    console.log(`[${new Date().toLocaleString()}]: POST ${get_full_url(request)}`);

    /*========== ВАЛИДАЦИЯ ДАННЫХ ==========*/
    const errors: string[] = [];

    if (!request.body.content || request.body.content.length === 0) {
      errors.push("Пустой комментарий!");
    }
    if (!request.body.author_id) {
      errors.push("У комментария должен быть автор!");
    }
    if (!request.body.post_id) {
      errors.push("Комментарий должен принадлежать публикации!");
    }

    if (errors.length !== 0) {
      response.status(400);

      response.json({
        errors: errors,
      });

      console.error(`[ERROR ${new Date().toLocaleString()}]: ${errors}`);
      return;
    }

    const comment = new Comment();
    comment.content = request.body.content;

    const author = new User();
    author.user_id = parseInt(request.body.author_id as string);

    const post = new Post();
    post.post_id = request.body.post_id;

    comment.author = author;
    comment.post = post;
    comment.active = true;

    try {
      const added_comment = await this._repository.save(comment);

      response.status(201);
      response.json(added_comment);

      console.log(`[${new Date().toLocaleString()}]: Комментарий успешно добавлен!`);
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
   * Получает список комментариев с возможностью пагинации
   * @params request
   * @params response
   */
  public get: RequestHandler = async (request, response) => {
    console.log(`[${new Date().toLocaleString()}]: GET ${get_full_url(request)}`);

    let query: any = {
      select: {
        comment_id: true,
        content: true,
        author: {
          user_id: true,
          username: true,
          email: true,
        },
        post: {
          post_id: true,
          title: true,
        },
        active: true,
        created_at: true,
        updated_at: true,
      },
      relations: {
        author: true,
        post: true,
      },
      order: {
        created_at: "desc",
      },
    };

    const page = parseInt(request.query.page as string);

    if (page && page > 0) {
      query.take = this._limit;
      query.skip = this._limit * (page - 1);
    }

    const post_id = parseInt(request.query.post as string);

    if (post_id && post_id > 0) {
      query.where = {
        post: {
          post_id: post_id,
        },
      };
    }

    try {
      const comments = await this._repository.find(query);

      response.status(200);
      response.json(comments);

      console.log(`[${new Date().toLocaleString()}]: Комментарии получены!`);
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
   * Получает данные указанного комментария
   * @params request
   * @params response
   */
  public get_one: RequestHandler = async (request, response) => {
    console.log(`[${new Date().toLocaleString()}]: GET ${get_full_url(request)}`);

    const comment_id = parseInt(request.params.id as string);

    if (!comment_id) {
      response.status(400);

      response.json({
        errors: [`Некорректный идентификатор комментария!`],
      });

      console.error(`[ERROR ${new Date().toLocaleString()}]: Некорректный идентификатор комментария!`);
      return;
    }

    try {
      const comment = await this._repository.findOne({
        select: {
          comment_id: true,
          content: true,
          author: {
            user_id: true,
            username: true,
            email: true,
          },
          post: {
            post_id: true,
            title: true,
          },
          active: true,
          created_at: true,
          updated_at: true,
        },
        where: {
          comment_id: comment_id,
        },
        relations: {
          author: true,
          post: true,
        },
      });

      if (!comment) {
        response.status(404);

        response.json({
          errors: [`Комментарий с id = ${comment_id} не найден!`],
        });

        console.error(`[ERROR ${new Date().toLocaleString()}]: Комментарий с id = ${comment_id} не найден!`);
        return;
      }

      response.status(200);
      response.json(comment);

      console.log(`[${new Date().toLocaleString()}]: Комментарий с id = ${comment_id} был успешно найден!`);
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
   * Обновляет данные указанного комментария
   * @params request
   * @params response
   */
  public update: RequestHandler = async (request, response) => {
    console.log(`[${new Date().toLocaleString()}]: PUT ${get_full_url(request)}`);

    response.status(200);
    response.json({ test: "test" });
  }

  /**
   * Удаляет указанный комментарий
   * @params request
   * @params response
   */
  public delete: RequestHandler = async (request, response) => {
    console.log(`[${new Date().toLocaleString()}]: DELETE ${get_full_url(request)}`);

    response.status(200);
    response.json({ test: "test" });
  }
}
