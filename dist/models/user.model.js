"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUserResponse = toUserResponse;
function toUserResponse(user, isVerified) {
    return {
        id: user.id,
        phone: user.phone,
        username: user.username,
        name: user.name,
        role: user.role,
        isVerified
    };
}
