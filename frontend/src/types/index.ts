export type SignInFormData = {
  userEmail: string;
  password: string;
};

export type SignUpFormData = SignInFormData & {
  userName?: string;
};
