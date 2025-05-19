
export interface IFormControl {
    name: string;
    label: string;
    placeholder: string;
    type: string;
    componentType: string;
    options?: { id: string; label: string }[];
}

export interface ICommonOptions {
    id: string;
    label: string;
}

export interface ICourseLandingPageFormControls {
    name: string;
    label: string;
    componentType: string;
    type?: string;
    placeholder: string;
    options?: ICommonOptions[];
}

export interface ICourseCurriculumInitialFormData {
  title: string;
  videoUrl: string;
  freePreview: boolean;
  public_id: string;
}

export interface ICourseLandingPageInitialFormData {
  title: string;
  category: string | undefined;
  level: string | undefined;
  primaryLanguage: string | undefined;
  subtitle: string;
  description: string;
  pricing: string;
  objectives: string;
  welcomeMessage: string;
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


export const languageOptions: ICommonOptions[] = [
  { id: "english", label: "English" },
  { id: "spanish", label: "Spanish" },
  { id: "french", label: "French" },
  { id: "german", label: "German" },
  { id: "chinese", label: "Chinese" },
  { id: "japanese", label: "Japanese" },
  { id: "korean", label: "Korean" },
  { id: "portuguese", label: "Portuguese" },
  { id: "arabic", label: "Arabic" },
  { id: "russian", label: "Russian" },
];

export const courseLevelOptions: ICommonOptions[] = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];

export const courseCategories: ICommonOptions[] = [
  { id: "web-development", label: "Web Development" },
  { id: "backend-development", label: "Backend Development" },
  { id: "data-science", label: "Data Science" },
  { id: "machine-learning", label: "Machine Learning" },
  { id: "artificial-intelligence", label: "Artificial Intelligence" },
  { id: "cloud-computing", label: "Cloud Computing" },
  { id: "cyber-security", label: "Cyber Security" },
  { id: "mobile-development", label: "Mobile Development" },
  { id: "game-development", label: "Game Development" },
  { id: "software-engineering", label: "Software Engineering" },
];

export const courseLandingPageFormControls: ICourseLandingPageFormControls[] = [
  {
    name: "title",
    label: "Title",
    componentType: "input",
    type: "text",
    placeholder: "Enter course title",
  },
  {
    name: "category",
    label: "Category",
    componentType: "select",
    type: "text",
    placeholder: "",
    options: courseCategories,
  },
  {
    name: "level",
    label: "Level",
    componentType: "select",
    type: "text",
    placeholder: "",
    options: courseLevelOptions,
  },
  {
    name: "primaryLanguage",
    label: "Primary Language",
    componentType: "select",
    type: "text",
    placeholder: "",
    options: languageOptions,
  },
  {
    name: "subtitle",
    label: "Subtitle",
    componentType: "input",
    type: "text",
    placeholder: "Enter course subtitle",
  },
  {
    name: "pricing",
    label: "Pricing",
    componentType: "input",
    type: "number",
    placeholder: "Enter course pricing",
  },
  {
    name: "objectives",
    label: "Objectives",
    componentType: "textarea",
    type: "text",
    placeholder: "Enter course objectives",
  },
  {
    name: "welcomeMessage",
    label: "Welcome Message",
    componentType: "textarea",
    placeholder: "Welcome message for students",
  },
];



export const courseLandingInitialFormData: ICourseLandingPageInitialFormData = {
  title: "",
  category: undefined,
  level: undefined,
  primaryLanguage: undefined,
  subtitle: "",
  description: "",
  pricing: "",
  objectives: "",
  welcomeMessage: ""
};

export const courseCurriculumInitialFormData: ICourseCurriculumInitialFormData[] = [
  {
    title: "",
    videoUrl: "",
    freePreview: false,
    public_id: "",
  },
];

export const sortOptions: ICommonOptions[] = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const filterOptions:{
    category: ICommonOptions[], 
    level: ICommonOptions[], 
    primaryLanguage: ICommonOptions[]
} = {
  category: courseCategories,
  level: courseLevelOptions,
  primaryLanguage: languageOptions,
};