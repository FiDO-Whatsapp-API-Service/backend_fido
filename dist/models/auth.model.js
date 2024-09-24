"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSessionResponse = toSessionResponse;
function toSessionResponse(user, token) {
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
    };
}
