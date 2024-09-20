import express from "express"
import { DeviceController } from "../controllers/device.controller"

// PREFIX --> /device
export const deviceRouter = express.Router()
deviceRouter.get("/", DeviceController.getByUser)
deviceRouter.post("/", DeviceController.create)
deviceRouter.delete("/:id", DeviceController.destroy)
deviceRouter.get("/:id/login", DeviceController.login)
deviceRouter.patch("/:id/token", DeviceController.refreshToken)

