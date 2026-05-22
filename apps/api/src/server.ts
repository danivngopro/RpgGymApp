import { createApp } from "./app.js";
import { config } from "./config.js";
import { logger } from "./lib/logger.js";

createApp().listen(config.PORT, () => {
  logger.info({ port: config.PORT }, "RPG Gym API listening");
});
