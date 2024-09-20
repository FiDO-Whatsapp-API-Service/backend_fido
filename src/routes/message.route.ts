import express from "express"
import { MessageController } from "../controllers/message.controller"

export const messageRouter = express.Router()
messageRouter.post("/:id/send", MessageController.sendMessage)