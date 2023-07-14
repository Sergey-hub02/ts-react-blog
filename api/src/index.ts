import config from "./config.js";

const main = async (): Promise<void> => {
  console.log(config);
}


main()
  .catch((error: Error) => {
    console.error(`[ERROR ${new Date().toLocaleString()}]: ${error.message}`);
  });
