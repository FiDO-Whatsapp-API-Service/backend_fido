import { Device, User } from "@prisma/client"

export type CreateDeviceRequest = {
    name: string
}

export interface DeviceWithUser extends Device {
    user: User
}