import { UserResponse } from "./user.model";

export type LoginUserResponse = {
    user: UserResponse;
    token: string;
}
export type LoginUserRequest = {
    phone: string;
    password: string;
}

export function toLoginResponse(user: UserResponse, token: string): LoginUserResponse {
    return {
        user: {
            id: user.id,
            phone: user.phone,
            username: user.username,
            name: user.name,
            role: user.role,
            isVerified: user.isVerified
        },
        token
    }
}
