import Image from 'next/image';
import UserAvatarIcon from '@/public/images/user-avatar.svg';
import { useReducer } from 'react';
import { createAdminSchema } from '@/common/schemas';
import { registerAdmin } from '@/lib/auth/register';
import { useTranslation } from 'next-i18next';
import Button from '@/components/common/buttons';
import { ValidationError } from 'yup';
import { AxiosError } from 'axios';
import { useMessage } from '@/contexts/message';

interface CreateAdminState {
  fullName: string;
  email: string;
  password: string;
  language: 'AR' | 'EN' | 'FR';
}

const initialState: CreateAdminState = {
  fullName: '',
  email: '',
  password: '',
  language: 'EN',
};

enum ActionType {
  SET_FULLNAME = 'SET_FULLNAME',
  SET_EMAIL = 'SET_EMAIL',
  SET_PASSWORD = 'SET_PASSWORD',
  SET_LANGUAGE = 'SET_LANGUAGE',
  DISCARD = 'DISCARD',
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
    case ActionType.SET_LANGUAGE:
      return { ...state, language: action.payload };
    case ActionType.DISCARD:
      return initialState;
    default:
      return state;
  }
};

const NewAdmin = () => {
  const { t } = useTranslation('profile');
  const [state, dispatch] = useReducer(reducer, initialState);
  const { showMessage } = useMessage();

  const handleSubmit = async () => {
    try {
      await createAdminSchema.validate(state);
      await registerAdmin(state);
      showMessage(t('adminCreatedSuccess'), 'success');
      dispatch({ type: ActionType.DISCARD, payload: {} });
    } catch (error) {
      if (error instanceof ValidationError) {
        showMessage(error.message, 'error');
      } else if (error instanceof AxiosError) {
        const message = error.response?.data.errors[0].message;
        showMessage(message, 'error');
      }
      return;
    }
  };

  const handleDiscard = () => {
    dispatch({ type: ActionType.DISCARD, payload: undefined });
  };

  return (
    <>
      <div className="flex flex-row gap-5">
        <Image width={25} height={25} src={UserAvatarIcon.src} alt="UserAvatarIcon" />
        <p className="font-Poppins text-[#080940] text-2xl font-semibold">{t('addNewAdmin')}</p>
      </div>
      <div className="flex flex-col w-12/12 gap-5 p-10">
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
          <div className="flex flex-col">
            <p className="font-open-sans text-[#273B54] font-semibold">{t('password')}</p>
            <input
              className="border-b border-gray-400 outline-none placeholder-open-sans placeholder-[#7C8DA6] font-normal"
              value={state.password}
              onChange={(e) => dispatch({ type: ActionType.SET_PASSWORD, payload: e.target.value })}
              type="password"
              placeholder="****************"
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
          <Button type="neutral" onClick={handleDiscard}>
            {t('cancel')}
          </Button>
          <Button type="info" onClick={handleSubmit}>
            {t('save')}
          </Button>
        </div>
      </div>
    </>
  );
};

export default NewAdmin;
