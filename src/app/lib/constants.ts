export const Roles = {
    ADMIN: 'ROLE_ADMIN',
    USER: 'ROLE_USER',
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];
