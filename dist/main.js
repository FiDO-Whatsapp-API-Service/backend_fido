"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logging_1 = require("./app/logging");
const app_1 = require("./app");
const waService_1 = require("./app/waService");
const user_service_1 = require("./services/user.service");
app_1.server.listen(3000, () => {
    // Init WhatsApp sessions
    (0, waService_1.init)();
    user_service_1.UserService.generateAdmin();
    logging_1.logger.info("Listening on port 3000");
});
