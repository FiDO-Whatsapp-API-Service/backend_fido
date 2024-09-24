"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUserResponse = toUserResponse;
exports.toUserWithoutPassword = toUserWithoutPassword;
function toUserResponse(user, isVerified) {
    return {
        id: user.id,
        phone: user.phone,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified
    };
}
function toUserWithoutPassword(user) {
    return {
        id: user.id,
        phone: user.phone,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
    };
}
