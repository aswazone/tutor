
export enum UserRole {
  TUTOR = 'tutor',
  STUDENT = 'student',
  ADMIN = 'admin'
}

export type SignInFormData = {
  userEmail: string;
  password: string;
};

export type SignUpFormData = SignInFormData & {
  userName: string;
  confirmPassword: string;
};

export type SignUpRequest = {
  userName: string;
  userEmail: string;
  password: string;
  role: UserRole 
}

export interface SignUpResponse {
  userEmail: string;
}

export interface SignInResponse {
  accessToken: string;
  user: Record<string, string>;
}

export interface SignInRequest {
  userEmail: string;
  password: string;
  role: UserRole
}


export interface IAuthState {
  accessToken: string | null,
  activeTab: string,
  user: Record<string, string> | null,
  isAuthenticated: boolean,
  isLoading: boolean,
  error: string | null
}
