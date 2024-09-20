import { logger } from "./app/logging";
import { server } from "./app";
import { init } from "./app/waService";

server.listen(3000, () => {
    init()
    logger.info("Listening on port 3000")
})