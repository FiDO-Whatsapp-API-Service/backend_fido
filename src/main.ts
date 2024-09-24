import { logger } from "./app/logging";
import { server } from "./app";
import { init } from "./app/waService";
import { UserService } from "./services/user.service";

server.listen(3000, () => {
    // Init WhatsApp sessions
    init()
    UserService.generateAdmin()
    logger.info("Listening on port 3000")
})