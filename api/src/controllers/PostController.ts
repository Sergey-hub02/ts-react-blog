import { RequestHandler } from "express";
import { Repository, DataSource } from "typeorm";
import { get_full_url } from "../utils/utils.js";

import Controller from "../interfaces/Controller.js";
import Post from "../entities/Post.js";
import State from "../entities/State.js";
import User from "../entities/User.js";
import Category from "../entities/Category.js";

/**
 * Обрабатывает запросы, связанные с публикациями
 */
export default class PostController implements Controller {
  private _limit: number = 10;
  private _repository: Repository<Post>;

  public constructor(data_source: DataSource) {
    this._repository = data_source.getRepository(Post);
  }

  /**
   * Добавляет публикацию в базу данных
   * @params request
   * @params response
   */
  public create: RequestHandler = async (request, response) => {
    console.log(`[${new Date().toLocaleString()}]: POST ${get_full_url(request)}`);

    /*========== ВАЛИДАЦИЯ ДАННЫХ ==========*/
    const errors: string[] = [];

    if (!request.body.title || request.body.title.length === 0) {
      errors.push("Пожалуйста, заполните поле \"Название\"!");
    }
    if (!request.body.content || request.body.content.length === 0) {
      errors.push("Пожалуйста, заполните поле \"Содержание\"!");
    }
    if (!request.body.author_id) {
      errors.push("Не указан автор публикации!");
    }
    if (!request.body.categories_ids || request.body.categories_ids.length === 0) {
      errors.push("Пожалуйста, выберите хотя бы одну категорию для публикации!");
    }

    if (errors.length !== 0) {
      response.status(400);

      response.json({
        errors: errors,
      });

      console.error(`[ERROR ${new Date().toLocaleString()}]: ${errors}`);
      return;
    }

    /*========== ДОБАВЛЕНИЕ ПУБЛИКАЦИИ В БАЗУ ДАННЫХ ==========*/
    const title: string = request.body.title;
    const content: string = request.body.content;
    const author_id: number = parseInt(request.body.author_id as string);

    const post: Post = new Post();

    post.title = title;
    post.content = content;

    const author: User = new User();
    author.user_id = author_id;

    post.author = author;

    const categories: Category[] = request.body.categories_ids.map((category_id: number) => {
      const category: Category = new Category();
      category.category_id = category_id;
      return category;
    });

    post.categories = categories;

    const state: State = new State();
    state.state_id = 1;

    post.state = state;
    post.views = 0;

    try {
      const added_post = await this._repository.save(post);

      response.status(201);
      response.json(added_post);

      console.error(`[${new Date().toLocaleString()}]: Публикация с id = ${added_post.post_id} успешно добавлена!`);
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
   * Возвращает список публикаций с возможностью пагинации
   * @params request
   * @params response
   */
  public get: RequestHandler = async (request, response) => {
    console.log(`[${new Date().toLocaleString()}]: GET ${get_full_url(request)}`);

    let query: any = {
      select: {
        post_id: true,
        title: true,
        author: {
          user_id: true,
          username: true,
          email: true,
        },
        categories: {
          category_id: true,
          name: true,
        },
        comments: {
          comment_id: true,
          content: true,
          author: {
            user_id: true,
            username: true,
            email: true,
          },
          active: true,
          created_at: true,
          updated_at: true,
        },
        state: {
          state_id: true,
          name: true,
        },
        views: true,
        created_at: true,
        updated_at: true,
      },
      relations: {
        author: true,
        categories: true,
        comments: {
          author: true,
        },
        state: true,
      },
      order: {
        created_at: "desc",
        comments: {
          created_at: "desc",
        },
      },
    };

    const page = parseInt(request.query.page as string);

    if (page && page > 0) {
      query.take = this._limit;
      query.skip = this._limit * (page - 1);
    }

    try {
      const posts: Post[] = await this._repository.find(query);

      response.status(200);
      response.json(posts);

      console.log(`[${new Date().toLocaleString()}]: Публикации успешно получены!`);
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
   * Возвращает данные указанной публикации
   * @params request
   * @params response
   */
  public get_one: RequestHandler = async (request, response) => {
    console.log(`[${new Date().toLocaleString()}]: GET ${get_full_url(request)}`);

    const post_id = parseInt(request.params.id as string);

    if (!post_id) {
      response.status(400);

      response.json({
        errors: [`Некорректный идентификатор публикации!`],
      });

      console.error(`[ERROR ${new Date().toLocaleString()}]: Некорректный идентификатор публикации!`);
      return;
    }

    try {
      const post = await this._repository.findOne({
        select: {
          post_id: true,
          title: true,
          content: true,
          author: {
            user_id: true,
            username: true,
            email: true,
          },
          categories: {
            category_id: true,
            name: true,
          },
          comments: {
            comment_id: true,
            content: true,
            author: {
              user_id: true,
              username: true,
              email: true,
            },
            created_at: true,
            updated_at: true,
          },
          state: {
            state_id: true,
            name: true,
          },
          views: true,
          created_at: true,
          updated_at: true,
        },
        where: {
          post_id: post_id,
        },
        relations: {
          author: true,
          categories: true,
          comments: {
            author: true,
          },
          state: true,
        },
        order: {
          comments: {
            created_at: "desc",
          },
        },
      });

      if (!post) {
        response.status(404);

        response.json({
          errors: [`Публикация с id = ${post_id} не найдена!`],
        });

        console.error(`[ERROR ${new Date().toLocaleString()}]: Публикация с id = ${post_id} не найдена!`);
        return;
      }

      response.status(200);
      response.json(post);

      console.log(`[${new Date().toLocaleString()}]: Данные публикации с id = ${post_id} получены!`);
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
   * Обновление данных указанной публикации
   * @params request
   * @params response
   */
  public update: RequestHandler = async (request, response) => {
    console.log(`[${new Date().toLocaleString()}]: PUT ${get_full_url(request)}`);

    const post_id = parseInt(request.params.id as string);

    if (!post_id) {
      response.status(400);

      response.json({
        errors: [`Некорректный идентификатор публикации!`],
      });

      console.error(`[ERROR ${new Date().toLocaleString()}]: Некорректный идентификатор публикации!`);
      return;
    }

    // проверка на существование публикации
    const existing_post = await this._repository.findOne({
      select: { post_id: true },
      where: { post_id: post_id },
    });

    if (!existing_post) {
      response.status(404);

      response.json({
        errors: [`Публикация с id = ${post_id} не найден!`],
      });

      console.error(`[ERROR ${new Date().toLocaleString()}]: Публикация с id = ${post_id} не найден!`);
      return;
    }

    const post: Post = new Post();
    post.post_id = post_id;

    if (request.body.title && request.body.title.length !== 0) {
      post.title = request.body.title;
    }
    if (request.body.content && request.body.content.length !== 0) {
      post.content = request.body.content;
    }
    if (request.body.categories_ids && request.body.categories_ids.length !== 0) {
      const categories: Category[] = request
        .body
        .categories_ids
          .map((category_id: number) => {
            const category: Category = new Category();
            category.category_id = category_id;

            return category;
          });

      post.categories = categories;
    }
    if (request.body.state_id) {
      const state: State = new State();

      state.state_id = request.body.state_id;
      post.state = state;
    }
    if (request.body.views) {
      post.views = parseInt(request.body.views as string);
    }

    try {
      const updated_post = await this._repository.save(post);

      response.status(200);
      response.json(updated_post);

      console.log(`[${new Date().toLocaleString()}]: Публикация с id = ${post_id} успешно обновлена!`);
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
   * Удаляет данные публикации
   * @params request
   * @params response
   */
  public delete: RequestHandler = async (request, response) => {
    console.log(`[${new Date().toLocaleString()}]: DELETE ${get_full_url(request)}`);

    const post_id = parseInt(request.params.id as string);

    if (!post_id) {
      response.status(400);

      response.json({
        errors: [`Некорректный идентификатор публикации!`],
      });

      console.error(`[ERROR ${new Date().toLocaleString()}]: Некорректный идентификатор публикации!`);
      return;
    }

    try {
      const delete_result = await this._repository.delete(post_id);

      if (delete_result.affected === 0) {
        response.status(404);

        response.json({
          errors: [`Публикация с id = ${post_id} не найдена!`],
        });

        console.error(`[ERROR ${new Date().toLocaleString()}]: Публикация с id = ${post_id} не найдена!`);
        return;
      }

      response.status(200);
      response.json(delete_result);

      console.log(`[${new Date().toLocaleString()}]: Удаление публикации с id = ${post_id} прошло успешно!`);
    }
    catch (error) {
      response.status(500);

      response.json({
        errors: [error.message],
      });

      console.error(`[ERROR ${new Date().toLocaleString()}]: ${error.message}`);
    }
  }
}
