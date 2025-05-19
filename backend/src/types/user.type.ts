export enum UserRole {
    TUTOR = 'tutor',
    STUDENT = 'student',
    ADMIN = 'admin'
}

export interface UserResponse {
    id: number;
    userName: string;
    userEmail: string;
    role: UserRole;
}