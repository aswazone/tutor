export enum UserRole {
    TUTOR = 'tutor',
    STUDENT = 'student',
}

export interface UserResponse {
    id: number;
    userName: string;
    userEmail: string;
    role: UserRole;
}