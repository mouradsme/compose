import { object, string, number, array, mixed, boolean } from 'yup';
import i18next from 'i18next';
const t = i18next.t.bind(i18next);

const singupSchema = object().shape({
  fullName: string()
    .typeError(t<string>('validation.fullName.typeError'))
    .required(t<string>('validation.fullName.required'))
    .min(6, t<string>('validation.fullName.min'))
    .max(120, t<string>('validation.fullName.max')),
  email: string()
    .typeError(t<string>('validation.email.typeError'))
    .email()
    .typeError(t<string>('validation.email.typeError'))
    .required(t<string>('validation.email.required'))
    .min(8, t<string>('validation.email.min'))
    .max(120, t<string>('validation.email.max')),
  password: string()
    .typeError(t<string>('validation.password.typeError'))
    .min(8, t<string>('validation.password.min'))
    .max(150, t<string>('validation.password.max'))
    .required(t<string>('validation.password.required')),
  phoneNumber: string()
    .typeError(t<string>('validation.phoneNumber.typeError'))
    .notRequired()
    .matches(/^(\+\d{1,3}[- ]?)?\d{10}$/, t<string>('validation.phoneNumber.typeError')),
  birthday: string()
    .matches(
      /^(0?[1-9]|[12][0-9]|3[01])-(0?[1-9]|1[012])-\d{4}$|^(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])-\d{4}$|^\d{4}-(0?[1-9]|[12][0-9]|3[01])-(0?[1-9]|1[012])$|^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/,
      t<string>('validation.birthday.invalidFormat')
    )
    .required(t<string>('validation.birthday.required'))
    .min(10, t<string>('validation.birthday.min'))
    .max(11, t<string>('validation.birthday.max')),
  communeId: number()
    .typeError(t<string>('validation.birthday.typeError'))
    .required(t<string>('validation.birthday.required')),
  tagIds: mixed().test({
    name: 'minLength',
    message: t<string>('validation.tags.required'),
    test: function (value) {
      return (
        Array.isArray(value) &&
        value.length === 3 &&
        value.every((v: string) => v.length > 1) &&
        value.every((v: string) => typeof v === 'string')
      );
    },
  }),
});

const signinSchema = object().shape({
  email: string()
    .typeError(t<string>('validation.email.typeError'))
    .email()
    .typeError(t<string>('validation.email.typeError'))
    .required(t<string>('validation.email.required'))
    .min(8, t<string>('validation.email.min'))
    .max(120, t<string>('validation.email.max')),
  password: string()
    .typeError(t<string>('validation.password.typeError'))
    .min(8, t<string>('validation.password.min'))
    .max(150, t<string>('validation.password.max'))
    .required(t<string>('validation.password.required')),
});

const tagSchema = object({
  id: string(),
  title: string(),
});

const courseSchema = object().shape({
  title: string()
    .typeError(t<string>('validation.title.typeError'))
    .required(t<string>('validation.title.required')),
  shortDescription: string()
    .typeError(t<string>('validation.shortDescription.typeError'))
    .required(t<string>('validation.shortDescription.required')),
  description: string()
    .typeError(t<string>('validation.description.typeError'))
    .required(t<string>('validation.description.required')),
  objectives: mixed().test({
    name: 'minLength',
    message: t<string>('validation.objectives.min'),
    test: function (value) {
      return (
        Array.isArray(value) &&
        value.length >= 1 &&
        value?.[0].length > 1 &&
        typeof value?.[0] === 'string'
      );
    },
  }),
  // array()
  //   .required(t<string>('validation.objectives.required'))
  //   .min(1, t<string>('validation.objectives.min'))
  //   .typeError(t<string>('validation.objectives.typeError'))
  //   .of(
  //     string()
  //       .typeError(t<string>('validation.objectives.typeError'))
  //       .required(t<string>('validation.objectives.required'))
  //   ),

  price: number()
    .typeError(t<string>('validation.price.typeError'))
    .required(t<string>('validation.price.required'))
    .min(0, t<string>('validation.price.min')),
  instructors: array()
    .typeError(t<string>('validation.instructors.typeError'))
    .of(
      string()
        .typeError(t<string>('validation.instructors.typeError'))
        .required(t<string>('validation.instructors.required'))
    )
    .min(1, t<string>('validation.instructors.min')),
  selectedLevel: tagSchema.test(
    'is-selectedLevel-valid',
    t<string>('validation.selectedLevel.required'),
    (value) => !!Object.keys(value).length
  ),
  selectedYear: tagSchema.test(
    'is-selectedYear-valid',
    t<string>('validation.selectedYear.required'),
    (value) => !!Object.keys(value).length
  ),
  selectedPath: array().of(tagSchema).notRequired(),
  selectedSubject: array()
    .of(tagSchema)
    .test(
      'is-selectedSubject-valid',
      'validation.selectedSubject.required',
      (value) => !!value && value.length > 0
    ),
});

const sectionSchema = object().shape({
  title: string()
    .typeError(t<string>('validation.title.typeError'))
    .required(t<string>('validation.title.required')),
  description: string()
    .typeError(t<string>('validation.description.typeError'))
    .required(t<string>('validation.description.required')),
  sectionOrder: number()
    .typeError(t<string>('validation.sectionOrder.typeError'))
    .required(t<string>('validation.sectionOrder.required')),
});

const lessonSchema = object().shape({
  title: string()
    .typeError(t<string>('validation.title.typeError'))
    .required(t<string>('validation.title.required')),
  description: string()
    .typeError(t<string>('validation.description.typeError'))
    .required(t<string>('validation.lesson.description.required')),
  lessonOrder: number()
    .typeError(t<string>('validation.lessonOrder.typeError'))
    .required(t<string>('validation.lessonOrder.required')),
});

const elementSchema = object().shape({
  title: string()
    .typeError(t<string>('validation.title.typeError'))
    .required(t<string>('validation.title.required')),
  description: string()
    .typeError(t<string>('validation.description.typeError'))
    .required(t<string>('validation.description.required')),
  elementOrder: number()
    .typeError(t<string>('validation.elementOrder.typeError'))
    .integer(t<string>('validation.elementOrder.integer'))
    .required(t<string>('validation.elementOrder.required')),
  content: string()
    .typeError(t<string>('validation.content.typeError'))
    .url(t<string>('validation.content.url'))
    .required(t<string>('validation.content.required')),
  durationInSeconds: number()
    .typeError(t<string>('validation.durationInSeconds.typeError'))
    .integer(t<string>('validation.durationInSeconds.integer'))
    .required(t<string>('validation.durationInSeconds.required')),
  isFree: boolean().required(t<string>('validation.isFree.required')),
});

const quizSchema = object().shape({
  title: string()
    .typeError(t<string>('validation.title.typeError'))
    .required(t<string>('validation.title.required')),
  description: string()
    .typeError(t<string>('validation.description.typeError'))
    .required(t<string>('validation.description.required')),
});

const questionSchema = object().shape({
  content: array()
    .of(string().typeError(t<string>('validation.content.typeError')))
    .required(t<string>('validation.content.required'))
    .typeError(t<string>('validation.content.typeError')),
  suggestedAnswers: array()
    .of(
      object().shape({
        answer: string()
          .required(t<string>('validation.suggestedAnswers.answer.required'))
          .typeError(t<string>('validation.suggestedAnswers.answer.typeError')),
        isCorrect: boolean()
          .required(t<string>('validation.suggestedAnswers.isCorrect.required'))
          .typeError(t<string>('validation.suggestedAnswers.isCorrect.typeError')),
      })
    )
    .min(2, t<string>('validation.suggestedAnswers.min'))
    .required(t<string>('validation.suggestedAnswers.required'))
    .typeError(t<string>('validation.suggestedAnswers.arrayTypeError')),
});

const createAdminSchema = object().shape({
  fullName: string()
    .required(t<string>('validation.fullName.required'))
    .min(4, t<string>('validation.fullName.min'))
    .max(120, t<string>('validation.fullName.max'))
    .typeError(t<string>('validation.fullName.typeError')),
  email: string()
    .email(t<string>('validation.email.validEmail'))
    .required(t<string>('validation.email.required'))
    .min(8, t<string>('validation.email.min'))
    .max(120, t<string>('validation.email.max'))
    .typeError(t<string>('validation.email.typeError')),
  password: string()
    .min(8, t<string>('validation.password.min'))
    .max(150, t<string>('validation.password.max'))
    .required(t<string>('validation.password.required'))
    .typeError(t<string>('validation.password.typeError')),
  language: string()
    .required(t<string>('validation.language.required'))
    .typeError(t<string>('validation.language.typeError')),
});

const updateProfileSchema = object().shape({
  fullName: string()
    .required(t<string>('validation.fullName.required'))
    .min(4, t<string>('validation.fullName.min'))
    .max(120, t<string>('validation.fullName.max'))
    .typeError(t<string>('validation.fullName.typeError')),
  email: string()
    .email(t<string>('validation.email.validEmail'))
    .required(t<string>('validation.email.required'))
    .min(8, t<string>('validation.email.min'))
    .max(120, t<string>('validation.email.max'))
    .typeError(t<string>('validation.email.typeError')),
  language: string()
    .required(t<string>('validation.language.required'))
    .typeError(t<string>('validation.language.typeError')),
});

const changePasswordSchema = object().shape({
  password: string()
    .min(8, t<string>('validation.password.min'))
    .max(150, t<string>('validation.password.max'))
    .required(t<string>('validation.password.required'))
    .typeError(t<string>('validation.password.typeError')),
  newPassword: string()
    .min(8, t<string>('validation.newPassword.min'))
    .max(150, t<string>('validation.newPassword.max'))
    .required(t<string>('validation.newPassword.required'))
    .typeError(t<string>('validation.newPassword.typeError')),
});

const translationSchema = object().shape({
  language: string()
    .required(t<string>('validation.language.required'))
    .typeError(t<string>('validation.language.typeError')),
  name: string()
    .required(t<string>('validation.name.required'))
    .typeError(t<string>('validation.name.typeError')),
  description: string()
    .required(t<string>('validation.description.required'))
    .typeError(t<string>('validation.description.typeError')),
});

const tagCreateSchema = object().shape({
  tagType: string()
    .required(t<string>('validation.tagType.required'))
    .typeError(t<string>('validation.tagType.typeError')),
  translations: array()
    .typeError(t<string>('validation.translations.typeError'))
    .of(translationSchema)
    .min(3, t<string>('validation.translations.min'))
    .required(t<string>('validation.translations.required')),
  parentTagId: string().typeError(t<string>('validation.parentTagId.typeError')).notRequired(),
});

const tagUpdateSchema = object().shape({
  id: string()
    .required(t<string>('validation.id.required'))
    .typeError(t<string>('validation.id.typeError')),
  translations: array()
    .of(translationSchema)
    .min(3, t<string>('validation.translations.min'))
    .required(t<string>('validation.translations.required'))
    .typeError(t<string>('validation.translations.typeError')),
  tagType: string()
    .required(t<string>('validation.tagType.required'))
    .typeError(t<string>('validation.tagType.typeError')),
  parentTagId: string().typeError(t<string>('validation.parentTagId.typeError')).notRequired(),
});

const instructorSchemaBase = {
  firstName: string()
    .required(t<string>('validation.firstName.required'))
    .typeError(t<string>('validation.firstName.typeError')),
  lastName: string()
    .required(t<string>('validation.lastName.required'))
    .typeError(t<string>('validation.lastName.typeError')),
  email: string()
    .email(t<string>('validation.email.invalidFormat'))
    .required(t<string>('validation.email.required'))
    .typeError(t<string>('validation.email.typeError')),
  phone: string()
    .required(t<string>('validation.phone.required'))
    .matches(/^(\+\d{1,3}[- ]?)?\d{10}$/, t<string>('validation.phone.invalid'))
    .typeError(t<string>('validation.phone.typeError')),
  bio: string()
    .required(t<string>('validation.bio.required'))
    .typeError(t<string>('validation.bio.typeError')),
  tagsIds: array()
    .of(string().typeError(t<string>('validation.tagsIds.typeError')))
    .notRequired(),
};

const instructorCreateSchema = object().shape(instructorSchemaBase);

const instructorUpdateSchema = object().shape({
  ...instructorSchemaBase,
  id: string()
    .required(t<string>('validation.id.required'))
    .typeError(t<string>('validation.id.typeError')),
});

const planTranslationSchema = object().shape({
  id: string().when('$isUpdate', (isUpdate, schema) => {
    return isUpdate?.[0]
      ? schema
          .required(t<string>('validation.id.required'))
          .typeError(t<string>('validation.id.typeError'))
      : schema.notRequired();
  }),
  language: string()
    .required(t<string>('validation.language.required'))
    .typeError(t<string>('validation.language.typeError')),
  name: string()
    .required(t<string>('validation.name.required'))
    .typeError(t<string>('validation.name.typeError')),
  description: string()
    .required(t<string>('validation.description.required'))
    .typeError(t<string>('validation.description.typeError')),
  features: array()
    .of(
      string()
        .required(t<string>('validation.feature.required'))
        .typeError(t<string>('validation.feature.typeError'))
    )
    .required(t<string>('validation.features.required'))
    .typeError(t<string>('validation.features.typeError')),
});

const planUpdateSchema = object().shape({
  id: string()
    .required(t<string>('validation.id.required'))
    .typeError(t<string>('validation.id.typeError')),
  translations: array()
    .of(planTranslationSchema)
    .min(3, t<string>('validation.translations.min'))
    .required(t<string>('validation.translations.required'))
    .typeError(t<string>('validation.translations.typeError')),
  price: number()
    .positive(t<string>('validation.price.positive'))
    .required(t<string>('validation.price.required'))
    .typeError(t<string>('validation.price.typeError')),
  durationInDays: number()
    .positive(t<string>('validation.durationInDays.positive'))
    .integer(t<string>('validation.durationInDays.integer'))
    .required(t<string>('validation.durationInDays.required'))
    .typeError(t<string>('validation.durationInDays.typeError')),
  createdAt: string()
    .required(t<string>('validation.createdAt.required'))
    .typeError(t<string>('validation.createdAt.typeError')),
  updatedAt: string()
    .required(t<string>('validation.updatedAt.required'))
    .typeError(t<string>('validation.updatedAt.typeError')),
});

const planCreateSchema = object().shape({
  translations: array()
    .of(planTranslationSchema)
    .min(3, t<string>('validation.translations.min'))
    .required(t<string>('validation.translations.required'))
    .typeError(t<string>('validation.translations.typeError')),
  price: number()
    .positive(t<string>('validation.price.positive'))
    .required(t<string>('validation.price.required'))
    .typeError(t<string>('validation.price.typeError')),
  durationInDays: number()
    .positive(t<string>('validation.durationInDays.positive'))
    .integer(t<string>('validation.durationInDays.integer'))
    .required(t<string>('validation.durationInDays.required'))
    .typeError(t<string>('validation.durationInDays.typeError')),
});

const paymentMethodTranslationSchema = object().shape({
  id: string().when('$isUpdate', (isUpdate, schema) =>
    isUpdate?.[0]
      ? schema
          .required(t<string>('validation.id.required'))
          .typeError(t<string>('validation.id.typeError'))
      : schema.notRequired()
  ),
  language: string()
    .required(t<string>('validation.language.required'))
    .typeError(t<string>('validation.language.typeError')),
  name: string()
    .required(t<string>('validation.name.required'))
    .typeError(t<string>('validation.name.typeError')),
  description: string()
    .required(t<string>('validation.description.required'))
    .typeError(t<string>('validation.description.typeError')),
});

const paymentMethodUpdateSchema = object().shape({
  id: string().when('$isUpdate', (isUpdate, schema) =>
    isUpdate?.[0]
      ? schema
          .required(t<string>('validation.id.required'))
          .typeError(t<string>('validation.id.typeError'))
      : schema.notRequired()
  ),
  translations: array()
    .of(paymentMethodTranslationSchema)
    .min(3, t<string>('validation.translations.min'))
    .required(t<string>('validation.translations.required'))
    .typeError(t<string>('validation.translations.typeError')),
  createdAt: string()
    .required(t<string>('validation.createdAt.required'))
    .typeError(t<string>('validation.createdAt.typeError')),
  updatedAt: string()
    .required(t<string>('validation.updatedAt.required'))
    .typeError(t<string>('validation.updatedAt.typeError')),
});

const paymentMethodCreateSchema = object().shape({
  translations: array()
    .typeError(t<string>('validation.translations.typeError'))
    .of(paymentMethodTranslationSchema)
    .min(3, t<string>('validation.translations.min'))
    .required(t<string>('validation.translations.required')),
});

const serialNumberCreateSchema = object().shape({
  quantity: number()
    .typeError(t<string>('validation.quantity.typeError'))
    .required(t<string>('validation.quantity.required'))
    .positive(t<string>('validation.quantity.positive'))
    .integer(t<string>('validation.quantity.integer')),
  expireAfterDays: number()
    .typeError(t<string>('validation.expireAfterDays.typeError'))
    .required(t<string>('validation.expireAfterDays.required'))
    .positive(t<string>('validation.expireAfterDays.positive'))
    .integer(t<string>('validation.expireAfterDays.integer')),
  subscriptionPlanId: string()
    .typeError(t<string>('validation.subscriptionPlanId.typeError'))
    .required(t<string>('validation.subscriptionPlanId.required')),
});

export {
  singupSchema,
  signinSchema,
  courseSchema,
  sectionSchema,
  lessonSchema,
  elementSchema,
  quizSchema,
  questionSchema,
  createAdminSchema,
  updateProfileSchema,
  changePasswordSchema,
  tagCreateSchema,
  tagUpdateSchema,
  instructorCreateSchema,
  instructorUpdateSchema,
  planUpdateSchema,
  planCreateSchema,
  paymentMethodUpdateSchema,
  paymentMethodCreateSchema,
  serialNumberCreateSchema,
};

export default Object.freeze({
  singupSchema,
  signinSchema,
  courseSchema,
  sectionSchema,
  lessonSchema,
  elementSchema,
  quizSchema,
  questionSchema,
  createAdminSchema,
  updateProfileSchema,
  changePasswordSchema,
  tagCreateSchema,
  tagUpdateSchema,
  instructorCreateSchema,
  instructorUpdateSchema,
  planUpdateSchema,
  planCreateSchema,
  paymentMethodUpdateSchema,
  paymentMethodCreateSchema,
  serialNumberCreateSchema,
});
