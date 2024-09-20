import express from "express"
import { publicRouter } from "../routes/public.api"
import { errorMiddleware } from "../middlewares/error.middleware"
import { apiRouter } from "../routes/api"
import { createServer } from "http"
import cors from "cors"
import { Server } from "socket.io"

export const web = express()
export const server = createServer(web);
export const io = new Server(server, {
    cors: {
        origin: "*"
    }
})

web.use(cors({
    origin: "*"
}))
web.use(express.json())
web.use("/api", publicRouter)
web.use("/api", apiRouter)
web.use(errorMiddleware)
