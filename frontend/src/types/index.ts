
export enum UserRole {
  TUTOR = 'tutor',
  STUDENT = 'student',
}

export type SignInFormData = {
  userEmail: string;
  password: string;
};

export type SignUpFormData = SignInFormData & {
  userName: string;
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
  user: Record<string, unknown>;
}

export interface SignInRequest {
  userEmail: string;
  password: string;
  role: UserRole
}


export interface IAuthState {
  accessToken: string,
  user: Record<string, unknown> | null,
  isAuthenticated: boolean,
  isLoading: boolean,
  error: string | null
}
