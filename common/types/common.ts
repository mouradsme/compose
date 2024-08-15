export interface Student {
  id?: string;
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  birthday: string;
  communeId?: number;
  language?: string;
  tags?: Tag[];
}

export interface Commune {
  id: number;
  communeNameAr: string;
  communeNameFr: string;
  dairaNameAr: string;
  dairaNameFr: string;
}

export interface Wilaya {
  code: string;
  wilayaNameAr: string;
  wilayaNameFr: string;
  communes: Commune[];
}

export interface Error {
  message: string;
}

export interface StudentLogin {
  email: string;
  password: string;
}
export interface AdminLogins {
  email: string;
  password: string;
}

export interface StudentSignup extends Student {
  tagIds: string[];
}

export interface UserSessionData {
  accessToken: string;
  fullName: string;
  email: string;
  language: 'AR' | 'EN' | 'FR';
  phoneNumber: string;
  authorities: string[];
}

export enum TagTypes {
  PATH = 'PATH',
  SUBJECT = 'SUBJECT',
  STUDY_YEAR = 'STUDY_YEAR',
  LEVEL = 'LEVEL',
}

export interface Tag {
  id: string;
  translations: {
    language: string;
    name: string;
    description: string;
  }[];
  childTags?: Tag[];
  tagType: TagTypes;
  parentTagId?: string;
}

export interface Level extends Tag {
  studyYears: Tag[];
}

export interface Course {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  objectives: string[];
  startDate: string;
  endDate: string;
  durationInSeconds: number;
  numberOfElements: number;
  numberOfEnrolled: number;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
  price: number;
  isPublished: boolean;
  coverUrl: string;
}

export interface CourseCreate {
  title: string;
  shortDescription: string;
  description: string;
  objectives: string[];
  price: number;
  startDate: string;
  endDate: string;
  tagsIds: string[];
  instructorsIds: string[];
  isPublished: boolean;
  isFeatured: boolean;
}

export interface TagCreate {
  tagType: string;
  translations: {
    language: string;
    name: string;
    description: string;
  }[];
  parentTagId?: string;
}

export interface TagUpdate {
  id: string;
  translations: {
    language: string;
    name: string;
    description: string;
  }[];
  tagType: string;
  parentTagId?: string;
}

type FiledValue = string | number | readonly string[] | undefined;
export interface Field {
  placeholder: string;
  name: string;
  value?: FiledValue;
  type?: string;
}

export type RecordFromFields = {
  [K in Field['name']]: string | boolean;
};

export interface Instructor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  tagsIds: string[];
}

export interface InstructorCreate {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  tagsIds: string[];
}

export interface SectionCreate {
  title: string;
  description: string;
  sectionOrder: number;
}

export interface Section {
  id: string;
  title: string;
  description: string;
  sectionOrder: number;
}

export interface LessonCreate {
  title: string;
  description: string;
  lessonOrder: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  elements?: Element[];
  lessonOrder: number;
}

export interface Element {
  id: string;
  title: string;
  description: string;
  elementOrder: number;
  content: string;
  durationInSeconds: number;
  isFree: boolean;
}

export interface ElementCreate {
  title: string;
  description: string;
  elementOrder: number;
  content: string;
  durationInSeconds: number;
  isFree: boolean;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
}

export interface QuizCreate {
  title: string;
  description: string;
}

export interface Answer {
  id?: string;
  answer: string;
  isCorrect: boolean;
}

export interface QuestionCreate {
  content: string[];
  suggestedAnswers: Answer[];
}

export interface Question {
  id: string;
  content: string[];
  suggestedAnswers: Answer[];
}

export interface Plan {
  id: string;
  translations: {
    id: string;
    language: string;
    name: string;
    description: string;
    features: string[];
  }[];
  price: number;
  durationInDays: number;
  createdAt: string;
  updatedAt: string;
}

export interface PlanCreate {
  translations: {
    language: string;
    name: string;
    description: string;
    features: string[];
  }[];
  price: number;
  durationInDays: number;
}

export interface SerialNumber {
  id: string;
  code: string;
  status: string;
  expirationDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface SerialNumberCreate {
  quantity: number;
  expireAfterDays: number;
  subscriptionPlanId: string;
}

export interface PaymentMethod {
  id: string;
  translations: {
    id: string;
    language: string;
    name: string;
    description: string;
    details?: Record<string, string>;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethodCreate {
  translations: {
    language: string;
    name: string;
    description: string;
    details?: Record<string, string>;
  }[];
}

export enum SubscriptionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED',
  EXPIRED = 'EXPIRED',
}

export interface StudentSubscription {
  id: string;
  subscriptionPlan: {
    id: string;
    price: number;
    durationInDays: number;
    translations: {
      id: string;
      language: string;
      name: string;
      description: string;
      features: string[];
    }[];
    createdAt: string;
    updatedAt: string;
  };
  paymentMethod: {
    id: string;
    translations: {
      id: string;
      language: string;
      name: string;
      description: string;
      details: {
        [key: string]: any;
      };
    }[];
    createdAt: string;
    updatedAt: string;
  };
  student: {
    id: string;
    fullName: string;
  };
  hasProofFile: boolean;
  activatedAt: string;
  expireAt: string;
  status: SubscriptionStatus;
  updatedAt: string;
}

export interface StudentSubscriptionUpdate {
  comment: string;
  status: SubscriptionStatus;
}

export interface Supervisor {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  supervisorType: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCreate {
  fullName: string;
  email: string;
  password: string;
  language: 'AR' | 'EN' | 'FR';
}

export interface ProfileUpdate {
  fullName: string;
  email: string;
  phoneNumber?: string;
  birthday?: string;
  communeId?: number;
  language: 'AR' | 'EN' | 'FR';
  tagIds?: string[];
}

export interface Profile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  birthday: string;
  communeId: number;
  tags: Tag[];
}

export interface Admin {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  birthday: string;
  communeId: number;
  tags: Tag[];
}
