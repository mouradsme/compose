import { useReducer } from 'react';
import { changePasswordSchema, updateProfileSchema } from '@/common/schemas';
import { changePassword } from '@/lib/auth/login';
import { getUserInfoClient, setUserInfoClient } from '@/lib/common';
import { updateProfile } from '@/lib/profile';
import { Password, User } from '@/components/Icons';
import { useTranslation } from 'next-i18next';
import Button from '@/components/common/buttons';
import { useRouter } from 'next/router';
import { AxiosError } from 'axios';
import { ValidationError } from 'yup';
import { useMessage } from '@/contexts/message';

interface CreateAdminState {
  fullName: string;
  email: string;
  password: string;
  newPassword: string;
  language: 'AR' | 'EN' | 'FR';
}

const initialState: CreateAdminState = {
  fullName: '',
  email: '',
  password: '',
  newPassword: '',
  language: 'EN',
};

enum ActionType {
  SET_FULLNAME = 'SET_FULLNAME',
  SET_EMAIL = 'SET_EMAIL',
  SET_PASSWORD = 'SET_PASSWORD',
  SET_NEW_PASSWORD = 'SET_NEW_PASSWORD',
  SET_LANGUAGE = 'SET_LANGUAGE',
}

type CreateAdminAction = {
  type: ActionType;
  payload: any;
};

const reducer = (state: CreateAdminState, action: CreateAdminAction): CreateAdminState => {
  switch (action.type) {
    case ActionType.SET_FULLNAME:
      return { ...state, fullName: action.payload };
    case ActionType.SET_EMAIL:
      return { ...state, email: action.payload };
    case ActionType.SET_PASSWORD:
      return { ...state, password: action.payload };
    case ActionType.SET_NEW_PASSWORD:
      return { ...state, newPassword: action.payload };
    case ActionType.SET_LANGUAGE:
      return { ...state, language: action.payload };
    default:
      return state;
  }
};

const AdminProfile = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation('profile');
  const user = getUserInfoClient();
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    fullName: user.fullName,
    email: user.email,
    language: user.language,
  });
  const { showMessage } = useMessage();

  const handleProfileSubmit = async () => {
    try {
      await updateProfileSchema.validate(state);
      await updateProfile(state);
    } catch (error: any) {
      showMessage(error.message, 'error');
      return;
    }
    const _user = {
      ...user,
      email: state.email,
      fullName: state.fullName,
      language: state.language,
    };
    setUserInfoClient(_user);
    showMessage(t('profileUpdatedSuccessfully'), 'success');
    i18n.changeLanguage(state.language.toLocaleLowerCase());
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: state.language.toLocaleLowerCase() });
  };

  const handlePasswordSubmit = async () => {
    try {
      await changePasswordSchema.validate(state);
      await changePassword(state.password, state.newPassword);
    } catch (error) {
      if (error instanceof ValidationError) {
        showMessage(error.message, 'error');
      } else if (error instanceof AxiosError) {
        const message = error.response?.data.errors[0].message;
        showMessage(message, 'error');
      }
      return;
    }
    showMessage(t('passwordUpdatedSuccessfully'), 'success');
  };

  return (
    <>
      <div className="flex flex-row gap-5">
        <User />
        <p className="font-Poppins text-[#080940] text-2xl font-semibold">
          {t('profileInformation')}
        </p>
      </div>
      <div className="flex flex-col gap-5 p-10">
        <div className="flex flex-col w-3/12 gap-3 mb-3">
          <div className="flex flex-col">
            <p className="font-open-sans text-[#273B54] font-semibold">{t('fullName')}</p>
            <input
              className="border-b border-gray-400 outline-none placeholder-open-sans placeholder-[#7C8DA6] font-normal"
              type="text"
              value={state.fullName}
              onChange={(e) => dispatch({ type: ActionType.SET_FULLNAME, payload: e.target.value })}
              placeholder={t('fullName') as string}
            />
          </div>
          <div className="flex flex-col">
            <p className="font-open-sans text-[#273B54] font-semibold">{t('email')}</p>
            <input
              className="border-b border-gray-400 outline-none placeholder-open-sans placeholder-[#7C8DA6] font-normal"
              type="text"
              value={state.email}
              onChange={(e) => dispatch({ type: ActionType.SET_EMAIL, payload: e.target.value })}
              placeholder={t('email') as string}
            />
          </div>
        </div>
        <div className="flex flex-col gap-3 w-3/12 mb-3">
          <p className=" font-open-sans text-2xl  font-semibold text-[#080940]">{t('language')}</p>
          <select
            className="text-[#8F9CB2] font-Poppins text-normal text-sm placeholder-[#7C8DA6] font-normal border px-3 py-2 rounded-md outline-none"
            value={state.language}
            onChange={(e) => dispatch({ type: ActionType.SET_LANGUAGE, payload: e.target.value })}
          >
            <option className="text-[#8F9CB2] font-Poppins font-normal text-sm" value="EN">
              {t('english')}
            </option>
            <option className="text-[#8F9CB2] font-Poppins text-normal text-sm" value="FR">
              {t('french')}
            </option>
            <option className="text-[#8F9CB2] font-Poppins text-normal text-sm" value="AR">
              {t('arabic')}
            </option>
          </select>
        </div>
        <div className="flex flex-row gap-3">
          <Button type="info" onClick={handleProfileSubmit}>
            {t('save')}
          </Button>
        </div>
      </div>
      <div className="flex flex-row gap-5">
        <Password />
        <p className="font-Poppins text-[#080940] text-2xl font-semibold">{t('updatePassword')}</p>
      </div>
      <div className="flex flex-col gap-5 p-10">
        <div className="flex flex-col w-3/12">
          <p className="font-open-sans text-[#273B54] font-semibold">{t('password')}</p>
          <input
            className="border-b border-gray-400 outline-none placeholder-open-sans placeholder-[#7C8DA6] font-normal"
            value={state.password}
            onChange={(e) => dispatch({ type: ActionType.SET_PASSWORD, payload: e.target.value })}
            type="password"
            placeholder="****************"
          />
        </div>
        <div className="flex flex-col w-3/12">
          <p className="font-open-sans text-[#273B54] font-semibold">{t('newPassword')}</p>
          <input
            className="border-b border-gray-400 outline-none placeholder-open-sans placeholder-[#7C8DA6] font-normal"
            value={state.newPassword}
            onChange={(e) =>
              dispatch({ type: ActionType.SET_NEW_PASSWORD, payload: e.target.value })
            }
            type="password"
            placeholder="****************"
          />
        </div>
        <div className="flex flex-row gap-3">
          <Button type="info" onClick={handlePasswordSubmit}>
            {t('save')}
          </Button>
        </div>
      </div>
    </>
  );
};

export default AdminProfile;
