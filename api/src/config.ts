import dotenv from "dotenv";

dotenv.config();

interface ENV {
  PORT: number | undefined,
  DB_HOST: string | undefined,
  DB_PORT: number | undefined,
  DB_USER: string | undefined,
  DB_PASSWORD: string | undefined,
  DB_NAME: string | undefined,
};

export type Config = Required<ENV>;

/**
 * Возвращает конфигурацию окружения приложения
 * @returns
 */
const get_config = (): ENV => {
  return {
    PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
  };
};


/**
 * Возвращает конфигурацию окружения приложения, если все переменные окружения определены
 * @param config
 * @returns
 */
const get_santized_config = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Переменной ${key} нет в файле конфигурации!`);
    }
  }

  return config as Config;
}


const config = get_config();
const sanitized_config = get_santized_config(config);

export default sanitized_config;
