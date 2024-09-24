import { UserResponse } from "./user.model";

export type SessionResponse = {
    user: UserResponse;
    token: string;
}
export type LoginUserRequest = {
    username: string;
    password: string;
}

export function toSessionResponse(user: UserResponse, token: string): SessionResponse {
    return {
        user: {
            id: user.id,
            phone: user.phone,
            username: user.username,
            name: user.name,
            role: user.role,
            email: user.email,
            isVerified: user.isVerified
        },
        token
    }
}
