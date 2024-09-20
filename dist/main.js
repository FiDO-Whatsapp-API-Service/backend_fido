"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logging_1 = require("./app/logging");
const app_1 = require("./app");
const waService_1 = require("./app/waService");
app_1.server.listen(3000, () => {
    (0, waService_1.init)();
    logging_1.logger.info("Listening on port 3000");
});
