
export interface IFormControl {
    name: string;
    label: string;
    placeholder: string;
    type: string;
    componentType: string;
    options?: { id: string; label: string }[];
}

export const signInFormControl: IFormControl[] = [
    {
        name: 'userEmail',
        label: 'User Email',
        placeholder: 'Enter your user email',
        type: 'email',
        componentType: 'input'
    },
    {
        name: 'password',
        label: 'Password',
        placeholder: 'Enter your password',
        type: 'password',
        componentType: 'input'
    }
];
export const signUpFormControl: IFormControl[] = [
    {
        name: 'userName',
        label: 'User Name',
        placeholder: 'Enter your user name',
        type: 'text',
        componentType: 'input',
    },
    {
        name: 'userEmail',
        label: 'User Email',
        placeholder: 'Enter your user email',
        type: 'email',
        componentType: 'input'
    },
    {
        name: 'password',
        label: 'Password',
        placeholder: 'Enter your password',
        type: 'password',
        componentType: 'input'
    }
];


export const initialStateOfSignUpFormData = {
    userName: "",
    userEmail: "",
    password: "",
};

export const initialStateOfSignInFormData = {
    userEmail: "",
    password: "",
};