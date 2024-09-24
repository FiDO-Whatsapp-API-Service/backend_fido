import { Role, User } from "@prisma/client";

export type UserResponse = {
    id: number;
    username: string;
    phone: string;
    name: string;
    role: string;
    email: string | null;
    isVerified: boolean
}

export type CreateUserRequest = {
    phone: string;
    name: string;
    password: string;
}

export type updateUserRequest = {
    username: string;
    name: string;
    email: string;
}

export type SetRoleUserRequest = {
    id: number;
    role: Role
}

export type UserWithoutPassword = Omit<User, 'password'>

export function toUserResponse(user: User, isVerified: boolean): UserResponse {
    return {
        id: user.id,
        phone: user.phone,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified
    }
}

export function toUserWithoutPassword(user: User): UserWithoutPassword {
    return {
        id: user.id,
        phone: user.phone,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
    }
} 