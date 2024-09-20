"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toLoginResponse = toLoginResponse;
function toLoginResponse(user, token) {
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
    };
}
