import { User } from "@prisma/client";

export type UserResponse = {
    id: number;
    username: string;
    phone: string;
    name: string;
    role: string;
    isVerified: boolean
}

export type CreateUserRequest = {
    phone: string;
    name: string;
    password: string;
}

export function toUserResponse(user: User, isVerified: boolean): UserResponse {
    return {
        id: user.id,
        phone: user.phone,
        username: user.username,
        name: user.name,
        role: user.role,
        isVerified
    }
}