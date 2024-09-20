import express from "express"
import { UserController } from "../controllers/user.controller"
import { AuthController } from "../controllers/auth.controller"
import { io } from "../app"

export const publicRouter = express.Router()
publicRouter.post("/users", UserController.register)
publicRouter.post("/login", AuthController.login)
publicRouter.get("/test", (req, res) => {
    io.emit("message", "test")
    return res.json({ "test": "test" })
})